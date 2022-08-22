import React, { useEffect, useState } from 'react'
import { Text, View } from "react-native";
import { auth } from '../firebase'
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore' 

export default function MessagesTab({ navigation }) {
    const [conversations, setConversations] = useState({})
    useEffect(
        () => 
            onSnapshot(query(collection(db, 'Conversations'), where('user', '==', auth.currentUser?.uid)), (snapshot) =>
            setConversations(snapshot.docs.map(convo => {
                return convo.data()
            }))
            )
    ,[])
    let convos = []
    if (Array.isArray(conversations)){ //conversations is initially an empty object, would break the map function
        convos = conversations 
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {convos.map((convo,index) => <Text key={index} onPress={() => navigation.navigate('Message', {ConversationId: convo.ConversationId})}>Conversation with {convo.otherUser}</Text>)}
        </View>
    )
}