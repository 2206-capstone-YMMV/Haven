import { StyleSheet, Text, View, FlatList, TouchableOpacity,TextInput, Image, Alert, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { auth } from '../firebase'
import { collection, onSnapshot, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore' 
import { useNavigation } from '@react-navigation/core'
import tw from 'tailwind-react-native-classnames';
import { Feather } from "@expo/vector-icons"
import { useFonts } from "expo-font";

const Friends = () => {
    const navigation = useNavigation()
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [friends, setFriends] = useState([])
    let isFriend = false
    const colRef = collection(db, 'Friends')

    const [fontsLoaded] = useFonts({
      "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
      "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
      "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
      "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
      "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
    });
    
    const filterData = users.filter((user) => {
        return user.name.indexOf(search) >= 0
    })

    useEffect(
        () => 
            onSnapshot(collection(db, 'users'), (snapshot) =>
            setUsers(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            )
    ,[])

    useEffect(
        () => 
            onSnapshot(query(collection(db, 'Friends'), where('uid', '==', auth.currentUser?.uid)), (snapshot) =>
            setFriends(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
            )
    ,[])

    const handleAddFriend=  (friend) => {
        addDoc(colRef, {
            id: friend.id,
            uid: auth.currentUser?.uid,
            friendEmail: friend.email,
            friendName: friend.name,
            friendRole: friend.role
          })
        .then(() => {
        
            navigation.navigate('FriendsView')
 
        })
    }

    const removeFriend = (friend) => {
      deleteDoc(doc(db, 'Friends', friend.friendId))
    }
    
    const reset = () => {
        isFriend = false
    }

    const addFriendAlert = (item) => {
        Alert.alert(
          item.name,
          `Add this person as a friend?`,
          [
            {
              text: "Add",
              onPress: () => handleAddFriend(item)
            },
            {
              text: "Cancel",
              style: "cancel"
            }
          ]
        )
      }

    const removeFriendAlert = (item) => {
        Alert.alert(
          item.name,
          `Remove this person from your friends list?`,
          [
            {
              text: "Remove",
              onPress: () => removeFriend(item)
            },
            {
              text: "Cancel",
              style: "cancel"
            }
          ]
        )
      }

    const renderFriend = (({item}) => {
        return (
    
            <View style={styles.itemContainer}>
            {item.friendRole === 'helper' ?   
            <View style={styles.profileImageContainer}>
                <Image source={require('../gifs/download.jpeg')} style={styles.profileImage} />
            </View> : 
            <View style={styles.profileImageContainer}>
                <Image source={require('../gifs/default-user-image.png')} style={styles.profileImage} />
            </View>
            }
            <View>
                <Text style={{fontSize: 22, color: "white", fontFamily: "signika-bold"}}>{item.name} <Text style={styles.textRole}>{item.role}</Text></Text>
                <Text style={{color: "grey", fontFamily: "signika-regular"}}>{item.email}</Text>
            </View>
            <View style={{position: "absolute", right: 0}}>
                {friends.filter((friend) => {
                    if (friend.friendEmail === item.email) {
                        isFriend = true
                        item.friendId = friend.id
                    }
                    })}
                    {isFriend === false ?  <TouchableOpacity
                    style={tw`bg-blue-500  w-20 mt-5 border-solid rounded-full`} 
                      onPress={() => addFriendAlert(item)}
                      >
                      <Text style={{color: "white", textAlign: "center", fontFamily: "signika-regular"}}>Add</Text>
                    </TouchableOpacity> : <TouchableOpacity
                     style={tw`bg-red-500  w-20 mt-5 border-solid rounded-full`}
                      onPress={() => removeFriendAlert(item)}
                      >
                      <Text style={{color: "white", textAlign: "center", fontFamily: "signika-regular"}}>Remove</Text>
                    </TouchableOpacity> 
                    }
                    {reset()}
            </View>
        </View>
        )
    })
  return (
    <View style={{backgroundColor: "#251934"}}>
         <View style={styles.container}>
            <Feather
            name="search"
            size={20}
            color="black"
            style={{ marginLeft: 1 }}
            />
            <TextInput 
                style={styles.textInput}
                value={search}
                placeholder='Search By Name'
                underlineColorAndroid='transparent'
                onChangeText={(text) => setSearch(text)}
            />
        </View>
            <View style={tw`pb-52`}>
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

export default Friends

const styles = StyleSheet.create({
    textInput: {
        fontSize: 20,
        marginLeft: 10,
        width: "75%",
      },
      container: {
        margin: 15,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "90%",
        backgroundColor: "white",
        padding: 10,
        borderRadius: 20
      },
      itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 10,
      },
      profileImage: {
        width: 50,
        height: 50,
        borderRadius: 100,
        overflow: 'hidden',
        marginRight: 30
      },
      textRole: {
        fontSize: 13,
        color: 'grey',
      },
})















