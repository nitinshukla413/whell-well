import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../services/firebase';
import {  getData } from '../../services/firestore';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { getID } from '../../services/auth';

const AllChat = () => {
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [user, setUser] = useState({});
  const navigation = useNavigation();
  const handlePress=(item)=>{
    navigation.navigate('chatWithPerson',item)
  }
  const handleFetch=async()=>{
    setLoading(true)
    let userData=await getData()
    setUser(userData);
    console.log(userData?.role,"<ROLE")
     const dataID=await getID()
     let data={_id:dataID}
    const chatQuery=query(collection(db,'users'), where('role', "!=", userData?.role))
     const subscribe=onSnapshot(chatQuery,(querySnapShot)=>{
     const chaats=[];
     querySnapShot.docs.forEach(doc=>{
      const dt=doc.data();
      if(dt?._id!=data?._id)
      chaats.push( doc.data())
    });

    setChats(chaats);
    setLoading(false)

   })
   return subscribe
  }
useEffect(()=>{ 
  if(user?._id){
    return
  }
  handleFetch()
},[user])
  return (
    <View style={styles.container}>
    {loading &&  <ActivityIndicator color="tomato"/>}
      <FlatList
        data={chats}
        ListEmptyComponent={()=><View style={{height:'100%',justifyContent:'center',alignItems:'center',padding:10}}><Text style={{fontSize:20,color:'#000'}}>No Chats Available</Text></View>}
        renderItem={({item})=>renderItem({item,handlePress})}
      />
    </View>
  );
};
const Avatar = ({ initials }) => (
    <View style={styles.avatarContainer}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
export const renderItem = ({ item ,handlePress,color=''}) => {
    return (
        <TouchableOpacity style={{backgroundColor:color}} onPress={() => handlePress(item)}>
        <View style={styles.messageContainer}>
          <Avatar initials={item.fullName.charAt(0)} />
          <View style={styles.messageContent}>
            <Text style={styles.sender}>{item.fullName}</Text>
            <Text style={styles.message}>{item.role}</Text>
          </View>
        </View>
      </TouchableOpacity>
  );}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageText: {
    fontSize: 16,
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageContent: {
    flex: 1,
  },
  message: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AllChat;
