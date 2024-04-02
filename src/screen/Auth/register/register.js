import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import logo from "../../../assest/images/logo.png";
import { useNavigation } from '@react-navigation/native';
import {  registerUser } from '../../../services/firebase';
import { getData } from '../../../services/firestore';
const Register = ({setIsAuthenticated}) => {
    const navigation = useNavigation()
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  
const handleSignUp=async()=>{
  setLoading(true)
  if (!email || !password || email?.length === 0 || password?.length === 0||role?.length===0) {
    Alert.alert('Please fill required fields');
  }
 const {fail=false,message=''}=await registerUser({email,password,role,fullName})
 await getData()
 if(fail){
  Alert.alert(message);
 }else{
  setIsAuthenticated(true)
 }
 setLoading(false)
}
  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.header}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Full Names"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <RNPickerSelect
        onValueChange={setRole}
        items={[
          { label: 'Mechanic', value: 'Mechanic' },
          { label: 'Motorist', value: 'Motorist' }
        ]}
        style={pickerSelectStyles}
        placeholder={{ label: "Select a role...", value: null }}
      />
      <TouchableOpacity onPress={handleSignUp} style={styles.button}>
      {loading && <ActivityIndicator color="tomato"/>}
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={()=>{navigation.navigate('Login')}}>
        <Text style={styles.buttonText1}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    alignSelf: 'center',
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
  logo: {
    width: '50%',
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    objectFit:'cover',
  },
  buttonText1: {
    color: 'red',
    fontSize: 18,
    marginTop:16,
    fontWeight: 'bold',
    textAlign:'center'
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    marginBottom: 15,
    width: '100%',
    backgroundColor: '#f7f7f7',
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#dddddd',
    borderRadius: 5,
    color: 'black',
    paddingRight: 30,
    marginBottom: 15,
    width: '100%',
    backgroundColor: '#f7f7f7',
  },
});

export default Register;
