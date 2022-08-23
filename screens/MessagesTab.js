import React, { useEffect, useState } from 'react'
import { Text, View } from "react-native";
import { auth } from '../firebase'
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore' 

export default function MessagesTab({ navigation }) {
    const [conversations, setConversations] = useState([])
    useEffect(
        () => 
            onSnapshot(query(collection(db, 'Conversations'), where('user', '==', auth.currentUser?.uid)), (snapshot) =>
            setConversations(snapshot.docs.map(convo => {
                return {id: convo.id, data: convo.data()}
            }))
            )
    ,[])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text onPress={() => navigation.navigate('NewConversation', {conversations })}>New Conversation</Text>
            {conversations.map((convo,index) => <Text key={index} onPress={() => navigation.navigate('Message', {ConversationId: convo.id})}>Conversation with {convo.data.otherUser}</Text>)}
        </View>
    )
}