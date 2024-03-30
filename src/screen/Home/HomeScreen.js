import { Dimensions, StyleSheet, View, Button, TouchableOpacity, Image, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { editUserData, getData, getUsersWithLatitudeKey } from '../../services/firestore';
import { getID } from '../../services/auth.js'
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../services/firebase';
const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [user, setUser] = useState({});
  const [allMarkedUser, setAllMarkedUser] = useState([]);
  const [initialRegion, setInitialRegion] = useState(null);
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  console.log(user, "<user")
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCurrentLocation({ latitude, longitude });
  };
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };

    getLocation();
  }, []);

  const handleZoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };

  const handleZoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };
  const handleTakeLocation = async () => {
    const id = await getID()
    editUserData({ userId: id, newData: { ...currentLocation } })
  }
  useEffect(async () => {
    const dataID=await getID()
    const chatQuery = query(collection(db, 'users'))
    const subscribe = onSnapshot(chatQuery, (querySnapShot) => {
      const chaats = [];
      querySnapShot.docs.forEach(doc => {
        const dt = doc.data();
      if (dt?.latitude && dt?._id!=dataID) {
          chaats.push(doc.data())
        }
      })
      setAllMarkedUser(chaats);
    })

    if (user._id) {
      return;
    }
    const data = await getData()
    setUser(data)
    return subscribe;
  }, [])
  console.log(allMarkedUser, "<allMarkedUser")
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={{
          latitude: 22.258,
          longitude: 71.19,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onPress={handleMapPress}>
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
            draggable
          />
        )}
        {
          allMarkedUser?.map(marked => <Marker
            coordinate={{
              latitude: marked.latitude,
              longitude: marked.longitude,
            }}
            title={marked.fullName + " - " + marked.role}
            draggable
          />)
        }
      </MapView>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={handleZoomIn} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'tomato', height: 40, width: 40, borderRadius: 40 }}><Text style={{ color: 'white', fontSize: 30, textAlign: 'center' }}>+</Text></TouchableOpacity>
        {!(user?.latitude && user?.longitude) ?
          <TouchableOpacity onPress={handleTakeLocation} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'tomato', borderRadius: 20 }}><Text style={{ color: 'white', fontSize: 15, fontWeight: '600', padding: 10, textAlign: 'center' }}>Save location</Text></TouchableOpacity> : <></>}
        <TouchableOpacity onPress={handleZoomOut} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'tomato', height: 40, width: 40, borderRadius: 40 }}><Text style={{ color: 'white', fontSize: 30, textAlign: 'center' }}>-</Text></TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the container, map view, and buttons container
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  map: {
    width: Dimensions.get('window').width,
    height: '90%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'transparent',
  },
});

export default HomeScreen;
