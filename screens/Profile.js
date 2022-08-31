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
            <View style={{padding: 20}}/>
            <View>
<<<<<<< HEAD
<<<<<<< HEAD
            <View style={styles.line}/>
              <View style={styles.container}>
                <View style={styles.border}>
                  <Text style={styles.info}>Hello, {profile.name}!</Text>
                </View>
                <View style={styles.border}>
                  <Text style={styles.info}>Role: {profile.role}</Text>
                </View>
                <View style={styles.border}>
                  <Text style={styles.info}>Email: {profile.email}</Text>
                </View>
              </View>
              <View style={styles.line}/>
=======
=======
            <View style={styles.line}/>
>>>>>>> c8725a3 (Updated Profile styling)
              <View style={styles.container}>
                <View style={styles.border}>
                  <Text style={styles.info}>Hello, {profile.name}!</Text>
                </View>
                <View style={styles.border}>
                  <Text style={styles.info}>Role: {profile.role}</Text>
                </View>
                <View style={styles.border}>
                  <Text style={styles.info}>Email: {profile.email}</Text>
                </View>
              </View>
<<<<<<< HEAD
>>>>>>> 9425280 (started styling profile page)
=======
              <View style={styles.line}/>
>>>>>>> c8725a3 (Updated Profile styling)
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSignOut}
                    style={styles.button}>
                    <Text style={styles.buttonText}>Sign Out</Text>
                </TouchableOpacity>
              </View>
<<<<<<< HEAD
<<<<<<< HEAD
              <View style={styles.divider}/>
=======
>>>>>>> 9425280 (started styling profile page)
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Friends')}
                    style={[styles.button]}
                    >
                    <Text style={styles.buttonText}>Add/Remove Friend</Text>
                </TouchableOpacity>
                <TextInput 
                style={styles.textInput}
                value={search}
                placeholder='Search By Name'
                underlineColorAndroid='transparent'
                onChangeText={(text) => setSearch(text)}
                />
<<<<<<< HEAD
            </View>
            <View style={styles.line}/>
                <Text style={styles.header}>My Friends</Text>
=======
=======
              <View style={styles.divider}/>
            </View>
            <View style={styles.buttonContainer}>
>>>>>>> c8725a3 (Updated Profile styling)
                <TouchableOpacity
                    onPress={() => navigation.navigate('Friends')}
                    style={[styles.button]}
                    >
                    <Text style={styles.buttonText}>Add/Remove Friend</Text>
                </TouchableOpacity>
<<<<<<< HEAD
                <Text >My Friends: </Text>
>>>>>>> 9425280 (started styling profile page)
=======
                <TextInput 
                style={styles.textInput}
                value={search}
                placeholder='Search By Name'
                underlineColorAndroid='transparent'
                onChangeText={(text) => setSearch(text)}
                />
            </View>
            <View style={styles.line}/>
                <Text style={styles.header}>My Friends</Text>
>>>>>>> c8725a3 (Updated Profile styling)
                <FlatList 
                    data={filterData}
                    contentContainerStyle={{
                        padding: 15
                    }}
                    renderItem={renderFriend}
                />
    </View>
    )
}

export default Profile

const styles = StyleSheet.create({
<<<<<<< HEAD
<<<<<<< HEAD
    line: {
      borderWidth: 1,
=======
    input: {
      backgroundColor: 'white',
=======
    line: {
      borderWidth: 1,
      margin: 5,
      opacity: 0.1
    },
    divider: {
      borderWidth: 1,
      margin: 5,
      opacity: 0.3
    },
    info: {
>>>>>>> c8725a3 (Updated Profile styling)
      paddingHorizontal: 5,
      paddingVertical: 5,
      fontSize: 25
    },
    border: {
      borderColor: 'white',
      borderWidth: 3,
      marginTop: 5,
      borderRadius: 10,
      shadowColor: 'black',
      shadowOffset: {width: 2, height: 6},
      shadowRadius: 2,
      shadowOpacity: 0.15
    },
    container: {
      margin: 5,
      alignItems: 'center'
    },
    buttonText: {
      fontSize: 20
    },
    button: {
      backgroundColor: '#0782F9',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 5,
      margin: 5
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      shadowColor: 'black',
      shadowOffset: {width: 4, height: 4},
      shadowRadius: 2,
      shadowOpacity: 0.2
    },
    textInput: {
      height: 54,
      width: '40%',
      alignSelf: 'center',
      borderWidth: 1,
      borderRadius: 5,
      paddingLeft: 20,
>>>>>>> 9425280 (started styling profile page)
      margin: 5,
<<<<<<< HEAD
      opacity: 0.1
    },
    divider: {
      borderWidth: 1,
      margin: 5,
      opacity: 0.3
    },
    info: {
      paddingHorizontal: 5,
      paddingVertical: 5,
      fontSize: 25
    },
    border: {
      borderColor: 'white',
      borderWidth: 3,
      marginTop: 5,
      borderRadius: 10,
      shadowColor: 'black',
      shadowOffset: {width: 2, height: 6},
      shadowRadius: 2,
      shadowOpacity: 0.15
    },
<<<<<<< HEAD
    container: {
      margin: 5,
      alignItems: 'center'
    },
    buttonText: {
      fontSize: 20
    },
    button: {
      backgroundColor: '#0782F9',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: 5,
      margin: 5
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      shadowColor: 'black',
      shadowOffset: {width: 4, height: 4},
      shadowRadius: 2,
      shadowOpacity: 0.2
    },
    textInput: {
      height: 54,
      width: '40%',
      alignSelf: 'center',
      borderWidth: 1,
      borderRadius: 5,
      paddingLeft: 20,
      margin: 5,
=======
>>>>>>> c8725a3 (Updated Profile styling)
      borderColor: '#0782F9',
      backgroundColor: 'white'
    },
    header: {
      alignSelf: 'center',
      fontSize: 25,
      padding: 7,
      backgroundColor: '#C0C0C0',
      shadowOffset: {width: 4, height: 4},
      shadowRadius: 2,
      shadowOpacity: 0.2
    }
<<<<<<< HEAD
=======
>>>>>>> 9425280 (started styling profile page)
=======
>>>>>>> c8725a3 (Updated Profile styling)
  })