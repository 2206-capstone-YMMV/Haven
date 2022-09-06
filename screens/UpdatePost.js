import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useState } from 'react'
import { updateDoc, doc, deleteDoc } from 'firebase/firestore' 
import { db } from '../firebase'
import tw from 'tailwind-react-native-classnames';
import InfoText from '../components/infoText';
import { useNavigation } from "@react-navigation/core";
import { useFonts } from "expo-font";

const UpdatePost = (props) => {
    const [description, setDescription] = useState(props.route.params.item.description)
    const [content, setContent] = useState(props.route.params.item.contents)
    const navigation = useNavigation();

    const [fontsLoaded] = useFonts({
      "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
      "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
      "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
      "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
      "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
    });

    const update = () => {
      const docRef = doc(db, 'Post', props.route.params.item.id)
      updateDoc(docRef, {
        description: description,
        contents: content
      }).then(() => navigation.navigate('MyPosts'))
    }
    const delectPost = (post) => {
      deleteDoc(doc(db, 'Post', props.route.params.item.id)).then(() => navigation.navigate('MyPosts'))
    }

const updateAlert = () => {
  Alert.alert(
    `Update Post`,
    `Are you sure you want to update the post?`,
    [
      {
        text: "Update Date",
        onPress: () => update()
      },
      {
        text: "Cancel",
        style: "cancel"
      }
    ]
  )
}

const deleteAlert = () => {
  Alert.alert(
    `Delete Post`,
    `Are you sure you want to delete the post?`,
    [
      {
        text: "Delete Date",
        onPress: () => delectPost()
      },
      {
        text: "Cancel",
        style: "cancel"
      }
    ]
  )
}
  return (
    <View style={{backgroundColor: "#251934", height: "100%"}}>
        <InfoText text={`Current Description: \n\n${props.route.params.item.description}`}/>
        <View style={styles.searchWrapperStyle}>
            <TextInput  multiline = {true} numberOfLines = {4} blurOnSubmit={true} placeholder="Update Description" value={description} style={styles.textInput} onChangeText={text => setDescription(text)} />
        </View>
        <InfoText text={`Currrent Content: \n\n${props.route.params.item.contents}`} />
        <View style={styles.searchWrapperStyle}>
            <TextInput multiline = {true} numberOfLines={10} blurOnSubmit={true} placeholder="Update Content" value={content} style={styles.textInput}  onChangeText={text => setContent(text)} />
        </View>
        <View style={styles.searchWrapperStyle1}>
          <View>
               <TouchableOpacity
                  onPress={() => updateAlert()}
                  >
                  <Text style={{color: "white", textAlign: "center", fontFamily: "signika-bold", fontSize: 20}}>Update</Text>
                </TouchableOpacity >
          </View>
          <View>
                <TouchableOpacity
                  onPress={() => deleteAlert()}
                  >
                  <Text style={{color: "white", textAlign: "center", fontFamily: "signika-bold", fontSize: 20}}>Delete</Text>
                </TouchableOpacity >
          </View>
        </View>
    </View>
  )
}

export default (UpdatePost)

const styles = StyleSheet.create({
  posts: {
      marginTop: 10,
      marginBottom: 30
  },
  textInput: {
      height: 100,
      borderWidth: 0.2,
      paddingLeft: 10,
      margin: 5,
      flex: 1,
      fontSize: 16,
      backgroundColor: 'white',
      textAlignVertical: 'top',
      fontFamily: "signika-regular"
    },
    iconStyle: {
      marginTop: 12,
      marginHorizontal: 8,
    },
    searchWrapperStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "95%",
      alignSelf: "center",
      borderRadius: 20,
      overflow: "hidden"
   
    },
    searchWrapperStyle1: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: 230,
      marginLeft: 70,
      marginTop: 10
    },

})




