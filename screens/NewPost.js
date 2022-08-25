import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { db } from '../firebase'
import { collection, onSnapshot, query, where, addDoc, serverTimestamp } from 'firebase/firestore' 
import * as Location from "expo-location";

import { useNavigation } from '@react-navigation/core'
import { auth } from '../firebase'

const NewPost = () => {
    const navigation = useNavigation()
    const [location, setLocation] = useState('');
    const [errorMsg, setErrorMsg] = useState(null);
    const [description, setDescription] = useState('')
    const [contents, setContents] = useState('')
    const [profile, setProfile] = useState({})
    const colRef = collection(db, 'Post')
    
    useEffect(() => {
        (async () => {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return;
          }
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location);
        })();
      }, []);
      let text = "Waiting...";
      let lat;
      let lon;
    
      if (errorMsg) {
        text = errorMsg;
      } else if (location) {
        lat = location.coords.latitude;
        lon = location.coords.longitude;
      }
      useEffect(
          () => 
              onSnapshot(query(collection(db, 'users'), where('uid', '==', auth.currentUser?.uid)), (snapshot) =>
              setProfile(snapshot.docs[0].data())
              )
      ,[])
      
      const handleAddPost= () => {
        addDoc(colRef,    {
            uid: auth.currentUser?.uid,
            username: profile.name,
            role: profile.role,
            description: description,
            email: profile.email,
            createAt: serverTimestamp(),
            contents: contents,
            location: {
                latitude: lat,
                longitude: lon,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
          })
        .then(() => {
            navigation.navigate('Home')
 
        })
    }
  return (
    <View>
      <Text>NewPost</Text>
      <TextInput style={styles.input} placeholder="description" onChangeText={text => setDescription(text)} />
      <TextInput style={styles.input} placeholder="contents" onChangeText={text => setContents(text)} />
      <TouchableOpacity
            onPress={handleAddPost}
            style={[styles.button]}
        >
            <Text style={styles.buttonOutLineText}>Submit</Text>
        </TouchableOpacity>
    </View>
  )
}

export default NewPost

const styles = StyleSheet.create({   input: {
  backgroundColor: 'white',
  paddingHorizontal: 15,
  paddingVertical: 10,
  borderRadius: 10,
  marginTop: 5,
},
button: {
  backgroundColor: '#0782F9',
  width: '100%',
  padding: 15,
  borderRadius: 10,
  alignItems: 'center',
},
})