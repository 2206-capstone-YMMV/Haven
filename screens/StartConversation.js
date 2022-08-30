import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView } from "react-native";
import { auth } from '../firebase'
import { db } from '../firebase'
import { collection, onSnapshot, query, where, addDoc } from 'firebase/firestore' 

export default function MessagesTab({ navigation, route }) {
    
    const [people, setPeople] = useState([])
    const [search, setSearch] = useState('')

    const filteredPeople = people.filter((user) => {
        return user.name.indexOf(search) >= 0
    })

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
            <Text style={styles.header}>New Conversation</Text>
            <TextInput 
                style={styles.textInput}
                value={search}
                placeholder='Search By Name'
                underlineColorAndroid='transparent'
                onChangeText={(text) => setSearch(text)}
            />
            <ScrollView contentContainerStyle={styles.list}>
                {filteredPeople.map((person,index) => <Text key={index} style={styles.person} onPress={() => newConversation(person)}>{person.name}</Text>)}
            </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
    header: {
        fontSize: '50%'
    },
    list: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center"
    },
    person: {
        backgroundColor: 'white',
        padding: 20,
        margin: 10,
        borderRadius: 10,
        borderColor: "black",
        borderWidth: 5,
        overflow: "hidden",
        fontSize: 20,
    },
    textInput: {
        width: '70%',
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        fontSize: 16,
        paddingVertical: 8,
        marginBottom: 30,
        borderColor: '#009688',
        backgroundColor: 'white',
      },
})