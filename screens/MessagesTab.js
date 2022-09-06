import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { useFonts } from "expo-font";

export default function MessagesTab({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);

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
          collection(db, "Conversations"),
          where("user", "==", auth.currentUser?.uid)
        ),
        (snapshot) =>
          setConversations(
            snapshot.docs.map((convo) => {
              console.log("Grabbing Convos")
              return convo.data();
            })
          )
      ),
    []
  );

  const conversationIds = conversations.map((convo) => convo.conversationId);
  const otherUsersId = conversations.map((convo) => {
    if (convo.user === auth.currentUser.uid){
      return convo.otherUser
    }
    else{
      return convo.user
    }
    convo.otherUser});

  if (otherUsersId.length === 0) {
    otherUsersId.push("aaaaaaaaaaa");
  }

  if (
    (conversations.length > 0 && otherUsers.length === 0) ||
    conversations.length > otherUsers.length
  ) {
    //After the conversations have been grabbed, but dont want this to repeat when page rerenders
    getDocs(
      query(collection(db, "users"), where("uid", "in", otherUsersId))
    ).then((users) =>
      setOtherUsers(
        users.docs.map((user) => {
          console.log("Grabbing aquaintances")
          return user.data();
        })
      )
    );
  }

  const names = otherUsersId.map((id) => {
    for (let i = 0; i < otherUsers.length; i++) {
      if (otherUsers[i].uid === id) {
        return otherUsers[i].name;
      }
    }
  });

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#251934",
      }}
    >
      {/* <Text
        style={[styles.convo, styles.new]}
        onPress={() =>
          navigation.navigate("NewConversation", { conversations })
        }
      >
        New Conversation
      </Text> */}

      <MaterialCommunityIcons
        name="email"
        size={50}
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("NewConversation", { conversations })
        }
      />

      <ScrollView contentContainerStyle={{ marginTop: 50 }}>
        {conversationIds.map((conversationId, index) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Message", { conversationId })}
          >
            <View style={styles.listView}>
              <Text key={index} style={styles.textTitle}>
                Conversation with {names[index]}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  new: {
    marginBottom: "10%",
    fontSize: 30,
  },
  convo: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 5,
    borderRadius: 10,
    overflow: "hidden",
    textAlign: "center",
    fontSize: 18,
  },
  listView: {
    padding: 20,
    marginTop: 5,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#CB55FF",
    borderRadius: 10,
    width: 350,
  },
  addButton: {
    position: "absolute",
    color: "#ECECEC",
    flex: 1,
    zIndex: 100,
    bottom: 80,
    left: 20,
  },

  textTitle: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "signika-bold",
  },
  textContentContainer: { flex: 1, borderColor: "grey", borderWidth: 0 },
  textContent: {
    color: "black",
    paddingRight: 10,
    fontFamily: "signika-light",
  },
});

