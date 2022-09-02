import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";

export default function Message({ route }) {
  const { conversationId } = route.params;
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "Messages"),
          where("conversationId", "==", conversationId)
        ),
        (snapshot) =>
          setConversation(
            snapshot.docs
              .map((convo) => {
                console.log("Grabbing Messages");
                return convo.data();
              })
              .sort((a, b) => a.timestamp - b.timestamp)
          )
      ),
    []
  );

  if (!displayName) {
    getDocs(
      query(collection(db, "users"), where("uid", "==", auth.currentUser?.uid))
    ).then((user) => {
      console.log("Grabbing Username"), setDisplayName(user.docs[0].data());
      console.log(displayName);
    });
  }

  const handleSend = () => {
    addDoc(collection(db, "Messages"), {
      conversationId,
      timestamp: Date.now(),
      messenger: displayName,
      content: message,
    })
      .then(() => {
        setMessage("");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
      keyboardVerticalOffset={100}
    >
      <LinearGradient
        colors={["#8c5aa5", "#f2e797"]}
        style={{ width: "100%", height: "100%" }}
      >
        <ScrollView>
          <View style={styles.messageContainer}>
            {conversation.map((convo, index) => {
              if (convo.messenger.uid !== auth.currentUser.uid) {
                return (
                  <Text key={index} style={styles.message}>
                    {convo.messenger.name + ": " + convo.content}
                  </Text>
                );
              } else {
                return (
                  <Text key={index} style={[styles.message, styles.user]}>
                    {"You: " + convo.content}
                  </Text>
                );
              }
            })}
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Message"
              value={message}
              onChangeText={(text) => setMessage(text)}
              style={styles.input}
              multiline={true}
              blurOnSubmit={true}
            ></TextInput>
            <TouchableOpacity onPress={handleSend} style={styles.button}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    alignSelf: "flex-start",
    alignItems: "left",
    paddingHorizontal: "10%",
    width: "100%",
  },
  message: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 5,
    borderRadius: 10,
    overflow: "hidden",
  },
  user: {
    alignSelf: "flex-end",
  },
  inputContainer: {
    alignSelf: "center",
    width: "80%",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    width: "80%",
  },
  buttonContainer: {
    width: "20%",
  },
  button: {
    padding: 5,
    backgroundColor: "#0782F9",
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
