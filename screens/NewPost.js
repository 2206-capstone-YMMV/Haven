import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from "react-native";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  serverTimestamp,
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
  const [description, setDescription] = useState("");
  const [contents, setContents] = useState("");
  const [profile, setProfile] = useState({});
  const colRef = collection(db, "Post");
  const [image, setImage] = useState("");
  //const [pickedImagePath, setPickedImagePath] = useState("");
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
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    lat = location.coords.latitude;
    lon = location.coords.longitude;
  }
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "users"),
          where("uid", "==", auth.currentUser?.uid)
        ),
        (snapshot) => setProfile(snapshot.docs[0].data())
      ),
    []
  );

  const handleAddPost = async ({ path }) => {
    await addDoc(colRef, {
      uid: auth.currentUser?.uid,
      username: profile.name,
      role: profile.role,
      description: description,
      email: profile.email,
      createAt: serverTimestamp(),
      contents: contents,
      image: path,
      location: {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    });

    navigation.navigate("Home");
  };

  //to pick image and display image
  const showImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    let imageUrl =
      Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri;
    if (!result.cancelled) {
      setImage(imageUrl);
    }
  };

  //real deal sent to firebase
  const pickImage = async () => {
    try {
      const storage = getStorage(); //the storage itself
      const path = `images/${new Date() + uuidv4()}`;
      //new Date()
      // const ref_con = ref(storage, 'image.jpg'); //how the image will be addressed inside the storage
      const ref_con = ref(storage, path); //how the image will be addressed inside the storage

      //convert image to array of bytes  --substep
      const img = await fetch(image);
      const bytes = await img.blob();
      await uploadBytes(ref_con, bytes); //upload images

      return path; // /images/12345566
    } catch (e) {
      // console.log("Some Error", e.stack);
      // console.log(e);
    }
  };
  const combined = async () => {
    let path = await pickImage();
    await handleAddPost({
      path,
    });
  };

  return (
    <View>
      <Text>NewPost</Text>
      <TextInput
        style={styles.input}
        placeholder="description"
        onChangeText={(text) => setDescription(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="contents"
        onChangeText={(text) => setContents(text)}
      />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 30, height: 30 }}
        ></Image>
      )}
      <TouchableOpacity onPress={showImagePicker} style={[styles.button]}>
        <Text style={styles.buttonOutLineText}>Upload Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={combined} style={[styles.button]}>
        <Text style={styles.buttonOutLineText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};
export default NewPost;
const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 15,
  },
});
