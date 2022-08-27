import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/core";
import { auth } from "../firebase";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes } from "firebase/storage"; //access the storage database
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import firebaseConfig from "../firebaseConfig.tsx";
import { initializeApp } from "firebase/app"; //validate yourself

const NewPost = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [content, setContent] = useState("");
  const [profile, setProfile] = useState({});
  const colRef = collection(db, "Post");
  const [pickedImagePath, setPickedImagePath] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  let text = "Waiting...";
  let lat;
  let lon;

  // useEffect(() => {
  //   if (image) {
  //     console.log("useEffect: " + image);
  //     setSelectedImage({ uri: image });
  //   }
  // }, [image]);

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    lat = location.coords.latitude;
    lon = location.coords.longitude;
  }
  // const get_Post = (user) => {
  //   return async (dispatch) => {
  //     getDocs(
  //       query(collection(db, "Post"), where("createAt", " == ", user.createAt))
  //     ).then((snapshot) => {
  //       snapshot.docs.forEach((doc) => {
  //         dispatch(getPost({ ...doc.data(), id: doc.id }));
  //       });
  //     });
  //   };
  // };
  const handleAddContent = () => {
    addDoc(colRef, {
      username: profile.name,
      description: content,
      icon: "dog",
      // pickedImagePath: path,

      location: {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    }).then(() => {});
  };
  const showImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setPickedImagePath(result.uri);
    }
  };

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
        const storage = getStorage(); //the storage itself
        const path = `images/${new Date() + uuidv4()}`;
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
  const combined = () => {
    handleAddPost();
    pickImage();
  };

  return (
    <View>
      <Text>NewPost</Text>
      <TextInput
        style={styles.input}
        placeholder="Content"
        onChangeText={(text) => setContent(text)}
      />
      <TouchableOpacity onPress={showImagePicker} style={[styles.button]}>
        <Text style={styles.buttonOutLineText}>Upload Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAddContent} style={[styles.button]}>
        <Text style={styles.buttonOutLineText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewPost;

const styles = StyleSheet.create({});
