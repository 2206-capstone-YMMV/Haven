import { StyleSheet, Text, View, FlatList, TouchableOpacity,TextInput, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import { auth } from '../firebase'
import { collection, onSnapshot, query, where, addDoc, deleteDoc, doc } from 'firebase/firestore' 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/core'


const Friends = () => {
    const navigation = useNavigation()
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [friends, setFriends] = useState([])
    const [friendId, setFriendId] = useState('')
    let isFriend = false
    const colRef = collection(db, 'Friends')
    
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
        
            navigation.navigate('Profile')
 
        })
    }

    const removeFriend = (friend) => {
      deleteDoc(doc(db, 'Friends', friendId))
    }
    
    const reset = () => {
        isFriend = false
    }

    const renderFriend = (({item}) => {
        return (
            <View style={{flexDirection: 'row', padding: 20, marginBottom: 20, backgroundColor:'white', borderRadius: 12,
            shadowColor: '#000', shadowOffset: {width:0, height: 10}, shadowOpacity: 0.3, shadowRadius: 20
            }}>
            <View>
                <Text style={{fontSize: 22, fontWeight: '700'}}>{item.name}</Text>
                <Text style={{fontSize: 18, opacity: 0.7}}>{item.role}</Text>
                <Text style={{fontSize: 14, opacity: 0.8, color: '#0099cc'}}>{item.email} </Text>
               {friends.filter((friend) => {
                if (friend.friendEmail === item.email) {
                    isFriend = true
                    setFriendId(friend.id)
                }
                })}
                {isFriend === false ?  <TouchableOpacity
                  onPress={() => handleAddFriend(item)}
                  >
                  <Text >Add Friend</Text>
                </TouchableOpacity> : <TouchableOpacity
                  onPress={() => removeFriend(item)}
                  >
                  <Text >remove friend</Text>
                </TouchableOpacity> 
                }
                {reset()}
            </View>
        </View>
        )
    })
  return (
    <View>
        {/* <Image
            source={{uri:'https://i0.wp.com/artisthue.com/wp-content/uploads/2020/12/Story-sale-for-@kbellemichelle.jpg'}}
            style={StyleSheet.absoluteFillObject}
        /> */}
            <View style={styles.searchWrapperStyle}>
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
            </View>
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

export default Friends

const styles = StyleSheet.create({
    textInput: {
        height: 50,
        borderWidth: 1,
        paddingLeft: 20,
        margin: 5,
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        paddingHorizontal: 0,
        marginBottom: 30,
        borderColor: '#009688',
        backgroundColor: 'white',

      },
      iconStyle: {
        marginTop: 12,
        marginHorizontal: 8,
      },
      searchWrapperStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
      },
})