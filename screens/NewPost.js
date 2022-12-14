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
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useFonts } from "expo-font";
import Entypo from "react-native-vector-icons/Entypo";

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
  const [url, setUrl] = useState(null);

  const [fontsLoaded] = useFonts({
    "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
    "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
    "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
    "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
    "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
  });

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

  const handleAddPost = async () => {
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

  const pickImage = async () => {
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
  // const combined = async () => {
  //   let pathUrl = await pickImage();
  //   await handleAddPost({
  //     pathUrl,
  //   });
  // };

  return (
    <View style={{ backgroundColor: "#251934", flex: 1 }}>
      <View>
        <TextInput
          style={{
            ...styles.input,
            height: "8%",
            fontFamily: "signika-light",
          }}
          placeholder="Title"
          onChangeText={(text) => setDescription(text)}
        />
        <TextInput
          style={{
            ...styles.input,
            height: "50%",
            fontFamily: "signika-light",
          }}
          placeholder="Content"
          onChangeText={(text) => setContents(text)}
          multiline
          blurOnSubmit={true}
          numberOfLines={4}
        />
      </View>
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 300, height: 300 }}
        ></Image>
      )}
      <Entypo
        onPress={handleAddPost}
        size={50}
        name="plus"
        color="#fff"
        style={{ ...styles.button, top: 320, right: 10 }}
      />
      <MaterialCommunityIcons
        onPress={pickImage}
        name="camera"
        size={40}
        color="#fff"
        style={{ ...styles.button, top: 327, left: 10 }}
      />
    </View>
  );
};
export default NewPost;

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    borderRadius: 4,
    margin: 10,
    fontSize: 20,
    fontFamily: "signika-medium",
  },
  button: {
    position: "absolute",
    flex: 1,
    borderRadius: 10,
    alignSelf: "center",
    alignItems: "center",
  },
});
