import React, { useState } from "react";
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
} from "react-native";
import { db } from "../firebase";
import { auth } from "../firebase";
import {
  collection,
  query,
  where,
  addDoc,
  getDocs,
} from "firebase/firestore";

export default function Input({ commentId }) {
  const [text, setText] = useState("");
  const [displayName, setDisplayName] = useState("");

  const submit = () => {
    addDoc(collection(db, "Comments"), {
      commentId,
      timestamp: Date.now(),
      content: `${displayName}: ${text}`,
    })
      .then(() => {
        setText("");
      })
      .catch((error) => alert(error.message));
  };

  if (!displayName) {
    getDocs(
      query(collection(db, "users"), where("uid", "==", auth.currentUser?.uid))
    ).then((user) => {
      console.log("Grabbing Username"),
        setDisplayName(user.docs[0].data().name);
    });
  }
  return (
      <View style={styles.container}>
        <TextInput
          placeholder="add a comment"
          keyboardType="twitter"
          style={styles.input}
          value={text}
          onChangeText={(text) => setText(text)}
        />
        <TouchableOpacity style={styles.button} onPress={submit}>
          <Text style={[styles.text, !text ? styles.inactive : []]}>Post</Text>
        </TouchableOpacity>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#EEE",
    alignItems: "center",
    paddingLeft: 15,
    borderRadius: 40
  },
  button: {
    height: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  inactive: {
    color: "#CCC",
  },
  text: {
    color: "#3F51B5",
    fontWeight: "bold",
    fontFamily: "Avenir",
    textAlign: "center",
    fontSize: 15,
  },})