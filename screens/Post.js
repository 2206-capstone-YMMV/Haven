// import React, { useEffect, useState } from "react";
// import {
//   Text,
//   View,
//   FlatList,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Image,
// } from "react-native";
// import { auth, db } from "../firebase";
// import {
//   collection,
//   onSnapshot,
//   addDoc,
//   getDocs,
//   updateDoc,
//   deleteDoc,
//   query,
//   doc,
//   where,
// } from "firebase/firestore";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage"; //access the storage database
// import firebaseConfig from "../firebaseConfig.tsx";
// import { initializeApp } from "firebase/app"; //validate yourself
// import { useNavigation } from "@react-navigation/core";
// import Posts from "./Posts";

// initializeApp(firebaseConfig);

// const Post = ({ item }) => {
//   const [url, setUrl] = useState();
//   // console.log(posts[0].image);
//   // console.log(item.image);
//   useEffect(() => {
//     const func = async () => {
//       await getDownloadURL(ref(getStorage(), item.image))
//         .then((x) => {
//           setUrl(x);
//         })
//         .catch((e) => console.log("Errors while downloading => ", e));
//     };

//     func();
//   }, []);

//   return (
//     <View
//       style={{
//         flexDirection: "row",
//         padding: 20,
//         marginBottom: 20,
//         backgroundColor: "white",
//         borderRadius: 12,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 10 },
//         shadowOpacity: 0.3,
//         shadowRadius: 20,
//       }}
//     >
//       <View>
//         <Image style={{ width: 50, height: 50 }} source={{ uri: url }}></Image>
//         <Text style={{ fontSize: 22, fontWeight: "700" }}>
//           {item.description}
//         </Text>
//         <Text style={{ fontSize: 18, opacity: 0.7 }}>
//           posted by: {item.username}
//         </Text>
//         <Text style={{ fontSize: 14, opacity: 0.8, color: "#0099cc" }}>
//           {item.contents}
//         </Text>
//         <Text onPress={() => like(item.id, item.likes)}>
//           Like Likes: {item.likes}
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default Post;
