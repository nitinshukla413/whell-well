import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Setting = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const SettingOption = ({ title, iconName, onPress, isSwitch, switchValue, onSwitchChange }) => {
    return (
      <TouchableOpacity style={styles.option} onPress={onPress} disabled={isSwitch}>
        <Ionicons name={iconName} size={24} style={styles.icon} />
        <Text style={styles.optionText}>{title}</Text>
        {isSwitch && (
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={switchValue ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={onSwitchChange}
            value={switchValue}
          />
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
<SettingOption
  title="Profile Settings"
  iconName="ios-person"
  onPress={() => navigation.navigate('ProfileSetting')} // Add navigation here
/>
      <SettingOption
        title="Notifications Settings"
        iconName="ios-notifications"
        isSwitch
        switchValue={notificationsEnabled}
        onSwitchChange={(newValue) => setNotificationsEnabled(newValue)}
      />
      <SettingOption
  title="Change Password"
  iconName="ios-lock-closed"
  onPress={() => navigation.navigate('ChangePassword')} 
/>


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  icon: {
    color: 'tomato',
    marginRight: 15,
  },
  optionText: {
    fontSize: 18,
    color: '#333333',
    flex: 1,
  },
  touchableArea: {
    flex: 1,
  },
});

export default Setting;
