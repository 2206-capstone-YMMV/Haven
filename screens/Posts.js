import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore' 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import * as Location from "expo-location";
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
        </View>
    </View>
    )
})

    return (
        <View>
            <View >
                <Text
                    onPress={() => navigation.navigate('NewPost')}
                    style={{ fontSize: 26, fontWeight: "bold" }}>New Posts</Text>
                    <Text
                    onPress={() => navigation.navigate('MyPosts')}
                    style={{ fontSize: 26, fontWeight: "bold" }}>My Posts</Text>
            </View>
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