import React, { useEffect, useState } from 'react'
import { Text, View } from "react-native";
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore' 

export default function Profile({ navigation }) {
    const handleSignOut = () => {
        signOut(auth)
        .then(() => {
            navigation.navigate('Login')
        })
    }
    const [profile, setProfile] = useState({})
    useEffect(
        () => 
            onSnapshot(query(collection(db, 'users'), where('uid', '==', auth.currentUser?.uid)), (snapshot) =>
            setProfile(snapshot.docs[0].data())
            )
    ,[])

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <Text>Hello {profile.name}</Text>
            <Text>role: {profile.role}</Text>
            <Text>email: {profile.email}</Text>
            <Text
                onPress={handleSignOut}
                style={{ fontSize: 26, fontWeight: "bold" }}
            >
                Sign Out
            </Text>
        </View>
    )
}