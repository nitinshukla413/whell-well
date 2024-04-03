import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { forgotPassword } from '../../../services/firebase'; // Importing forgotPassword function

const ForgotPassword = () => {
  const [emailAddress, setEmailAddress] = useState('');

  const handleResetPassword = async () => {
    
    if (!emailAddress) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const { message, fail } = await forgotPassword(emailAddress);
    if (fail) {
      Alert.alert('Error', message);
    } else {
      Alert.alert('Success', message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, { marginTop: 40 }]}
        placeholder="Email Address"
        onChangeText={setEmailAddress}
        autoCapitalize="none"
      />
      <TouchableOpacity style={[styles.button, { marginTop: 20 }]} onPress={handleResetPassword}>
        <Text style={{   color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',}}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    width: '100%',
    height: 50,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f7f7f7',
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#000000',
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
