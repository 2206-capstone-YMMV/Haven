import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
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

export default function MessagesTab({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [otherUsers, setOtherUsers] = useState([]);

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
              return convo.data();
            })
          )
      ),
    []
  );

  const conversationIds = conversations.map((convo) => convo.conversationId);
  const otherUsersId = conversations.map((convo) => convo.otherUser);

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
          return user.data();
        })
      )
    );
  }

  const names = otherUsersId.map((id) => {
    //lining up names with the order of the conversationIds
    for (let i = 0; i < otherUsers.length; i++) {
      if (otherUsers[i].uid === id) {
        return otherUsers[i].name;
      }
    }
  });

  // console.log(names)

  return (
    <LinearGradient
      colors={["#8c5aa5", "#f2e797"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "space-between" }}
    >
      <Text
        style={[styles.convo, styles.new]}
        onPress={() =>
          navigation.navigate("NewConversation", { conversations })
        }
      >
        New Conversation
      </Text>
      <ScrollView>
        {conversationIds.map((conversationId, index) => (
          <Text
            key={index}
            style={styles.convo}
            onPress={() => navigation.navigate("Message", { conversationId })}
          >
            Conversation with {names[index]}
          </Text>
        ))}
      </ScrollView>
    </LinearGradient>
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
});