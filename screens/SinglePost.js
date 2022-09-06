import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Alert,
  FlatList,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Input from "./Input";
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  updateDoc,
  query,
  increment,
  where,
} from "firebase/firestore";
import Entypo from "react-native-vector-icons/Entypo";
import { useFonts } from "expo-font";

import { db, auth } from "../firebase";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  spam,
  inappropriate,
  misinformation,
  harassment,
  falseLocation,
  outOfSupplies,
} from "./ReportScreen";
import Ratings from "./Ratings";
import { useNavigation } from "@react-navigation/core";

const SinglePost = (props) => {
  const element = props.route.params.item;
  const commentId = element.id;
  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [count, setCount] = useState();
  const navigation = useNavigation();
  const [displayName, setDisplayName] = useState("");

  const [fontsLoaded] = useFonts({
    "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
    "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
    "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
    "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
    "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
  });

  let milliDate = element.createAt.seconds;
  let date = new Date(milliDate * 1000);
  let hours = date.getHours();
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  let minutes = date.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let day = date.getUTCDate();
  let month = date.getUTCMonth();
  let year = date.getUTCFullYear();

  if (!displayName) {
    getDocs(
      query(collection(db, "users"), where("uid", "==", auth.currentUser?.uid))
    ).then((user) => {
      console.log("Grabbing Username");
      setDisplayName(user.docs[0].data());
    });
  }

  console.log("this is the display name", displayName.name);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "Comments"), where("commentId", "==", commentId)),
        (snapshot) =>
          setComments(
            snapshot.docs
              .map((comment) => {
                console.log("grabbing comments", comments);

                return comment.data();
              })
              .sort((a, b) => a.timestamp - b.timestamp)
          )
      ),
    []
  );

  return (
    <>
      <Ionicons
        style={styles.flag}
        name="flag-outline"
        size={30}
        onPress={() => setModalVisible(true)}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.container}>
              <TouchableOpacity
                onPress={() => {
                  inappropriate(element.id, element.reports);
                  setModalVisible(!modalVisible);
                  Alert.alert("Your report has been submitted.");
                }}
              >
                <Text style={styles.title}>Inappropriate</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  falseLocation(element.id, element.reports);
                  setModalVisible(!modalVisible);
                  Alert.alert("Your report has been submitted.");
                }}
              >
                <Text style={styles.title}>False Location</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  spam(element.id, element.reports);
                  setModalVisible(!modalVisible);
                  Alert.alert("Your report has been submitted.");
                }}
              >
                <Text style={styles.title}>Spam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  misinformation(element.id, element.reports);
                  setModalVisible(!modalVisible);
                  Alert.alert("Your report has been submitted.");
                }}
              >
                <Text style={styles.title}>Misinformation</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  outOfSupplies(element.id, element.reports);
                  setModalVisible(!modalVisible);
                  Alert.alert("Your report has been submitted.");
                }}
              >
                <Text style={styles.title}>Out of Supplies</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  harassment(element.id, element.reports);
                  setModalVisible(!modalVisible);
                  Alert.alert("Your report has been submitted.");
                }}
              >
                <Text style={styles.title}>Harassment </Text>
              </TouchableOpacity>

              <Pressable
                //style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.title}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      {/* {element.image !== null && (
        <Image
          style={{ width: 100, height: 100 }}
          source={{ uri: element.image }}
        ></Image>
      )}

      <Text>Post By: {element.username}</Text>
      <Text>Description: {element.description}</Text>

      <Text>Content: {element.contents}</Text>

      <Input commentId={element.id} />

      <View style={styles.commentContainer}>
        {comments.map((comment, idx) => (
          <Text key={idx} style={styles.message}>
            {comment.content}
          </Text>
        ))}
      </View>

      <Pressable onPress={() => setModalVisible(true)}>
        <Ionicons name="flag-outline" size={30} color="red" />
      </Pressable>
    </View> */}
      <KeyboardAvoidingView
        style={{
          backgroundColor: "transparent",
          height: "100%",
          justifyContent: "flex-end",
          backgroundColor: "#251934",
          paddingTop: 100,
        }}
        behavior="position"
        keyboardVerticalOffset={95}
      >
        <ScrollView>
          <View style={styles.contentHead}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                paddingLeft: 10,
                height: 56,
              }}
            >
              <Text
                style={{
                  fontFamily: "signika-semi",
                  fontSize: 20,
                  color: "#fff",
                }}
              >
                by: {element.username}
              </Text>
              <Text
                style={{
                  color: "#999",
                  fontSize: 18,
                  fontFamily: "signika-bold",
                }}
              >
                {element.description}
              </Text>
            </View>
          </View>

          <View style={styles.image}>
            <Text
              style={{
                fontSize: 20,
                padding: 10,
                fontFamily: "signika-regular",
                color: "#fff",
              }}
            >
              {element.contents}
            </Text>

            {element.image !== null && (
              <Image
                style={{ width: 350, height: 350, borderRadius: 30 }}
                source={{ uri: element.image }}
              />
            )}
          </View>

          <View style={styles.footBar}>
            {element.likes > 0 ? (
              <Entypo
                name={"heart"}
                size={18}
                style={{ marginLeft: 4 }}
                color={element.likes > 0 ? "red" : "white"}
              />
            ) : (
              <Entypo
                name={"heart-outlined"}
                size={18}
                style={{ marginLeft: 4 }}
                color={element.likes > 0 ? "red" : "white"}
              />
            )}
            <Text
              style={{
                fontSize: 16,
                paddingRight: 5,
                color: "white",
              }}
            >
              {" "}
              {element.likes}
            </Text>
            <Text
              style={{
                color: "#999",
                fontSize: 15,
                fontFamily: "signika-light",
              }}
            >
              {hours}:{minutes} {ampm} • {month}/{day}/{year}
            </Text>
          </View>
          <View style={{backgroundColor: "#251934" }}>
          {comments.map((comment, idx) => {
            let name = comment.content.split(":")[0];
            let text = comment.content.split(":")[1];

            if (name !== displayName.name) {
              return (
                <>
                  <Text
                    style={{
                      color: "#55E5FF",
                      marginTop: 2,
                      marginLeft: 7,
                      fontFamily: "signika-medium",
                    }}
                  >
                    {name}{" "}
                  </Text>
                  <Text
                    key={idx}
                    style={{
                      ...styles.message,
                      alignSelf: "flex-start",
                      textAlign: "left",
                      justifyContent: "flex-start",
                      marginRight: 30,
                      marginLeft: 7,

                      borderColor: "#55E5FF",
                      fontFamily: "signika-regular",
                    }}
                  >
                    {text}
                  </Text>
                </>
              );
            } else {
              return (
                <Text
                  key={idx}
                  style={{
                    ...styles.message,
                    alignSelf: "flex-end",
                    textAlign: "right",
                    justifyContent: "flex-end",
                    marginLeft: 30,
                    marginRight: 7,
                    borderColor: "#CB55FF",
                    fontFamily: "signika-medium",
                  }}
                >
                  {text}
                </Text>
              );
            }
          })}
        </View>
        </ScrollView>
        <Input commentId={element.id} />
        <View style={{height: "8%"}}></View>
      </KeyboardAvoidingView>
    </>
  );
};

const mapState = (state) => {
  return {
    userPost: state,
  };
};

export default connect(mapState)(SinglePost);

const styles = StyleSheet.create({
  commentContainer: {
    zIndex: 999,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 5,
    fontSize: 18,
    color: "#ECECEC",
    backgroundColor: "#251934",
  },
  message: {
    backgroundColor: "transparent",
    color: "#fff",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 3,
    borderRadius: 10,
    borderWidth: 1,
    fontFamily: "signika-light",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 70,
  },
  title: {
    margin: 2,
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  flag: {
    position: "absolute",
    color: "#fff",
    flex: 1,
    zIndex: 100,
    bottom: 18,
    left: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  button: {
    borderRadius: 20,
    padding: 15,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "white",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  contentHead: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
    paddingBottom: 0,
    backgroundColor: "#251934",
  },
  footBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
    borderBottomColor: "#CCC",
    borderBottomWidth: StyleSheet.hairlineWidth,
    backgroundColor: "#251934",
  },
  likeButtonIcon: {
    position: "absolute",
    left: 27,
    marginLeft: 3,
  },
  image: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#251934",
  },
});

{
  /* {element.role === "admin" ? (
        <Text>{JSON.stringify(element.reports)}</Text>
      ) : (
        ""
      )} */
}
