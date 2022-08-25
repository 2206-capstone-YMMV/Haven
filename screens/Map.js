import { StatusBar } from "expo-status-bar";
import * as React from "react";
import MapView, { Marker, Callout } from "react-native-maps";
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { db } from "../firebase";
import { collection, doc, getDocs, addDoc, GeoPoint, onSnapshot } from "firebase/firestore";
import { useNavigation } from '@react-navigation/core'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from "react-redux";
import { get_Post } from "../redux";

const MapScreen = (props) => {
  const navigation = useNavigation()
  const colRef = collection(db, 'Post')
  const [markers, setMarkers] = React.useState([]);
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [marked, setMarked] = React.useState([]);
  const [post, setPost] = React.useState([]);
  const locationCollectionRef = collection(db, "location");

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

    (async () => {
      const data = await getDocs(locationCollectionRef);
      setMarkers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    })();
    console.log(markers);
  }, []);

  React.useEffect(  
    () => 
      onSnapshot(colRef, (snapshot) => 
      setPost(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})))
    )
  ,[])
  const mapMarker = () => {
    return markers?.map((pin) => (
      <Marker
        key={pin.id}
        coordinate={{ latitude: pin.coords._lat, longitude: pin.coords._long }}
      ></Marker>
    ));
  };

  let text = "Waiting...";
  let lat;
  let lon;

  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    lat = location.coords.latitude;
    lon = location.coords.longitude;
  }

  const onMapPress = async () => {
    setMarked([...marked, location.coords]);
    const docRef = await addDoc(locationCollectionRef, {
      coords: new GeoPoint(location.coords.latitude, location.coords.longitude),
    });
  };

  return (
    <>
      <View>
        {!location ? (
          <Text style={{ textAlign: "center" }}>{text}</Text>
        ) : (
          <View style={styles.container}>
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
              {/* loads marker on current location */}

              {!marked
                ? null
                : marked.map((mark, index) => (
                    <Marker
                      key={index}
                      coordinate={{
                        latitude: mark.latitude,
                        longitude: mark.longitude,
                      }}
                    />
                  ))}

              {/* loads markers saved in database */}
              {mapMarker()}

              {/* button to activate marker load on location */}
              <TouchableOpacity
                onPress={onMapPress}
                style={styles.roundBtn}
              ></TouchableOpacity>
              {post
          ? post.map((x) => (
              <Marker
                keyExtractor={x.email}
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
          </View>
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
  },
  map: {
    zIndex: -1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  roundBtn: {
    position: "absolute",
    zIndex: 10,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 50,
    backgroundColor: "orange",
    alignSelf: "flex-end",
    marginTop: -5,
    top: 10,
    right: 10,
  },
  pin: {
    width: 40,
    height: 40,
    borderTopRightRadius: 400,
    borderBottomLeftRadius: 400,
    borderBottomRightRadius: 400,
    borderTopLeftRadius: 400,
  },
  bubble: {
    backgroundColor:'white'
  },
  box: {
    width: 90
  }
});


const mapDispatchToProps = (dispatch) => ({
  getPost : (post) => dispatch(get_Post(post))
})

export default connect(null, mapDispatchToProps)(MapScreen)
