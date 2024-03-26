import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { getData } from '../../services/firestore';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { renderItem as Header } from '../allChat';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import { db } from '../../services/firebase';

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const route = useRoute();
  const [user, setUser] = useState({});
  const flatListRef = useRef(null);
  let receiver = route.params; //blessin
  let chatId = user._id + receiver._id;

  const sendMessage = async () => {
    setLoading(true)
    if (text.trim().length == 0) {
      return;
    }
    let id = `${Date.now()}`;
    const timeStamp = serverTimestamp()
    const _doc = {
      _id: id,
      user: user,
      timeStamp,
      senderId: user._id,
      receiverId: receiver._id,
      senderName: user.fullName,
      chatId,
      message: text,
    }
    setText("")
    await addDoc(collection(doc(db, 'chats', receiver._id), 'messages'), _doc).then(() => { }).catch(err => {
      console.log(err, "ERR");
    })
    setLoading(false)
  };
  const handleFetch = async () => {
    if (!user || !user?._id) {
      const data = await getData()
      console.log(data, "<uid")
      setUser(data)
    }
  }
  useLayoutEffect(() => {
    setLoading(true)
    if (!user._id)
      return;
    const msgQuery = query(collection(doc(db, 'chats', user._id), 'messages'), orderBy('timeStamp', 'asc'))
    const unsubscribe = onSnapshot(msgQuery, (querySnap) => {
      const upMsg = []
      querySnap.docs.forEach(doc => {
        const dt = doc.data()
        console.log(dt, "<dt")
        upMsg.push(dt)
      });
      setMessages(upMsg)
      console.log(upMsg, "<upMsg")
      flatListRef.current.scrollToEnd({ animated: true });
    })
    setLoading(false)

    return unsubscribe;
  }, [user])

  useFocusEffect(useCallback(() => {
    handleFetch();
  }, [receiver]))
  const renderItem = ({ item }) => {
    const isSentMessage = item.senderId === user._id;
    return (
      <View style={[styles.messageContainer, isSentMessage ? styles.sentMessage : styles.receivedMessage]}>
        <View style={styles.messageContent}>
          <Text style={styles.sender}>{isSentMessage ? 'Me' : item.senderName}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!!receiver && Header({ color: '#D3D3D3', item: receiver, handlePress: () => { } })}
      <View style={{ paddingVertical: 20 }}></View>
      {loading && <ActivityIndicator color="tomato" />}
      <FlatList
        ref={flatListRef}
        keyboardShouldPersistTaps="handled"
        data={messages}
        renderItem={renderItem}
        style={{ paddingHorizontal: 10 }}
        ListEmptyComponent={() => <View style={{ justifyContent: 'center', alignItems: 'center' }}><Text>No Chats Available</Text></View>}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    maxWidth: '80%',
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(236, 100, 75,0.2)', // Example color for sent messages
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff', // Example color for received messages
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  messageContent: {
    padding: 10,
  },
  sender: {
    fontWeight: 'bold',
    marginBottom: 5,
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

export default ChatScreen;
