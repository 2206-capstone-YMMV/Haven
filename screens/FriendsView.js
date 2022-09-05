import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, TextInput, StyleSheet, Button, TouchableOpacity, Image} from "react-native";
import { auth } from '../firebase'
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore' 
import tw from 'tailwind-react-native-classnames'
import InfoText from '../components/infoText';
import { Avatar, ListItem } from 'react-native-elements'
import { Feather } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/core";
import { useFonts } from "expo-font";

const FriendsView = () => {
    const [search, setSearch] = useState('')
    const [friends, setFriends] = useState([])
    const colRef = query(collection(db, 'Friends'), where('uid', '==', auth.currentUser?.uid))
    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
      "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
      "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
      "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
      "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
      "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
    });

    const filterData = friends.filter((friend) => {
        return friend.friendName.indexOf(search) >= 0
    })

    useEffect(  
        () => 
          onSnapshot(colRef, (snapshot) => 
          setFriends(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
        
        )
      ,[])
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
                    <Text style={{fontSize: 22, color: "white", fontFamily: "signika-bold"}}>{item.friendName}  <Text style={styles.textRole}>{item.friendRole}</Text></Text>
                    <TouchableOpacity style={tw`bg-yellow-500  w-24  border-solid rounded-full`} onPress={() => navigation.navigate('FriendPost', {item})}>
                        <Text style={{color: "white", textAlign: "center", fontFamily: "signika-regular"}}>View All Post</Text>
                    </TouchableOpacity>
                </View>
            </View>

        )
    })
  return (
    <View style={{backgroundColor: "#251934", height: "100%"}}>
        <View>
            <InfoText text="Add / Remove Friends" />
            <ListItem 
                onPress={() => navigation.navigate('Friends', {friends})}
                containerStyle={styles.listItemContainer}
              >
                <Avatar source={require('../gifs/420140.png')}/>
                <ListItem.Content>
                  <ListItem.Title style={{fontFamily: "signika-regular"}}>Edit</ListItem.Title>
                  </ListItem.Content>
                <ListItem.Chevron color="gray" />
              </ListItem>
        </View>
        <InfoText text="My Friends :" />
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
        <View>
            <FlatList 
                data={filterData}
                contentContainerStyle={{
                padding: 15,
                }}
                renderItem={renderFriend}
            />
        </View>
    </View>
  )
}

export default FriendsView

const styles = StyleSheet.create({
    textInput: {
        fontSize: 20,
        marginLeft: 10,
        width: "75%",
        fontFamily: "signika-regular"
      },
      searchWrapperStyle: {
        flexDirection: "row",
        justifyContent: "space-between",
      },
      iconStyle: {
        marginTop: 12,
        marginHorizontal: 8,
      },
      listItemContainer: {
        height: 55,
        borderWidth: 0.5,
        borderColor: '#ECECEC',
        backgroundColor: '#F4F5F4'
      },
      container: {
        margin: 15,
        padding: 10,
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "row",
        width: "90%",
        borderRadius: 20,
        backgroundColor: "white"
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
        fontFamily: "signika-bold"
      },
      itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 10,
        
      }
})