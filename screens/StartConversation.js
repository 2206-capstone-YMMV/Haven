import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from "react-native";
import { auth } from '../firebase'
import { db } from '../firebase'
import { collection, onSnapshot, query, where, addDoc } from 'firebase/firestore' 

export default function MessagesTab({ navigation, route }) {
    
    const [people, setPeople] = useState([])

    let { conversations } = route.params
            let talking = []
            conversations.forEach(convo => { //Making an array with all users this user is talking to
                talking.push(convo.user)
                talking.push(convo.otherUser)
            })
            if (talking.length === 0){ //if no conversations have been started only exclude the current user. not-in needs none empty array
                talking.push(auth.currentUser.uid)
            }
            console.log('Starting New Conversation')

    useEffect(
        () => 
            onSnapshot(query(collection(db, 'users'), where('uid', 'not-in', talking)), (snapshot) =>
            setPeople(snapshot.docs.map(user => {
                console.log('hi')
                return user.data()
            }))),
          [])

    const newConversation = (person) => {
        addDoc(collection(db, 'Conversations'),{user: auth.currentUser.uid, otherUser: person.uid, conversationId: auth.currentUser.uid + person.uid})
        .catch(error => alert(error.message))
        addDoc(collection(db, 'Conversations'),{user: person.uid, otherUser: auth.currentUser.uid, conversationId: auth.currentUser.uid + person.uid})
        .then(navigation.navigate('Messages'))
        .catch(error => alert(error.message))
    }
    
    return (
        <View style={{ flex: 1, alignItems: 'center'}}>
            <Text style={styles.header}>Start a new conversation with</Text>
            {people.map((person,index) => <Text key={index} style={styles.person} onPress={() => newConversation(person)}>{person.name}</Text>)}
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        fontSize: '20%'
    },
    person: {
        backgroundColor: 'white',
        paddingVertical: 5,
        paddingHorizontal: 5,
        marginTop: 5,
        borderRadius: 10
    }
})