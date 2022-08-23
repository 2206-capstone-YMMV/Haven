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
import CameraTake from "../components/CameraTake";
import { useNavigation } from "@react-navigation/core";
import { auth } from "../firebase";

const NewPost = () => {
  const navigation = useNavigation();
  const [location, setLocation] = useState("");
  const [errorMsg, setErrorMsg] = useState(null);
  const [content, setContent] = useState("");
  const [profile, setProfile] = useState({});
  const colRef = collection(db, "Post");
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
  // useEffect(
  //   () =>
  //     onSnapshot(
  //       query(
  //         collection(db, "users"),
  //         where("uid", "==", auth.currentUser?.uid)
  //       ),
  //       (snapshot) => setProfile(snapshot.docs[0].data())
  //     ),
  //   []
  // );

  const handleAddContent = () => {
    addDoc(colRef, {
      username: profile.name,
      description: content,
      icon: "dog",
      location: {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
    }).then(() => {});
  };
  return (
    <View>
      <Text>NewPost</Text>
      <TextInput
        style={styles.input}
        placeholder="Content"
        onChangeText={(text) => setContent(text)}
      />
      <TouchableOpacity onPress={handleAddContent} style={[styles.button]}>
        <Text style={styles.buttonOutLineText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NewPost;

const styles = StyleSheet.create({});
