import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  doc,
  where,
} from "firebase/firestore";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from "@react-navigation/core";
import { get_Post } from "../redux";
import { connect } from "react-redux";

const Posts = () => {
  const colRef = collection(db, "Post");
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const navigation = useNavigation();

  const filterData = posts.filter((post) => {
    return post.description.indexOf(search) >= 0;
  });

  useEffect(
    () =>
      onSnapshot(colRef, (snapshot) =>
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    []
  );

  const renderFriend = ({ item }) => {
    console.log("this is an item", item);
    return (
      <View
        style={{
          flexDirection: "row",
          padding: 20,
          marginBottom: 20,
          backgroundColor: "white",
          borderRadius: 12,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("SinglePost", { item })}
        >
          <View>
            <Text style={{ fontSize: 22, fontWeight: "700" }}>
              {item.description}
            </Text>
            <Text style={{ fontSize: 18, opacity: 0.7 }}>
              posted by: {item.username}
            </Text>
            <Text style={{ fontSize: 14, opacity: 0.8, color: "#0099cc" }}>
              {item.contents}{" "}
            </Text>
            <Text onPress={() => like(item.id, item.likes)}>
              Like Likes: {item.likes}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const like = (id, postLikes) => {
    console.log("Updating likes");
    getDocs(
      query(
        collection(db, "Likes"),
        where("postId", "==", id),
        where("uid", "==", auth.currentUser.uid)
      )
    ).then((checkLike) => {
      if (checkLike.docs.length < 1) {
        //If this user hasn't liked this post already
        addDoc(collection(db, "Likes"), {
          postId: id,
          uid: auth.currentUser.uid,
        }).then(updateDoc(doc(db, "Post", id), { likes: postLikes + 1 }));
      } else {
        deleteDoc(doc(db, "Likes", checkLike.docs[0].id)).then(
          updateDoc(doc(db, "Post", id), { likes: postLikes - 1 })
        );
      }
    });
  };

  return (
    <View>
      <View>
        <Text
          onPress={() => navigation.navigate("NewPost")}
          style={{ fontSize: 26, fontWeight: "bold" }}
        >
          New Posts
        </Text>
        <Text
          onPress={() => navigation.navigate("MyPosts")}
          style={{ fontSize: 26, fontWeight: "bold" }}
        >
          My Posts
        </Text>
      </View>
      <View>
        <View style={styles.searchWrapperStyle}>
          <TextInput
            style={styles.textInput}
            value={search}
            placeholder="Search By description"
            underlineColorAndroid="transparent"
            onChangeText={(text) => setSearch(text)}
          />
          <MaterialCommunityIcons
            style={styles.iconStyle}
            name="backspace-outline"
            size={23}
            onPress={() => {
              setSearch("");
            }}
          />
        </View>
        <FlatList
          data={filterData}
          contentContainerStyle={{
            padding: 15,
          }}
          renderItem={renderFriend}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  posts: {
    marginTop: 10,
    marginBottom: 30,
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginBottom: 30,
    borderColor: "#009688",
    backgroundColor: "white",
  },
  iconStyle: {
    marginTop: 12,
    marginHorizontal: 8,
  },
  searchWrapperStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const mapDispatch = (dispatch) => ({
  getPost: (post) => dispatch(get_Post(post)),
});

export default connect(null, mapDispatch)(Posts);
