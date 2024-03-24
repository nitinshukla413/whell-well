import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Rating } from 'react-native-ratings';

// Dummy data for the list of requests
const requestData = [
  { id: '1', name: 'Joshua Njoroge', rating: 5 },
  { id: '2', name: 'Ann Nyokabi', rating: 4 },
  { id: '3', name: 'Mike Denis', rating: 5 },
  { id: '4', name: 'Dominic Silas', rating: 3 },
  { id: '5', name: 'Mary Jane', rating: 2 },
  // Add more items as needed
];

const RequestScreen = () => {
  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Requests</Text> */}
      <FlatList
        data={requestData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Image
              source={require('../../assest/images/avtar.png')} // Replace with your image path
              style={styles.avatar}
            />
            <View style={styles.textContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Rating
                imageSize={20}
                readonly
                startingValue={item.rating}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff', // or any color that matches your design
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f0f0f0', // or any color that matches your design
    borderRadius: 10,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Add styles for the rating component if needed
});

export default RequestScreen;
