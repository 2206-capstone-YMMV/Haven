import { StatusBar } from "expo-status-bar";
import {
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../firebase";

export default function DisplayPost() {
  // Storing User Data
  const [userDoc, setUserDoc] = useState(null);
  // Update Text
  const [text, setText] = useState("");
  const [posts, setPosts] = useState(null);

  const Create = () => {
    const myDoc = doc(db, "Post", "MyDocument");

    // Your Document Goes Here
    const docData = {
      name: "iJustine",
      bio: "YouTuber",
    };

    setDoc(myDoc, docData)
      .then(() => {
        alert("Document Created!");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const Read = () => {
    // MARK: Reading Doc
    const myDoc = doc(db, "Post", "uiyXUZleQvFu76r71gAJ");
    getDoc(myDoc)
      .then((snapshot) => {
        if (snapshot.exists) {
          setUserDoc(snapshot.data());
          console.log(snapshot.data());
        } else {
          alert("No Doc Found");
        }
      })
      .catch((error) => {
        alert(error.message);
      });
    const list = [];
    // const colRef = collection(db, "Post");

    // onSnapshot(colRef, (snapshot) => {
    //   let post = [];
    //   snapshot.docs.forEach((doc) => {
    //     post.push({ ...doc.data(), id: doc.id });
    //   });
    //   console.log(post);
    // });
  };

  const Update = (value, merge) => {
    const myDoc = doc(db, "MyCollection", "MyDocument");

    // If you set merge true then it will merge with existing doc otherwise it will be a fresh one
    setDoc(myDoc, value, { merge: merge })
      .then(() => {
        alert("Updated Successfully!");
        setText("");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  const Delete = () => {
    const myDoc = doc(db, "Post", "MyDocument");

    deleteDoc(myDoc)
      .then(() => {
        alert("Deleted Successfully!");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Button title="Create New Doc" onPress={Create}></Button>
      <Button title="Read Doc" onPress={Read}></Button>
      {userDoc != null && (
        <Text>
          Content: {userDoc.contents}
          Description: {userDoc.description}
          UserName: {userDoc.username}
          Lat: {userDoc.location.latitude}
          Long: {userDoc.location.longitude}
        </Text>
      )}
      <TextInput
        style={{
          width: "50%",
          fontSize: 18,
          padding: 12,
          borderColor: "gray",
          borderWidth: 0.2,
          borderRadius: 10,
          marginVertical: 20,
        }}
        placeholder="Type Here"
        onChangeText={(text) => {
          setText(text);
        }}
        value={text}
      ></TextInput>

      <Button
        title="Update Doc"
        onPress={() => {
          Update(
            {
              bio: text,
            },
            true
          );
        }}
        disabled={text == ""}
      ></Button>
      <Button title="Delete Doc" onPress={Delete}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

// const styles = StyleSheet.create({});
