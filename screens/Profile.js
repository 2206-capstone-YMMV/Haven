import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, TextInput, StyleSheet, TouchableOpacity, Image} from "react-native";
import { signOut } from 'firebase/auth'
import { auth } from '../firebase'
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore' 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const  Profile = ({ navigation }) => {
    const [profile, setProfile] = useState({})
    const [search, setSearch] = useState('')
    const [friends, setFriends] = useState([])
    const colRef = query(collection(db, 'Friends'), where('uid', '==', auth.currentUser?.uid))

    const filterData = friends.filter((friend) => {
        return friend.friendName.indexOf(search) >= 0
    })

    const handleSignOut = () => {
        signOut(auth)
        .then(() => {
            navigation.navigate('Login')
        })
    }


    useEffect(
        () => 
            onSnapshot(query(collection(db, 'users'), where('uid', '==', auth.currentUser?.uid)), (snapshot) =>
            setProfile(snapshot.docs[0].data())
            )
    ,[])

    useEffect(  
        () => 
          onSnapshot(colRef, (snapshot) => 
          setFriends(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        
        )
      ,[])


      const renderFriend = (({item}) => {
        return (
            <View style={{flexDirection: 'row', padding: 20, marginBottom: 20, backgroundColor:'white', borderRadius: 12,
            shadowColor: '#000', shadowOffset: {width:0, height: 10}, shadowOpacity: 0.3, shadowRadius: 20
            }}>
            <View>
                <Text style={{fontSize: 22, fontWeight: '700'}}>{item.friendName}</Text>
                <Text style={{fontSize: 18, opacity: 0.7}}>{item.friendRole}</Text>
                <Text style={{fontSize: 14, opacity: 0.8, color: '#0099cc'}}>{item.friendEmail} </Text>
            </View>
        </View>
        )
    })
    return (
        <View >
            <View>
                <Text style={styles.input}>Hello {profile.name}</Text>
                <Text style={styles.input}>role: {profile.role}</Text>
                <Text style={styles.input}>email: {profile.email}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}
                    style={styles.button}>
                    <Text>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignOut}
                    style={styles.button}>
                    <Text>Sign Out</Text>
                </TouchableOpacity>
            </View>
            <View>
            <TextInput 
                style={styles.textInput}
                value={search}
                placeholder='Search By Name'
                underlineColorAndroid='transparent'
                onChangeText={(text) => setSearch(text)}
                />
                <MaterialCommunityIcons style={styles.iconStyle} name="backspace-outline"  size={23}onPress={() => {
                    setSearch('');
                }} /> 
                <TouchableOpacity
                    onPress={() => navigation.navigate('Friends')}
                    style={[styles.button]}
                    >
                    <Text >Add/Remove Friend</Text>
                </TouchableOpacity>
                <Text >My Friends: </Text>
                <FlatList 
                    data={filterData}
                    contentContainerStyle={{
                        padding: 15
                    }}
                    renderItem={renderFriend}
                />
            </View>
    </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    textInput: {
      height: 50,
      borderWidth: 1,
      paddingLeft: 20,
      margin: 5,
      borderColor: '#009688',
      backgroundColor: 'white'
    },
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
      marginBottom: 5,
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
      marginBottom: 5
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