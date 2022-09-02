import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
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
  const [count, setCount] = useState();
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
      {element.image !== null && (
        <Image
          style={{ width: 100, height: 100 }}
          source={{ uri: element.image }}
        ></Image>
      )}

      <Text>Post By: {element.username}</Text>
      <Text>Description: {element.description}</Text>
      {/* {element.role === "admin" ? (
        <Text>{JSON.stringify(element.reports)}</Text>
      ) : (
        ""
      )} */}
      <Text>Content: {element.contents}</Text>

      <Input commentId={element.id} />

      <View style={styles.commentContainer}>
        {comments.map((comment, idx) => (
          <Text key={idx} style={styles.message}>
            {comment.content}
          </Text>
        ))}
      </View>

      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="flag-outline" size={30} color="black" />
      </Pressable>
    </View>
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
    alignItems: "left",
    paddingHorizontal: "10%",
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
});