import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, } from "react-native";
import { auth } from '../firebase'
import { db } from '../firebase'
import { collection, onSnapshot, query, where, addDoc, getDoc, doc } from 'firebase/firestore' 

export default function Message({ route }) {
    const { ConversationId } = route.params
    const [conversation, setConversation] = useState([])
    const [message, setMessage] = useState('')
    const [displayName, setDisplayName] = useState('')
    
    query(collection(db, 'users'), where('uid', '==', auth.currentUser?.uid)), (snapshot) =>
            setDisplayName(snapshot.docs[0].data())
    console.log(displayName)

    // getDoc(doc(db, 'users', auth.currentUser.uid))
    //     .then(doc => setDisplayName(doc.data().name))
    // console.log(auth.currentUser.uid)
    useEffect(
        () => 
            onSnapshot(query(collection(db, 'Messages'), where('ConversationId', '==', ConversationId)), (snapshot) =>
            setConversation(snapshot.docs.map(convo => {
                return convo.data()
            }).sort((a,b) => a.timestamp - b.timestamp))
            )
    ,[])

    const handleSend = () => {
  
        addDoc(collection(db, 'Messages'),{ConversationId, timestamp: Date.now(), content: displayName + ':' + message})
        .then(() => {
          setMessage('')
        })
        .catch(error => alert(error.message))
    }
    
    return (
        <KeyboardAvoidingView style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {conversation.map((convo,index) => <Text key={index}>{convo.content}</Text>)}
            <View style={styles.inputContainer}>
                <TextInput 
                placeholder='Message'
                value={message}
                 onChangeText={text => setMessage(text)}
                style={styles.input}
                />
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={handleSend}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    inputContainer: {
      width: '80%'
    },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      marginTop: 5,
    },
    buttonContainer: {
      width: '60%',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 40,
    },
    button: {
      backgroundColor: '#0782F9',
      width: '100%',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonOutline: {
      backgroundColor: 'white',
      marginTop: 5,
      borderColor: '#0782F9',
      borderWidth: 2,
    },
    buttonText: {
      color: 'white',
      fontWeight: '700',
      fontSize: 16,
    },
    buttonOutlineText: {
      color: '#0782F9',
      fontWeight: '700',
      fontSize: 16,
    },
  })