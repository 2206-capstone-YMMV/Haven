import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from "react-native";
import { auth } from '../firebase'
import { db } from '../firebase'
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore' 

export default function MessagesTab({ navigation }) {
    const [conversations, setConversations] = useState([])
    const [otherUsers, setOtherUsers] = useState([])

    useEffect(
        () => 
            onSnapshot(query(collection(db, 'Conversations'), where('user', '==', auth.currentUser?.uid)), (snapshot) =>
            setConversations(snapshot.docs.map(convo => {
                console.log('Grabbing conversations')
                return convo.data()
            }))
            )
        ,[])
    
    const conversationIds = conversations.map(convo => convo.conversationId)
    const otherUsersId = conversations.map(convo => convo.otherUser)

    if (otherUsersId.length === 0){
        otherUsersId.push('aaaaaaaaaaa')
    }

    if (conversations.length > 0 && otherUsers.length === 0){ //After the conversations have been grabbed, but dont want this to repeat when page rerenders
            getDocs(query(collection(db, 'users'), where('uid', 'in', otherUsersId)))
            .then(users =>
            setOtherUsers(users.docs.map(user => {
                console.log('Grabbing Friends')
                return user.data()
            })))
        }

    
    const names = otherUsersId.map(id => { //lining up names with the order of the conversationIds
        for (let i = 0; i < otherUsers.length; i++){
            if (otherUsers[i].uid === id){
                return otherUsers[i].name
            }
        }
    })

    return (
        <View style={{ flex: 1, alignItems: 'center'}}>
            <Text style={[styles.convo, styles.new]} onPress={() => navigation.navigate('NewConversation', {conversations })}>New Conversation</Text>
            {conversationIds.map((conversationId,index) => <Text key={index} style={styles.convo} onPress={() => navigation.navigate('Message', {conversationId})}>Conversation with {names[index]}</Text>)}
        </View>
    )
}

const styles = StyleSheet.create({
    new: {
        marginBottom: '10%'
    },
    convo: {
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginTop: 5,
        borderRadius: 10
    }
})