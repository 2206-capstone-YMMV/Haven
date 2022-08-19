import React, { useEffect, useState } from 'react'
import { Text, View } from "react-native";
import { auth } from '../firebase'
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore' 

export default function Message({ route }) {
    const { ConversationId } = route.params
    const [conversation, setConversation] = useState({})
    useEffect(
        () => 
            onSnapshot(query(collection(db, 'Messages'), where('ConversationId', '==', ConversationId)), (snapshot) =>
            setConversation(snapshot.docs.map(convo => {
                return convo.data()
            }))
            )
    ,[])
    let convos = []
    if (Array.isArray(conversation)){ //conversation is initially an empty object, would break the map function
        convos = conversation 
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {convos.map((convo,index) => <Text key={index}>{convo.content}</Text>)}
        </View>
    )
}