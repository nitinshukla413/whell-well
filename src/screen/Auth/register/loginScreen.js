import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import logo from "../../../assest/images/logo.png"; 
import { useNavigation } from '@react-navigation/native';
import { loginUser } from '../../../services/firebase';
import { getData } from '../../../services/firestore';
const LoginScreen = ({ setIsAuthenticated }) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async() => {
    if(!email||!password){
      Alert.alert('Invalid password');
    }
    setLoading(true)
    const user=await loginUser({email,password});
    await getData()
    if(user?.fail){
      Alert.alert(user?.message||'Invalid password');
     }
     if(!!user && !user?.fail){
      setIsAuthenticated(true);
    }
     setLoading(false)
  };
  

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        {loading && <ActivityIndicator color="tomato"/>}
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.buttonText1}>Don't have an account? SignUp</Text>
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
  logo: {
    width: '50%',
    height: 130,
    resizeMode: 'contain',
    alignSelf: 'center',
    objectFit:'cover',
    borderColor:'black'
    // marginBottom: 2,
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
  buttonText1: {
    color: 'red',
    fontSize: 18,
    marginTop:17,
    fontWeight: 'bold',
    textAlign:'center'
  },
});

export default LoginScreen;
