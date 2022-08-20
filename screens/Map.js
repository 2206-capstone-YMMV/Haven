// import { StatusBar } from "expo-status-bar";
// import * as React from "react";
// import MapView, { Marker } from "react-native-maps";
// import { Dimensions, StyleSheet, Text, View, Image, } from "react-native";
// import * as Location from "expo-location";


// export default function MapScreen() {
//   const [location, setLocation] = React.useState(null);
//   const [errorMsg, setErrorMsg] = React.useState(null);

//   React.useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         setErrorMsg("Permission to access location was denied");
//         return;
//       }
//       let location = await Location.getCurrentPositionAsync({});
//       setLocation(location);
//     })();
//   }, []);

//   let text = "Waiting...";
//   let lat;
//   let lon;

//   if (errorMsg) {
//     text = errorMsg;
//   } else if (location) {
//     console.log(location);
//     lat = location.coords.latitude;
//     lon = location.coords.longitude;
//   }

//   return (
//     <>
//       <View style={styles.container}>
//         {!location ? (
//           <Text style={{ textAlign: "center" }}>{text}</Text>
//         ) : (
//           <MapView
//             style={styles.map}
//             showsUserLocation={true}
//             initialRegion={{
//               latitude: lat,
//               longitude: lon,
//               latitudeDelta: 0.0922,
//               longitudeDelta: 0.0421,
//             }}
//           >
//             <Marker
//               title="You are here"
//               coordinate={{ latitude: lat, longitude: lon }}>
//               <Image
//               style={styles.pin}
//               source={{uri: 'https://media3.giphy.com/media/wWue0rCDOphOE/giphy.gif'}} />
//             </Marker>
//           </MapView>
//         )}
//         <StatusBar style="auto" />
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   map: {
//     width: Dimensions.get("window").width,
//     height: Dimensions.get("window").height,
//   },
//   pin: {
//     width: 40,
//     height: 40, 
//     borderTopRightRadius: 400, 
//     borderBottomLeftRadius: 400, 
//     borderBottomRightRadius: 400,
//     borderTopLeftRadius: 400
//   }
// });












import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useEffect, useState } from 'react'
import MapView, { Marker } from "react-native-maps";
import { Dimensions, StyleSheet, Text, View, Image, } from "react-native";
import * as Location from "expo-location";
import { db } from '../firebase'
import { collection, onSnapshot, query } from 'firebase/firestore' 
import { FontAwesome5 } from "@expo/vector-icons";


export default function MapScreen() {
  const colRef = collection(db, 'Post')
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [post, setPost] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  React.useEffect(  
    () => 
      onSnapshot(colRef, (snapshot) => 
      setPost(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))

    )
  ,[])

  let text = "Waiting...";
  let lat;
  let lon;

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    console.log(location);
  
    lat = location.coords.latitude;
    lon = location.coords.longitude;
  }

  return (
    <>
      <View style={styles.container}>
        {!location ? (
          <Text style={{ textAlign: "center" }}>{text}</Text>
        ) : (
          <MapView
            style={styles.map}
            showsUserLocation={true}
            initialRegion={{
              latitude: lat,
              longitude: lon,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              title="You are here"
              coordinate={{ latitude: lat, longitude: lon }}>
              <Image
              style={styles.pin}
              source={{uri: 'https://media3.giphy.com/media/wWue0rCDOphOE/giphy.gif'}} />
            </Marker>
            {post
          ? post.map((x) => (
              <Marker
                coordinate={x.location}
                title={x.username}
                description={x.description}
              >
                <FontAwesome5
                  name={x.icon}
                  size={26}
                  style={{ color: "red" }}
                />
              </Marker>
            ))
          : null}
          </MapView>
        )}
        <StatusBar style="auto" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  pin: {
    width: 40,
    height: 40, 
    borderTopRightRadius: 400, 
    borderBottomLeftRadius: 400, 
    borderBottomRightRadius: 400,
    borderTopLeftRadius: 400
  }
});
