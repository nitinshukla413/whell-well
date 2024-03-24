import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const HomeScreen = () => {
  // Set the initial region (latitude and longitude) to your desired location
  const initialRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };
  const markers = [
    { latitude: 37.78825, longitude: -122.4324, title: 'Marker 1', description: 'Description 1' },
    { latitude: 37.75825, longitude: -122.4424, title: 'Marker 2', description: 'Description 2' },
    // Add more markers here
  ];
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        // Enable user location with showsUserLocation={true}
        showsUserLocation={true}
      >
  {markers.map((marker, index) => (
          <Marker
            key={index}
            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
            title={marker.title}
            description={marker.description}
          />
        ))}
            </MapView>
      {/* Your other UI components here */}
    </View>
  );
};

// Styles for the container and map view
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default HomeScreen;
