import { Dimensions, StyleSheet, View, Button, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import React, { useCallback, useEffect, useState } from "react";
import * as Location from "expo-location";
import { editUserData, getData, getUsersWithLatitudeKey } from '../../services/firestore';
import { getID } from '../../services/auth.js'
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
const HomeScreen = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setuserId] = useState('');
  const [allMarkedUser, setAllMarkedUser] = useState([]);
  const [initialRegion, setInitialRegion] = useState(null);
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setCurrentLocation({ latitude, longitude });
  };
  const setId = async () => {
    const id = await getID()
    setuserId(id)
  }
  useEffect(() => {
    setLoading(true)
    setId()
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setLoading(false)
        alert("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      console.log(location, ">location")
      setCurrentLocation(location.coords);
      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    };
    setLoading(false)

    getLocation();
  }, []);

  const handleZoomIn = () => {
    setInitialRegion({
      ...initialRegion,
      latitudeDelta: Math.max(initialRegion.latitudeDelta / 2, 0.001),
      longitudeDelta: Math.max(initialRegion.longitudeDelta / 2, 0.001),
    });
  };
  const handleZoomOut = () => {
    setInitialRegion({
      ...initialRegion,
      latitudeDelta: initialRegion.latitudeDelta * 2,
      longitudeDelta: initialRegion.longitudeDelta * 2,
    });
  };
  const handleTakeLocation = async () => {
    const id = await getID()
    editUserData({ userId: id, newData: { ...currentLocation } })
    alert("Location saved!")
  }
  useFocusEffect(useCallback(async () => {
    setLoading(true)
    await setId()
    const chatQuery = query(collection(db, 'users'))
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
  console.log(allMarkedUser, id, "<<allMarkedUser")
  const navigation = useNavigation();
  const handlePress = (item) => {
    navigation.navigate('chat', item)
  }
  return (
    <View style={styles.container}>
      <MapView
        loadingEnabled={true}
        loadingBackgroundColor='transparent'
        loadingIndicatorColor='red'
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={initialRegion}
        onPress={handleMapPress}>
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="Your Location"
            pinColor="red" // Change color of the current location marker
          >
            <Callout>
              <Text>Current Location</Text>
            </Callout>
          </Marker>
        )}
        {allMarkedUser.map(marked => {
          console.log(marked?._id===id,"<marked?._id")
          return(
          <Marker
            key={marked.id}
            coordinate={{ latitude: marked.latitude, longitude: marked.longitude }}
            title={`${marked.fullName} - ${marked.role}`}
            pinColor="red" // Change color of other markers
            onCalloutPress={() => handlePress(marked)}
          >
          {marked?._id===id?<Callout><Text>Your Location</Text></Callout>:  <Callout>
              <Text>{`${marked.fullName} - ${marked.role}`}</Text>
              <Text style={{ fontSize: 12, color: '#808080' }}>Tap to chat</Text>
            </Callout>}
          </Marker>
        )})}
      </MapView>
      <View style={styles.buttonsContainer}>
        {loading && <ActivityIndicator size={"large"} color={"tomato"} />}
        <TouchableOpacity onPress={handleZoomIn} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'tomato', height: 40, width: 40, borderRadius: 40 }}><Text style={{ color: 'white', fontSize: 30, textAlign: 'center' }}>+</Text></TouchableOpacity>
        <TouchableOpacity onPress={handleTakeLocation} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'tomato', borderRadius: 20 }}><Text style={{ color: 'white', fontSize: 15, fontWeight: '600', padding: 10, textAlign: 'center' }}>Save location</Text></TouchableOpacity>
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
