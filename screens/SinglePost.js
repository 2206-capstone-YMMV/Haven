import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  FlatList,
  ScrollView,
  Dimensions,
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

const SinglePost = (props) => {
  const element = props.route.params.item;
  const commentId = element.id;
  const [comments, setComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "Comments"), where("commentId", "==", commentId)),
        (snapshot) =>
          setComments(
            snapshot.docs
              .map((comment) => {
                console.log("grabbing comments");

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
        color="black"
        onPress={() => setModalVisible(true)}
      />
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
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
                  }}
                >
                  <Text style={styles.title}>Inappropriate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    falseLocation(element.id, element.reports);
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.title}>False Location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    spam(element.id, element.reports);
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.title}>Spam</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    misinformation(element.id, element.reports);
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.title}>Misinformation</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    outOfSupplies(element.id, element.reports);
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.title}>Out of Supplies</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    harassment(element.id, element.reports);
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Text style={styles.title}>Harassment </Text>
                </TouchableOpacity>
              </View>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        <View style={styles.contentHead}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              paddingLeft: 10,
              height: 56,
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 20 }}>
              Post By: {element.username}
            </Text>
            <Text style={{ color: "#999", fontSize: 18 }}>
              {element.description}
            </Text>
          </View>
        </View>

        <View style={styles.image}>
          <Text style={{ fontSize: 22, padding: 10 }}>{element.contents}</Text>

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
              color={element.likes > 0 ? "red" : "black"}
            />
          ) : (
            <Entypo
              name={"heart-outlined"}
              size={18}
              style={{ marginLeft: 4 }}
              color={element.likes > 0 ? "red" : "black"}
            />
          )}
          <Text style={{ fontWeight: "bold", fontSize: 16, paddingRight: 5 }}>
            {" "}
            {element.likes}
          </Text>
        </View>

        {/* Begin Comment section */}

        <Input commentId={element.id} />
      </View>
      <ScrollView style={styles.commentContainer}>
        {comments.map((comment, idx) => (
          <Text key={idx} style={styles.message}>
            {comment.content}
          </Text>
        ))}
      </ScrollView>
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
    alignSelf: "flex-start",
    // alignItems: "left",
    width: Dimensions.get("window").width - 40,
    left: 20,
    right: 20,
  },
  message: {
    backgroundColor: "white",
    paddingVertical: 5,
    paddingHorizontal: 5,
    marginTop: 5,
    borderRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  title: {
    margin: 20,

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
    padding: 35,
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
    color: "#000",
    flex: 1,
    zIndex: 100,
    bottom: 20,
    left: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
  button: {
    borderRadius: 20,
    padding: 10,
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
  },
  footBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 10,
    borderBottomColor: "#CCC",
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  },
});

{
  /* {element.role === "admin" ? (
        <Text>{JSON.stringify(element.reports)}</Text>
      ) : (
        ""
      )} */
}
