import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { auth, db } from '../firebase'
import { collection, onSnapshot, addDoc, getDocs, updateDoc, deleteDoc, query, doc, where } from 'firebase/firestore' 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/core'
const  Posts = () => {
    const colRef = collection(db, 'Post')
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const navigation = useNavigation()

    const filterData = posts.filter((post) => {
        return post.description.indexOf(search) >= 0
    })

   useEffect(  
    () => 
      onSnapshot(colRef, (snapshot) => 
      setPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    )
  ,[])

  const renderFriend = (({item}) => {
    return (
        <View style={{flexDirection: 'row', padding: 20, marginBottom: 20, backgroundColor:'white', borderRadius: 12,
            shadowColor: '#000', shadowOffset: {width:0, height: 10}, shadowOpacity: 0.3, shadowRadius: 20
            }}>
            <View>
                <Text style={{fontSize: 22, fontWeight: '700'}}>{item.description}</Text>
                <Text style={{fontSize: 18, opacity: 0.7}}>posted by: {item.username}</Text>
                <Text style={{fontSize: 14, opacity: 0.8, color: '#0099cc'}}>{item.contents} </Text>
                <Text onPress={() => like(item.id, item.likes)}>Like        Likes:  {item.likes}</Text>
            </View>
        </View>
        )
    })

    const like = (id, postLikes) => {
        console.log('Updating likes')
        getDocs(query(collection(db, 'Likes'), where ('postId', '==', id), where ('uid', '==', auth.currentUser.uid)))
        .then(checkLike => {
            if (checkLike.docs.length < 1){ //If this user hasn't liked this post already
                addDoc(collection(db, 'Likes'), {postId: id, uid: auth.currentUser.uid})
                .then(updateDoc(doc(db, 'Post', id), {likes: postLikes + 1}))
            }
            else{
                deleteDoc(doc(db, 'Likes', checkLike.docs[0].id))
                .then(updateDoc(doc(db, 'Post', id), {likes: postLikes - 1}))
            }
        })
        
    }


    return (
        <View>
            <View style={{padding: 20}}/>
            <View style={styles.line}/>
            <View style={styles.buttonContainer}>
                <View style={styles.shadow}>
                    <Text
                    onPress={() => navigation.navigate('NewPost')}
                    style={styles.button}>Make a Post</Text>
                </View>
                <View style={styles.shadow}>
                    <Text
                    onPress={() => navigation.navigate('MyPosts')}
                    style={styles.button}>My Posts</Text>
                </View>
            </View>
            <View style={styles.divider}/>
            <View>
            <View style={styles.searchWrapperStyle}>
                <TextInput 
                style={styles.textInput}
                value={search}
                placeholder='Search By description'
                underlineColorAndroid='transparent'
                onChangeText={(text) => setSearch(text)}
                />
            </View>
            <View style={styles.line}/>
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


export default Posts

const styles = StyleSheet.create({
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
    button: {
        backgroundColor: '#0782F9',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: 5,
        margin: 5,
        overflow: 'hidden',
      },
    shadow: {
        shadowColor: 'black',
        shadowOffset: {width: 4, height: 4},
        shadowRadius: 1,
        shadowOpacity: 0.2
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        
      },
    posts: {
        marginTop: 10,
        marginBottom: 30
    },
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