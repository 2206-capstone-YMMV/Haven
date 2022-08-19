import * as React from "react";
import { Text, View } from "react-native";
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
export default function Profile({ navigation }) {
    const handleSignOut = () => {
        signOut(auth)
        .then((re) => {
      
            navigation.navigate('Login')
        })
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text
            onPress={() => navigation.navigate('Map')}
            style={{ fontSize: 26, fontWeight: "bold" }}>Profile Screen</Text>
             <Text
            onPress={handleSignOut}
            style={{ fontSize: 26, fontWeight: "bold" }}>Sign Out</Text>
        </View>
    )
}