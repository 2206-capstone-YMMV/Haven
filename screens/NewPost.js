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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; //access the storage database
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import firebaseConfig from "../firebaseConfig.tsx";
import { initializeApp } from "firebase/app"; //validate yourself

initializeApp(firebaseConfig);
const NewPost = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [description, setDescription] = useState("");
  const [contents, setContents] = useState("");
  const [profile, setProfile] = useState({});
  const colRef = collection(db, "Post");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState('');

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

  const handleAddPost = async (pathUrl) => {
    await addDoc(colRef, {
      uid: auth.currentUser?.uid,
      username: profile.name,
      role: profile.role,
      description: description,
      email: profile.email,
      createAt: serverTimestamp(),
      contents: contents,
      image: url,
      likes: 0,
      reports: {
        spam: 0,
        inappropriate: 0,
        falseLocation: 0,
        outOfSupplies: 0,
        misinformation: 0,
        harassment: 0,
      },
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
  // const showImagePicker = async () => {
  //   const permissionResult =
  //     await ImagePicker.requestMediaLibraryPermissionsAsync();
  //   if (permissionResult.granted === false) {
  //     alert("You've refused to allow this appp to access your photos!");
  //     return;
  //   }

  //   const result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.All,
  //     allowsEditing: true,
  //     aspect: [4, 3],
  //     quality: 0,
  //   });

  //   let imageUrl =
  //     Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri;
  //   if (!result.cancelled) {
  //     setImage(imageUrl);
  //   }
  // };

  //real deal sent to firebase
  const pickImage = async () => {
    if (url == null) {
      setUrl(null);
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0,
    });
    let imageUrl =
      Platform.OS === "ios" ? result.uri.replace("file://", "") : result.uri;
    if (!result.cancelled) {
      setImage(imageUrl);
    }
    try {
      const storage = getStorage();
      const path = `images/${new Date() + uuidv4()}`;
      const ref_con = ref(storage, path);
      const func = async () => {
        await getDownloadURL(ref_con).then((x) => {
          setUrl(x);
        });
      };
      const img = await fetch(result.uri);
      const bytes = await img.blob();
      await uploadBytes(ref_con, bytes);
      func(); // /images/12345566
    } catch (e) {
      console.log(e);
    }
  };
  const combined = async () => {
    let pathUrl = await pickImage();
    await handleAddPost({
      pathUrl,
    });
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="description"
        onChangeText={(text) => setDescription(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="contents"
        onChangeText={(text) => setContents(text)}
        multiline={true}
      />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 300, height: 300 }}
        ></Image>
      )}
      <TouchableOpacity onPress={pickImage} style={[styles.button]}>
        <Text style={styles.buttonOutLineText}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAddPost} style={[styles.button]}>
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
