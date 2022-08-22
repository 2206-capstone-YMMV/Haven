import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, StyleSheet } from "react-native";
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore' 
import * as Location from "expo-location";
import { useNavigation } from '@react-navigation/core'
const  Posts = () => {
    const colRef = collection(db, 'Post')
    const [posts, setPosts] = useState([])
    const navigation = useNavigation()
   useEffect(  
    () => 
      onSnapshot(colRef, (snapshot) => 
      setPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    
    )
  ,[])
    return (
        <View>
            <View >
                <Text
                    onPress={() => navigation.navigate('NewPost')}
                    style={{ fontSize: 26, fontWeight: "bold" }}>New Posts</Text>
            </View>
            <View>
        <Text>All Post: </Text>
        <FlatList 
          data={posts}
        
         
          renderItem={({item}) => (
            <View style={styles.posts}>
            <Text>Post By: {item.username} </Text>
            <Text>description: {item.description}</Text>
            <Text>contents: {item.contents}</Text>
            </View>
          )}
        />
      </View>
        </View>
    )
}


export default Posts

const styles = StyleSheet.create({
    posts: {
        marginTop: 30,
        marginBottom: 30
    }
})