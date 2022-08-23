import React, { useEffect, useState } from 'react'
import { Text, View } from "react-native";
import { auth } from '../firebase'
import { db } from '../firebase'
import { collection, onSnapshot, query, where, getDocs } from 'firebase/firestore' 

export default function MessagesTab({ navigation, route }) {
    
    const [people, setPeople] = useState([])

    useEffect(
        () => {
            let { conversations } = route.params
            let talking = []
            conversations.forEach(convo => { //Making an array with all users this user is talking to
                talking.push(convo.user)
                talking.push(convo.otherUser)
            })
            getDocs(query(collection(db, 'users'), where('uid', 'not-in', talking)))
            .then(users => setPeople(users.docs.map(user => user.data())))
            
          })

    const newConversation = (person) => {
        addDoc(collection(db, 'Conversations'),{user: auth.currentUser.uid, otherUser: person.uid})
        .catch(error => alert(error.message))
    }
    
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            {people.map((person,index) => <Text key={index} onClick={() => newConversation(person)}>{person.name}</Text>)}
        </View>
    )
}