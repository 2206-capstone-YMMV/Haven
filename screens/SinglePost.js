import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Input from "./Input";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase";

const SinglePost = (props) => {
  console.log("you are in singlepost view");
  const element = props.route.params.item;
  const commentId = element.id;
  const [comments, setComments] = useState([]);

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
});
