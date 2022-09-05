import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/core'
import { db } from '../firebase'
import { collection, onSnapshot, query, where, updateDoc, doc} from 'firebase/firestore' 
import DropDownPicker from "react-native-dropdown-picker";
import { useFonts } from "expo-font";

const EditProfile = () => {
    const navigation = useNavigation()

    const [name, setName] = useState('')
    const [open, setOpen] = useState(false);
    const [role, setRole] = useState("");
    const [items, setItems] = useState([
      { label: "User", value: "user" },
      { label: "Helper", value: "helper" },
    ]);
    const [id, setId] = useState('')
    const colRef = collection(db, 'users')

    const [fontsLoaded] = useFonts({
      "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
      "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
      "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
      "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
      "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
    });

    useEffect(
        () => 
            onSnapshot(query(colRef, where('uid', '==', auth.currentUser?.uid)), (snapshot) => {
            console.log('Grabbing Profile data')
            let user = snapshot.docs[0].data()
            setName(user.name)
            setRole(user.role)
            setId(snapshot.docs[0].id)
        })
    ,[])

    const Edit = () => {
        updateDoc(doc(db, 'users', id), {name, role})
        .then(navigation.navigate('Profile'))
    }

    const editAlert = () => {
      Alert.alert(
        `Is this edit ok?`,
        `Name: ${name}, Role: ${role}`,
        [
          {
            text: "Submit",
            onPress: () => Edit()
          },
          {
            text: "Cancel",
            style: "cancel"
          }
        ]
      )
    }

  return (
    <View style={styles.container}>
        <Image source={require('../gifs/puzzle-piece.png')} style={styles.profileImage} />
        <TextInput style={styles.input} placeholder="Full Name" onChangeText={text => setName(text)} />
        <DropDownPicker
        open={open}
        value={role}
        items={items}
        setOpen={setOpen}
        setValue={setRole}
        setItems={setItems}
        style={styles.dropdown}
      />

        <TouchableOpacity
            onPress={editAlert}
            style={[styles.button]}
        >
            <Text style={styles.buttonOutLineText}>Edit Profile</Text>
        </TouchableOpacity>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  profileImage: {
    margin: 50,
    alignSelf: "center",
    borderColor: '#FFF',
    borderRadius: 55,
    borderWidth: 3,
    height: 110,
    width: 110,
  },
    input: {
      backgroundColor: 'white',
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      margin: 20,
      fontFamily: "signika-regular"
    },
    dropdown: {
      alignSelf: "center",
      marginBottom: 50,
      width: "90%",
      fontFamily: "signika-regular"
    },
    button: {
      alignItems: 'center',
    },
    buttonOutLineText: {
      fontSize: 20,
      fontFamily: "signika-bold",
      color: "white"
    },
    container: {
      height: "100%",
      backgroundColor: "#251934"
    }
  })