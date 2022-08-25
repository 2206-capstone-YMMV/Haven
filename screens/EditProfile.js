import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/core'
import { db } from '../firebase'
import { collection, onSnapshot, query, where, updateDoc, doc} from 'firebase/firestore' 

const EditProfile = () => {
    const navigation = useNavigation()

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [role, setRole] = useState('')
    const [id, setId] = useState('')
    const colRef = collection(db, 'users')

    useEffect(
        () => 
            onSnapshot(query(colRef, where('uid', '==', auth.currentUser?.uid)), (snapshot) => {
            console.log('Grabbing Profile data')
            let user = snapshot.docs[0].data()
            setEmail(user.email)
            setName(user.name)
            setRole(user.role)
            setId(snapshot.docs[0].id)
        })
    ,[])

    const Edit = () => {
        updateDoc(doc(db, 'users', id), {email, name, role})
        .then(navigation.navigate('Profile'))
    }

  return (
    <View>
        <TextInput style={styles.input} onChangeText={text => setName(text)} />
        <TextInput style={styles.input} onChangeText={text => setEmail(text)} />
        <TextInput style={styles.input} onChangeText={text => setRole(text)}/>

        <TouchableOpacity
            onPress={Edit}
            style={[styles.button]}
        >
            <Text style={styles.buttonOutLineText}>Edit Profile</Text>
        </TouchableOpacity>
    </View>
  )
}

export default EditProfile

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