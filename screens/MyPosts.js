
import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { db } from '../firebase'
import { auth } from '../firebase'
import { collection, onSnapshot, query, where, deleteDoc, doc } from 'firebase/firestore' 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from "react-redux";
import { get_Post } from "../redux";
import tw from 'tailwind-react-native-classnames';
import UpdatePost from './UpdatePost';
import Entypo from "react-native-vector-icons/Entypo";
import { Feather } from "@expo/vector-icons"
import { Avatar, ListItem } from 'react-native-elements'
import { useNavigation } from "@react-navigation/core";
import { useFonts } from "expo-font";

const MyPosts = () => {
    const [posts, setPosts] = useState([])
    const [search, setSearch] = useState('')
    const navigation = useNavigation();
    const filterData = posts.filter((post) => {
        return post.description.indexOf(search) >= 0
    })

    const [fontsLoaded] = useFonts({
      "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
      "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
      "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
      "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
      "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
    });

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
        <View>
                   <ListItem 
               onPress={() => navigation.navigate("UpdatePost", { item })}
                containerStyle={styles.listItemContainer}
              >
                <Avatar source={require('../gifs/1141031.png')}/>
                <ListItem.Content>
                  <ListItem.Title style={{fontFamily: "signika-regular"}}>{item.description}</ListItem.Title>

                  </ListItem.Content>
                <ListItem.Chevron color="gray" />
              </ListItem>
        </View>
        )
    })

  return (
    <View style={{backgroundColor: "#251934", height: "100%"}}>
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

const mapDispatchToProps = (dispatch) => ({
  getPost: (post) => dispatch(get_Post(post)),
});


export default connect(null, mapDispatchToProps)(MyPosts);

const styles = StyleSheet.create({
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
  innerContainer: {
    flex: 1,
    borderColor: "green",
    flexDirection: "row",
    borderWidth: 0,
    height: "auto",
  },
  photoContainer: {
    flex: 0.23,
    borderColor: "yellow",
    flexDirection: "column",
    borderWidth: 0,
  },
  innerPhotoContainer: { height: 100, alignItems: "center" },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 10,
    left: 2,
    marginTop: 10,
  },
  info: {
    flex: 0.77,
    borderColor: "yellow",
    flexDirection: "column",
    borderWidth: 0,
    marginTop: 5,
  },
  userDetails: {
    flex: 1,
    borderColor: "blue",
    borderWidth: 0,
    marginTop: 5,
  },
  textTitle: { color: "black", fontWeight: "bold", fontFamily: "signika-bold" },
  textContentContainer: { flex: 1, borderColor: "grey", borderWidth: 0 },
  textContent: {
    color: "black",
    paddingRight: 10,
    fontFamily: "signika-light",
  },
  actionsContainer: {
    flex: 1,
    borderColor: "blue",
    borderWidth: 0,
    marginTop: 5,
    flexDirection: "row",
    paddingBottom: 5,
  },
  likeButton: {
    padding: 5,
    flex: 0.25,
    alignItems: "center",
    flexDirection: "row",
    borderColor: "red",
    borderWidth: 0,
    color: "black",
  },
  likeButtonIcon: {
    position: "absolute",
    left: 27,
    marginLeft: 3,
  },
  addButton: {
    position: "absolute",
    color: "#ECECEC",
    flex: 1,
    zIndex: 100,
    bottom: 80,
    left: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  posts: {
    marginTop: 10,
    marginBottom: 30,
  },
  textInput: {
    fontSize: 20,
    marginLeft: 10,
    width: "75%",
  },
  iconStyle: {
    marginTop: 12,
    marginHorizontal: 8,
  },
  formField: {
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 10,
    borderRadius: 20,
    fontSize: 18,
    height: 50,
    marginBottom: 15,
    color: "#ECECEC",
  },
  listItemContainer: {
    height: 55,
    borderWidth: 0.5,
    borderColor: '#ECECEC',
  },
});
