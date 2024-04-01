import { Dimensions, StyleSheet, View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import React, { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { editUserData, getData, getUsersWithLatitudeKey } from '../../services/firestore';
import { getID } from '../../services/auth.js'
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setuserId] = useState('');
  const [allMarkedUser, setAllMarkedUser] = useState([]);
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCurrentLocation({ latitude, longitude });
  };
  const setId = async () => {
    const id = await getID()
    setuserId(id)
  }

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setLoading(false)
      alert("Permission to access location was denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setCurrentLocation(location.coords);
  };

  useEffect(() => {
    setLoading(true)
    setId()
    getLocation();
    setLoading(false)
  }, []);

  const handleTakeLocation = async () => {
    const id = await getID()
    editUserData({ userId: id, newData: { ...currentLocation } })
    alert("Location saved!")
  }
  useFocusEffect(useCallback(async () => {
    setLoading(true)
    let userData = await getData()
    await setId()
    const chatQuery = query(collection(db, 'users'), where('role', "!=", userData?.role || ''))
    const subscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chaats = [];
      querySnapShot.docs.forEach(doc => {
        const dt = doc.data();
        if (dt?.latitude) {
          chaats.push(doc.data())
        }
      })
      setAllMarkedUser(chaats);
    })
    setLoading(false)
    return subscribe;
  }, []))

  const navigation = useNavigation();

  const handlePress = (item) => {
    navigation.navigate('Chat', item)
  }
  console.log(currentLocation,"<currentLocation")

  return (
    <View style={styles.container}>
      {currentLocation && (
        <MapView
          loadingEnabled={loading}
          loadingBackgroundColor='transparent'
          loadingIndicatorColor='red'
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            pinColor="navy"
            draggable
          >
            <Callout>
              <Text>Current Location</Text>
            </Callout>
          </Marker>
          {allMarkedUser.map(marked => (
            <Marker
              key={marked.id}
              coordinate={{ latitude: marked.latitude, longitude: marked.longitude }}
              title={`${marked.fullName} - ${marked.role}`}
              pinColor={marked?.role == "Mechanic" ? "orange" : "tomato"}
              onCalloutPress={() => handlePress(marked)}
            >
              {marked._id === id ? (
                <Callout>
                  <Text>Your Location</Text>
                </Callout>
              ) : (
                <Callout>
                  <Text>{`${marked.fullName} - ${marked.role}`}</Text>
                  <Text style={{ fontSize: 12, color: '#808080' }}>Tap to chat</Text>
                </Callout>
              )}
            </Marker>
          ))}
        </MapView>
      )}
      {loading && <ActivityIndicator size={"large"} color={"tomato"} />}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleTakeLocation} style={{ marginVertical: 20, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'red', borderRadius: 20 }}>
          <Text style={{ color: 'white', fontSize: 15, fontWeight: '600', padding: 10, textAlign: 'center' }}>Save location</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonsContainer}>
        <Text style={{ fontStyle: 'italic', fontSize: 15, textAlign: 'center', width: 'full', color: 'rgba(0,0,0,0.6)', backgroundColor: 'white' }}>Drag blue marker to set your location</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  map: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
  },
});

export default HomeScreen;
