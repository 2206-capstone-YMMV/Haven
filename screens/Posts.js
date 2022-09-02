import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
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
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage"; //access the storage database
import firebaseConfig from "../firebaseConfig.tsx";
import { initializeApp } from "firebase/app"; //validate yourself
import Entypo from "react-native-vector-icons/Entypo";
import SearchBar from "react-native-dynamic-search-bar";
import { useFonts } from "expo-font";

initializeApp(firebaseConfig);
import { useNavigation } from "@react-navigation/core";
import { get_Post } from "../redux";
import { connect } from "react-redux";
import { SafeAreaView } from "react-native-safe-area-context";

const Posts = () => {
  const colRef = collection(db, "Post");
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [url, setUrl] = useState();
  const date = new Date();

  const navigation = useNavigation();

  const filterData = posts.filter((post) => {
    return post.description.indexOf(search) >= 0;
  });

  const [fontsLoaded] = useFonts({
    "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
    "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
    "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
    "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
    "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
  });

  useEffect(
    () =>
      onSnapshot(colRef, (snapshot) =>
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    []
  );

  useEffect(
    () =>
      onSnapshot(colRef, (snapshot) =>
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    []
  );

  const renderFriend = ({ item }) => {
    let milliDate = item.createAt.seconds;
    let unix = Math.floor(date.getTime() / 1000);
    let diff = (unix - milliDate) / 3600;
    let timeDisplay;

    if (diff < 1) {
      timeDisplay = Math.ceil(diff * 60) + "m";
    } else {
      timeDisplay = Math.ceil(diff) + "h";
    }

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate("SinglePost", { item })}
      >
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.photoContainer}>
              <View style={styles.innerPhotoContainer}>
                {item.image ? (
                  <Image
                    style={styles.photo}
                    source={{ uri: item.image }}
                  ></Image>
                ) : (
                  <Entypo name={"image"} style={styles.photo} size={60} />
                )}
              </View>
            </View>

            <View style={styles.info}>
              <View style={styles.userDetails}>
                <Text style={styles.textTitle}>{item.description}</Text>
                <Text
                  style={{
                    ...styles.textContent,
                    fontFamily: "signika-semi",
                  }}
                >
                  by: {item.username} • {timeDisplay}
                </Text>
              </View>
              <View style={styles.textContentContainer}>
                <Text style={styles.textContent}>{item.contents}</Text>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.likeButton}
                  size={15}
                  name="heart"
                  onPress={() => like(item.id, item.likes)}
                >
                  {item.likes > 0 ? (
                    <Entypo
                      name={"heart"}
                      size={18}
                      style={{ marginLeft: 4 }}
                      color={item.likes > 0 ? "red" : "black"}
                    />
                  ) : (
                    <Entypo
                      name={"heart-outlined"}
                      size={18}
                      style={{ marginLeft: 4 }}
                      color={item.likes > 0 ? "red" : "black"}
                    />
                  )}
                  <Text
                    style={[
                      styles.likeButtonIcon,
                      { display: item.likes > 0 ? "block" : "none" },
                    ]}
                  >
                    {item.likes}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
    <>
      <MaterialCommunityIcons
        name="plus-circle"
        size={50}
        style={styles.addButton}
        onPress={() => navigation.navigate("NewPost")}
      />
      <View style={{ marginTop: 50, backgroundColor: "#fff" }}>
        <View>
          <SearchBar
            style={styles.formField}
            value={search}
            fontColor="#fff"
            // placeholder="Search by description..."
            underlineColorAndroid="transparent"
            onChangeText={(text) => setSearch(text)}
          />
          <View style={{ paddingBottom: 280 }}>
            <FlatList data={filterData} renderItem={renderFriend} />
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: "#ECECEC",
    borderBottomWidth: 0.5,
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    borderColor: "green",
    flexDirection: "row",
    borderWidth: 0,
    height: "auto",
  },
  photoContainer: {
    flex: 0.23,
    borderColor: "yellow",
    flexDirection: "column",
    borderWidth: 0,
  },
  innerPhotoContainer: { height: 100, alignItems: "center" },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 10,
    left: 2,
    marginTop: 10,
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
  textTitle: { color: "black", fontWeight: "bold", fontFamily: "signika-bold" },
  textContentContainer: { flex: 1, borderColor: "grey", borderWidth: 0 },
  textContent: {
    color: "black",
    paddingRight: 10,
    fontFamily: "signika-light",
  },
  actionsContainer: {
    flex: 1,
    borderColor: "blue",
    borderWidth: 0,
    marginTop: 5,
    flexDirection: "row",
    paddingBottom: 5,
  },
  likeButton: {
    padding: 5,
    flex: 0.25,
    alignItems: "center",
    flexDirection: "row",
    borderColor: "red",
    borderWidth: 0,
    color: "black",
  },
  likeButtonIcon: {
    position: "absolute",
    left: 27,
    marginLeft: 3,
  },
  addButton: {
    position: "absolute",
    color: "#ECECEC",
    flex: 1,
    zIndex: 100,
    bottom: 80,
    left: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
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
});

const mapDispatch = (dispatch) => ({
  getPost: (post) => dispatch(get_Post(post)),
});

export default connect(null, mapDispatch)(Posts);
