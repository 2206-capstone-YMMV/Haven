import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useEffect, useState } from 'react'
import MapView, { Marker, Callout } from "react-native-maps";
import { Dimensions, StyleSheet, Text, View, Image, TouchableOpacity} from "react-native";
import * as Location from "expo-location";
import { db } from '../firebase'
import { collection, onSnapshot, query } from 'firebase/firestore' 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/core'
import { connect } from "react-redux";
import { get_Post } from "../redux";


const MapScreen = (props) => {
  const navigation = useNavigation()
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
            showsUserLocation={false}
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
            </Marker>
            {post
          ? post.map((x) => (
              <Marker
                key={x.email}
                coordinate={x.location}
                title={x.username}
                description={x.description}
              >
               <MaterialCommunityIcons name={x.role === "Student"? 'heart':'account'} color={x.role === "Student"? 'red':'blue'} size={25}  onPress={() => props.getPost(x)}/> 
               <Callout tooltip style={styles.box}>
                <View >
                  <View style={styles.bubble}>
                    <Text>{x.description}</Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('SinglePost')}
                      >
                      <Text style={styles.buttonOutLineText}>View Detail</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                      onPress={() => props.getPost(x)}
                      >
                      <Text style={styles.buttonOutLineText}>Updata</Text>
                    </TouchableOpacity> */}
                  </View>
                </View>
               </Callout>
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

const mapDispatchToProps = (dispatch) => ({
  getPost : (post) => dispatch(get_Post(post))
})

export default connect(null, mapDispatchToProps)(MapScreen)

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
  },
  bubble: {
    backgroundColor:'white'
  },
  box: {
    width: 90
  }
});
