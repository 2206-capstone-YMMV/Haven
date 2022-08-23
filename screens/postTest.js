// import React, { useState, useContext } from "react";
// import {
//   View,
//   Text,
//   Platform,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import ActionButton from "react-native-action-button";
// import Icon from "react-native-vector-icons/Ionicons";
// import ImagePicker from "react-native-image-crop-picker";

// import storage from "@react-native-firebase/storage";
// import firestore from "@react-native-firebase/firestore";

// import {
//   InputField,
//   InputWrapper,
//   AddImage,
//   SubmitBtn,
//   SubmitBtnText,
//   StatusWrapper,
// } from "../styles/AddPost";

// import { AuthContext } from "../navigation/AuthProvider";

// const AddPostScreen = () => {
//   const { user, logout } = useContext(AuthContext);

//   const [image, setImage] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [transferred, setTransferred] = useState(0);
//   const [post, setPost] = useState(null);

//   const takePhotoFromCamera = () => {
//     ImagePicker.openCamera({
//       width: 1200,
//       height: 780,
//       cropping: true,
//     }).then((image) => {
//       console.log(image);
//       const imageUri = Platform.OS === "ios" ? image.sourceURL : image.path;
//       setImage(imageUri);
//     });
//   };

//   const choosePhotoFromLibrary = () => {
//     ImagePicker.openPicker({
//       width: 1200,
//       height: 780,
//       cropping: true,
//     }).then((image) => {
//       console.log(image);
//       const imageUri = Platform.OS === "ios" ? image.sourceURL : image.path;
//       setImage(imageUri);
//     });
//   };

//   const submitPost = async () => {
//     const imageUrl = await uploadImage();
//     console.log("Image Url: ", imageUrl);
//     console.log("Post: ", post);

//     firestore()
//       .collection("posts")
//       .add({
//         userId: user.uid,
//         post: post,
//         postImg: imageUrl,
//         postTime: firestore.Timestamp.fromDate(new Date()),
//         likes: null,
//         comments: null,
//       })
//       .then(() => {
//         console.log("Post Added!");
//         Alert.alert(
//           "Post published!",
//           "Your post has been published Successfully!"
//         );
//         setPost(null);
//       })
//       .catch((error) => {
//         console.log(
//           "Something went wrong with added post to firestore.",
//           error
//         );
//       });
//   };

//   const uploadImage = async () => {
//     if (image == null) {
//       return null;
//     }
//     const uploadUri = image;
//     let filename = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);

//     // Add timestamp to File Name
//     const extension = filename.split(".").pop();
//     const name = filename.split(".").slice(0, -1).join(".");
//     filename = name + Date.now() + "." + extension;

//     setUploading(true);
//     setTransferred(0);

//     const storageRef = storage().ref(`photos/${filename}`);
//     const task = storageRef.putFile(uploadUri);

//     // Set transferred state
//     task.on("state_changed", (taskSnapshot) => {
//       console.log(
//         `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`
//       );

//       setTransferred(
//         Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
//           100
//       );
//     });

//     try {
//       await task;

//       const url = await storageRef.getDownloadURL();

//       setUploading(false);
//       setImage(null);

//       // Alert.alert(
//       //   'Image uploaded!',
//       //   'Your image has been uploaded to the Firebase Cloud Storage Successfully!',
//       // );
//       return url;
//     } catch (e) {
//       console.log(e);
//       return null;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <InputWrapper>
//         {image != null ? <AddImage source={{ uri: image }} /> : null}

//         <InputField
//           placeholder="What's on your mind?"
//           multiline
//           numberOfLines={4}
//           value={post}
//           onChangeText={(content) => setPost(content)}
//         />
//         {uploading ? (
//           <StatusWrapper>
//             <Text>{transferred} % Completed!</Text>
//             <ActivityIndicator size="large" color="#0000ff" />
//           </StatusWrapper>
//         ) : (
//           <SubmitBtn onPress={submitPost}>
//             <SubmitBtnText>Post</SubmitBtnText>
//           </SubmitBtn>
//         )}
//       </InputWrapper>
//       <ActionButton buttonColor="#2e64e5">
//         <ActionButton.Item
//           buttonColor="#9b59b6"
//           title="Take Photo"
//           onPress={takePhotoFromCamera}
//         >
//           <Icon name="camera-outline" style={styles.actionButtonIcon} />
//         </ActionButton.Item>
//         <ActionButton.Item
//           buttonColor="#3498db"
//           title="Choose Photo"
//           onPress={choosePhotoFromLibrary}
//         >
//           <Icon name="md-images-outline" style={styles.actionButtonIcon} />
//         </ActionButton.Item>
//       </ActionButton>
//     </View>
//   );
// };

// export default AddPostScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   actionButtonIcon: {
//     fontSize: 20,
//     height: 22,
//     color: "white",
//   },
// });
// // import { initializeApp } from 'firebase/app'
// // import {
// //   getFirestore, collection, getDocs
// // } from 'firebase/firestore'

// // const firebaseConfig = {
// //   apiKey: "AIzaSyDmXgb_58lO7aK_ujN37pGlNxzWGEU0YpI",
// //   authDomain: "fb9-sandbox.firebaseapp.com",
// //   projectId: "fb9-sandbox",
// //   storageBucket: "fb9-sandbox.appspot.com",
// //   messagingSenderId: "867529587246",
// //   appId: "1:867529587246:web:dc754ab7840c737f47bdbf"
// // }

// // // init firebase
// // initializeApp(firebaseConfig)

// // // init services
// // const db = getFirestore()

// // // collection ref
// // const colRef = collection(db, 'books')

// // // get collection data
// // getDocs(colRef)
// //   .then(snapshot => {
// //     // console.log(snapshot.docs)
// //     let books = []
// //     snapshot.docs.forEach(doc => {
// //       books.push({ ...doc.data(), id: doc.id })
// //     })
// //     console.log(books)
// //   })
// //   .catch(err => {
// //     console.log(err.message)
// //   })
// import SkeletonPlaceholder from "react-native-skeleton-placeholder";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import PostCard from "../components/PostCard";
// import storage from "@react-native-firebase/storage";

// const DisplayPost = () => {
//   const [posts, setPosts] = useState(null);
//   const [loading, setLoading] = useState(true);
//   //   const [deleted, setDeleted] = useState(false);

//   const fetchPosts = async () => {
//     try {
//       const list = [];

//       await db()
//         .collection(db, "Post")
//         .orderBy("createAt", "desc")
//         .get()
//         .then((querySnapshot) => {
//           console.log("Total Posts: ", querySnapshot.size);

//           querySnapshot.forEach((doc) => {
//             const { description, username } = doc.data();
//             list.push({
//               username,
//               description,
//               //  const { userId, post, postImg, postTime, likes, comments }
//               // id: doc.id,
//               // userId,
//               // userName: "Test Name",
//               // userImg: "",
//               // postTime: postTime,
//               // post,
//               // postImg,
//               // liked: false,
//               // likes,
//               // comments,
//             });
//           });
//         });
//       setPosts(list);
//       if (loading) {
//         setLoading(false);
//       }
//     } catch (e) {
//       console.log(e);
//     }
//   };
//   useEffect(() => {
//     fetchPosts();
//   }, []);}
// const displayPost = () => {
//   const GetData = async () => {
//     const colRef = collection(db, "Post");
//     const colRefSnapshot = await getDocs(colRef);
//     const colList = colRefSnapshot.docs.map((doc) => doc.data());
//     console.log(colList);
//   };
//   useEffect(() => {
//     GetData();
//   }, []);
// }

// try {
//   const list = [];

//   await db()
//     .collection(db, "books")
//     .orderBy("createAt", "desc")
//     .get()
//     .then((querySnapshot) => {
//       console.log("Total Posts: ", querySnapshot.size);

//       querySnapshot.forEach((doc) => {
//         const { description, username } = doc.data();
//         list.push({
//           username,
//           description,
//         });
//       });
//     });
// } catch (e) {
//   console.log(e);
// }
