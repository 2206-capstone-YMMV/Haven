import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  Alert,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import { LinearGradient } from "expo-linear-gradient";
import SearchBar from "react-native-dynamic-search-bar";
import Entypo from "react-native-vector-icons/Entypo";
import { useFonts } from "expo-font";

export default function MessagesTab({ navigation, route }) {
  const [people, setPeople] = useState([]);
  const [search, setSearch] = useState("");

  const [fontsLoaded] = useFonts({
    "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
    "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
    "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
    "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
    "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
  });

  const filteredPeople = people.filter((user) => {
    return user.name.indexOf(search) >= 0;
  });

  let { conversations } = route.params;
  let talking = [];
  conversations.forEach((convo) => {
    //Making an array with all users this user is talking to
    talking.push(convo.user);
    talking.push(convo.otherUser);
  });
  if (talking.length === 0) {
    //if no conversations have been started only exclude the current user. not-in needs none empty array
    talking.push(auth.currentUser.uid);
  }

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "users"), where("uid", "not-in", talking)),
        (snapshot) =>
          setPeople(
            snapshot.docs.map((user) => {
              return user.data();
            })
          )
      ),
    []
  );

  const newConversation = (person) => {
    addDoc(collection(db, "Conversations"), {
      user: auth.currentUser.uid,
      otherUser: person.uid,
      conversationId: auth.currentUser.uid + person.uid,
    }).catch((error) => alert(error.message));
    addDoc(collection(db, "Conversations"), {
      user: person.uid,
      otherUser: auth.currentUser.uid,
      conversationId: auth.currentUser.uid + person.uid,
    })
      .then(navigation.navigate("Messages"))
      .catch((error) => alert(error.message));
  };

  const newConversationAlert = (person) => {
    Alert.alert(
      `New Conversation`,
      `Start a conversation with ${person.name}`,
      [
        {
          text: "Create",
          onPress: () => newConversation(person),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  const renderFriend = ({ item }) => {
    console.log("this is an item", item);

    return (
      <TouchableOpacity
        onPress={
          item.role === "helper"
            ? () => newConversation(item)
            : () => newConversationAlert(item)
        }
      >
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.info}>
              <View style={styles.userDetails}>
                <Text style={styles.textTitle}>{item.name}</Text>
                <Text
                  style={{
                    ...styles.textContent,
                    fontFamily: "signika-semi",
                    color: item.role === "helper" ? "#00FDBC" : "#42A5F5",
                  }}
                >
                  {item.role}
                </Text>
              </View>
              <View style={styles.textContentContainer}>
                <Text style={styles.textContent}>{item.email}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{ backgroundColor: "#251934", padding: 5, flex: 1 }}
      // style={{ padding: 5, flex: 1 }}
    >
      <SearchBar
        style={styles.formField}
        value={search}
        fontColor="#fff"
        placeholder="Search for user..."
        underlineColorAndroid="transparent"
        onChangeText={(text) => setSearch(text)}
      />

      {!search ? null : (
        <View>
          <FlatList data={filteredPeople} renderItem={renderFriend} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: "50%",
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  person: {
    backgroundColor: "white",
    padding: 20,
    margin: 10,
    borderRadius: 10,
    borderColor: "navy",
    borderWidth: 5,
    overflow: "hidden",
    fontSize: 20,
  },
  helper: {
    borderColor: "black",
  },
  formField: {
    padding: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    fontSize: 18,
    height: 50,
    marginBottom: 15,
    color: "#ECECEC",
  },
  container: {
    flex: 1,
    borderBottomColor: "#CB55FF",
    borderBottomWidth: 2,
    flexDirection: "column",
    backgroundColor: "transparent",
  },
  innerContainer: {
    flex: 1,
    borderColor: "green",
    flexDirection: "row",
    borderWidth: 0,
    height: "auto",
  },
  info: {
    flex: 0.77,
    borderColor: "yellow",
    flexDirection: "column",
    borderWidth: 0,
    marginTop: 5,
  },
  userDetails: {
    flex: 1,
    borderColor: "blue",
    borderWidth: 0,
    marginTop: 5,
  },
  textTitle: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "signika-bold",
    marginLeft: 10,
  },
  textContentContainer: { flex: 1, borderColor: "grey", borderWidth: 0 },
  textContent: {
    color: "white",
    paddingRight: 10,
    fontFamily: "signika-light",
    marginLeft: 10,
    marginBottom: 10,
  },
});
