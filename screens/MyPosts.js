import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { db } from '../firebase'
import { auth } from '../firebase'
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore' 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'



const MyPosts = () => {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const filterData = posts.filter((post) => {
        return post.description.indexOf(search) >= 0
    })

    useEffect(  
        () => 
          onSnapshot(query(collection(db, 'Post'), where('uid', '==', auth.currentUser?.uid)), (snapshot) => 
          setPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        )
      ,[])
      
      const delectPost = (post) => {
        deleteDoc(doc(db, 'Post', post.id))
      }
      

      const renderFriend = (({item}) => {
        return (
            <View style={{flexDirection: 'row', padding: 20, marginBottom: 20, backgroundColor:'white', borderRadius: 12,
            shadowColor: '#000', shadowOffset: {width:0, height: 10}, shadowOpacity: 0.3, shadowRadius: 20
            }}>
            <View>
                <Text>Description: {item.description}</Text>
                <Text>Contents: {item.contents}</Text>
                <TouchableOpacity
                  onPress={() => delectPost(item)}
                  >
                  <Text >Delete Post</Text>
                </TouchableOpacity> 
            </View>
        </View>
        )
    })

  return (
    <View>
           <View style={styles.searchWrapperStyle}>
                <TextInput 
                style={styles.textInput}
                value={search}
                placeholder='Search By description'
                underlineColorAndroid='transparent'
                onChangeText={(text) => setSearch(text)}
                />
                <MaterialCommunityIcons style={styles.iconStyle} name="backspace-outline"  size={23}onPress={() => {
                    setSearch('');
                }} /> 
            </View>
            <View>
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

export default MyPosts

const styles = StyleSheet.create({
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