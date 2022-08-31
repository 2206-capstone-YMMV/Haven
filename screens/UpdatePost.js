import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { updateDoc, doc } from 'firebase/firestore' 
import { db } from '../firebase'
import tw from 'tailwind-react-native-classnames';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
const UpdatePost = (props) => {
    const [description, setDescription] = useState(props.data.description)
    const [content, setContent] = useState(props.data.contents)
    const update = () => {
      const docRef = doc(db, 'Post', props.data.id)
      updateDoc(docRef, {
        description: description,
        contents: content
      })
    }

  return (
    <View>
        <Text>Update Description: </Text>
        <View style={styles.searchWrapperStyle}>
            <TextInput  placeholder="Update Description"  style={styles.textInput} onChangeText={text => setDescription(text)} />
            <MaterialCommunityIcons style={styles.iconStyle} name="backspace-outline"  size={23}onPress={() => {
                    setDescription('');
                }} /> 
        </View>
        <Text>Update Content: </Text>
        <View style={styles.searchWrapperStyle}>
            <TextInput  placeholder="Update Content"  style={styles.textInput}  onChangeText={text => setContent(text)} />
            <MaterialCommunityIcons style={styles.iconStyle} name="backspace-outline"  size={23}onPress={() => {
                    setContent('');
                }} /> 
        </View>
        <View>
        <TouchableOpacity
                style={tw`bg-blue-500  w-24 mt-5 border-solid rounded-full`}
                  onPress={() => update()}
                  >
                  <Text style={tw`text-center text-white `}>Update Post</Text>
                </TouchableOpacity >
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
      width: 300,
    },

})




