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
import { useFonts } from "expo-font";

export default function Message({ route }) {
  const { conversationId } = route.params;
  const [conversation, setConversation] = useState([]);
  const [message, setMessage] = useState("");
  const [displayName, setDisplayName] = useState("");

  const [fontsLoaded] = useFonts({
    "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
    "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
    "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
    "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
    "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
  });

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
      style={{height: "100%"}}
      keyboardVerticalOffset={90}
    >
      <View
        style={{ width: "100%", height: "100%", backgroundColor: "#251934" }}
      >
        <ScrollView>
          <View style={styles.messageContainer}>
            {conversation.map((convo, index) => {
              if (convo.messenger.uid !== auth.currentUser.uid) {
                return (
                  <>
                    <Text
                      style={{
                        color: "#55E5FF",
                        marginTop: 2,
                        fontFamily: "signika-medium",
                      }}
                    >
                      {convo.messenger.name}{" "}
                    </Text>
                    <Text
                      key={index}
                      style={{
                        ...styles.message,
                        alignSelf: "flex-start",
                        textAlign: "left",
                        justifyContent: "flex-start",
                        marginRight: 75,
                        borderColor: "#55E5FF",
                        fontFamily: "signika-regular",
                      }}
                    >
                      {convo.content}
                    </Text>
                  </>
                );
              } else {
                return (
                  <Text
                    key={index}
                    style={{
                      ...styles.message,
                      alignSelf: "flex-end",
                      textAlign: "right",
                      justifyContent: "flex-end",
                      marginLeft: 75,
                      borderColor: "#CB55FF",
                      fontFamily: "signika-medium",
                    }}
                  >
                    {convo.content}
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
            />
            <TouchableOpacity onPress={handleSend} style={styles.button}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: "left",
    paddingHorizontal: 15,
  },
  message: {
    backgroundColor: "transparent",
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 3,
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  inputContainer: {
    alignSelf: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 4,
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
    backgroundColor: "#CB55FF",
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "signika-medium",
  },
});