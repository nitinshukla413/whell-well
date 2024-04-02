import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Ionicons from "react-native-vector-icons/Ionicons";
import { onAuthStateChanged } from "firebase/auth";
import LoginScreen from "./src/screen/Auth/register/loginScreen";
import RegisterScreen from "./src/screen/Auth/register/register";
import HomeScreen from "./src/screen/Home/HomeScreen";
import ChatScreen from "./src/screen/chat/ChatScreen";
import Setting from "./src/screen/setting/Setting";
import ProfileSetting from "./src/screen/Profilesetting/ProfileSetting";
import PasswordChange from "./src/screen/Auth/register/PasswordChange";
import { auth } from "./src/services/firebase";
import { checkAuthenticated } from "./src/services/auth";
import { getData } from "./src/services/firestore";
import AllChat from "./src/screen/allChat";
import { setUser } from "./src/services/storage";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";
import * as SplashScreen from 'expo-splash-screen';
const Tab = createBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const SettingStack = createNativeStackNavigator();
const ChatStack = createNativeStackNavigator();
LogBox.ignoreAllLogs()
SplashScreen.preventAutoHideAsync();
const SettingStackScreen = ({ setIsAuthenticated }) => (
  <SettingStack.Navigator>
    <SettingStack.Screen
      name="Setting"
      component={(props) => (
        <Setting {...props} setIsAuthenticated={setIsAuthenticated} />
      )}
      options={{ headerShown: false }}
    />
    <SettingStack.Screen
      name="ChangePassword"
      component={PasswordChange}
      options={{ headerShown: false }}
    />
    <SettingStack.Screen
      name="ProfileSetting"
      component={ProfileSetting}
      options={{ headerShown: false }}
    />
  </SettingStack.Navigator>
);

const ChatStackScreen = () => (
  <ChatStack.Navigator>
    <ChatStack.Screen
      name="Chat"
      component={AllChat}
      options={{ headerShown: false }}
    />
    <ChatStack.Screen
      name="chatWithPerson"
      component={ChatScreen}
      options={{ headerShown: false }}
    />
  </ChatStack.Navigator>
);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const handleFetch = async () => {
    const data = await getData();
    setUser(data);
  };
  useEffect(async () => {
    let subscribed;
    setTimeout(() => {
      SplashScreen.hideAsync()
    }, 5000);
    const user = checkAuthenticated();
    if (user) {
      handleFetch();
      setIsAuthenticated(true);
       
      return;
    } else {
      subscribed = onAuthStateChanged(auth, (user) => {
        if (user) setIsAuthenticated(true);
      });
    }
    return () => subscribed();
  }, []);

  const AuthStackScreen = () => (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login">
        {(props) => (
          <LoginScreen {...props} setIsAuthenticated={setIsAuthenticated} />
        )}
      </AuthStack.Screen>
      <AuthStack.Screen name="Register">
        {(props) => (
          <RegisterScreen {...props} setIsAuthenticated={setIsAuthenticated} />
        )}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );

  const MainAppTabs = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "ios-home" : "ios-home-outline";
          } else if (route.name === "Request") {
            iconName = focused ? "ios-hand-left" : "ios-hand-left-outline";
          } else if (route.name === "Chat") {
            iconName = focused ? "ios-chatbubble" : "ios-chatbubble-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "ios-settings" : "ios-settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarLabel: () => null,
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Home"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      {/* <Tab.Screen name="Request" component={RequestScreen} /> */}
      <Tab.Screen name="Chat" component={ChatStackScreen} />
      <Tab.Screen
        name="Settings"
        component={(props) => (
          <SettingStackScreen
            {...props}
            setIsAuthenticated={setIsAuthenticated}
          />
        )}
      />
    </Tab.Navigator>
  );

  return (
    <NavigationContainer>
      <StatusBar translucent barStyle="light-content" backgroundColor={"red"} />
      {isAuthenticated ? <MainAppTabs /> : <AuthStackScreen />}
    </NavigationContainer>
  );
};

export default App;
