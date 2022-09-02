import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, query, where, } from 'firebase/firestore' 
import { db } from '../firebase'
import { Feather } from "@expo/vector-icons"
import tw from 'tailwind-react-native-classnames'
import { useNavigation } from "@react-navigation/core";
import { Avatar, ListItem } from 'react-native-elements'
import InfoText from '../components/infoText';
const FriendPost = (item) => {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const navigation = useNavigation();
    const filterData = posts.filter((post) => {
        return post.description.indexOf(search) >= 0
    })

    useEffect(  
        () => 
          onSnapshot(query(collection(db, 'Post'), where('email', '==', item.route.params.item.friendEmail)), (snapshot) => 
          setPosts(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        )
      ,[])

      const renderFriend = (({item}) => {
   
        return (
            <View >
                <ListItem 
                    onPress={() => navigation.navigate("SinglePost", { item })}
                     containerStyle={styles.listItemContainer}
                >
                    <Avatar source={require('../gifs/1090923.png')}/>
                    <ListItem.Content>
                    <ListItem.Title >{item.description}</ListItem.Title>
                    </ListItem.Content>
                    <ListItem.Chevron color="gray" />
                </ListItem>
            </View>
        )
    })
  return (
    <View>
    
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
                placeholder='Search By Description'
                underlineColorAndroid='transparent'
                onChangeText={(text) => setSearch(text)}
            />
            <View>
                <Button
                title="Cancel"
                onPress={() => {setSearch('')}}
                ></Button>
            </View>
            
        </View>
        <InfoText text={`${item.route.params.item.friendName}'s Post`}/>
        <View>
            <View style={tw`pb-40 mb-20`}>
                <FlatList 
                    data={filterData}
                    contentContainerStyle={{
                    padding: 15
                    }}
                    renderItem={renderFriend}
                />
            </View>
        </View>
    </View>
  )
}

export default FriendPost

const styles = StyleSheet.create({
    container: {
        margin: 15,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "90%",
      },
      textInput: {
        fontSize: 20,
        marginLeft: 10,
        width: "75%",
      },
      listItemContainer: {
        height: 55,
        borderWidth: 0.5,
        borderColor: '#ECECEC',
        marginBottom: 10
      },
})