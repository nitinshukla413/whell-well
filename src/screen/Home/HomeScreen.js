import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
   <MapView
    style={styles.map}
  initialRegion={{
    latitude:28.644800,
    longitude: 77.216721,
    latitudeDelta: 0.01,
    longitudeDelta: 0.04,
  }}
/>
  </View>
  );
};

// Styles for the container and map view
const styles = StyleSheet.create({
  container: {
    height:Dimensions.get('window').height,
    width:Dimensions.get('window').width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    height:'100%',
    width:'100%',
    borderWidth:2,
  },
});

export default HomeScreen;
