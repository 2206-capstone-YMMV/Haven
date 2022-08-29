import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import firebaseConfig from "../firebaseConfig.tsx";
import { initializeApp } from "firebase/app"; //validate yourself
import { getStorage, ref, uploadBytes } from "firebase/storage"; //access the storage database
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import uuid from "react-native-uuid";

initializeApp(firebaseConfig);

export default function ImageUpload() {
  const pickImage = async () => {
    try {
      // console.log(uuidv4());

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        const path = `images/${new Date() + uuidv4()}`;
        const storage = getStorage(); //the storage itself
        // const ref_con = ref(storage, 'image.jpg'); //how the image will be addressed inside the storage
        const ref_con = ref(storage, path); //how the image will be addressed inside the storage

        //convert image to array of bytes  --substep
        const img = await fetch(result.uri);
        const bytes = await img.blob();
        await uploadBytes(ref_con, bytes); //upload images
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableHighlight onPress={pickImage}>
        <Text>select image</Text>
      </TouchableHighlight>
    </View>
  );
}
// const styles = StyleSheet.create({
//   container: {
//     width: "100%",
//     alignItems: "center",
//   },
//   imageContainer: {
//     borderWidth: 1,
//     borderColor: "black",
//     backgroundColor: "#eee",
//     width: "80%",
//     height: 150,
//   },
//   button: {
//     margin: 8,
//   },
//   previewImage: {
//     width: "100%",
//     height: "100%",
//   },
// });

// pickImageHandler = () => {
//   ImagePicker.showImagePicker(
//     { title: "Pick an Image", maxWidth: 800, maxHeight: 600 },
//     (response) => {
//       if (response.error) {
//         console.log("image error");
//       } else {
//         console.log("Image: " + response.uri);
//         setSelectedImage({ uri: response.uri });
//         onImagePicked({ uri: response.uri });
//       }
//     }
//   );
