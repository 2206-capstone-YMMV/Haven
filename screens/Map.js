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
  TextInput,
  Button,
} from "react-native";
import * as Location from "expo-location";
import { db } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  addDoc,
  GeoPoint,
  onSnapshot,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/core";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { get_Post } from "../redux";
import DialogInput from "react-native-dialog-input";

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = 220;
const CARD_WIDTH = width * 0.8;

const MapScreen = (props) => {
  const navigation = useNavigation();
  const [markers, setMarkers] = React.useState([]);
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [marked, setMarked] = React.useState([]);
  const [post, setPost] = React.useState([]);
  const [isVis, setIsVis] = React.useState(false);

  const colRef = collection(db, "Post");
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
        setPost(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    []
  );

  const mapMarker = () => {
    return markers?.map((pin) => (
      <Marker
        key={pin.id}
        coordinate={{ latitude: pin.coords._lat, longitude: pin.coords._long }}
        title="Test Title"
        description={pin.content?.inputText}
      />
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

  const showDialog = () => {
    setIsVis(!isVis);
  };

  const sendInput = async (inputText) => {
    console.log(inputText);
    const docRef = await addDoc(locationCollectionRef, {
      content: { inputText },
      coords: new GeoPoint(location.coords.latitude, location.coords.longitude),
    });
    setMarked([...marked, location.coords]);
    setIsVis(!isVis);
  };

  let soup = require('../gifs/soup.gif')

  return (
    <>
      <View>
        <Image
          style={styles.pin}
          source={{uri: 'https://media2.giphy.com/media/hICiFp6y2rDyw/giphy.gif?cid=ecf05e47naqpg7n6gaenqwl4nd5nsfd5fmxgxjxc28ejqdn8&rid=giphy.gif&ct=g'}} 
        />
        <Image
          style={styles.pin}
          source={{uri: 'https://giphy.com/gifs/food-sandwich-sandwiches-74E4pNT4svUwJCfeeF'}} 
        />
        {!location ? (
          <Text style={{ textAlign: "center" }}>{text}</Text>
        ) : (
          <View style={styles.container}>
            <DialogInput
              title={"What can you find here?"}
              isDialogVisible={isVis}
              closeDialog={showDialog}
              submitInput={(inputText) => sendInput(inputText)}
            ></DialogInput>
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
            <Marker coordinate={{latitude: lat + 0.1, longitude: lon}}>
              <Image
                style={styles.pin}
                source={soup} />
            </Marker>
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

              {post
                ? post.map((x, index) => (
                    <Marker
                      keyExtractor={x.email}
                      coordinate={x.location}
                      title={x.username}
                      description={x.description}
                      key={index}
                    >
                      <MaterialCommunityIcons
                        name={x.role === "Student" ? "heart" : "account"}
                        color={x.role === "Student" ? "red" : "blue"}
                        size={25}
                        onPress={() => props.getPost(x)}
                      />
                      <Callout tooltip style={styles.box}>
                        <View>
                          <View style={styles.bubble}>
                            <Text>{x.description}</Text>
                            <TouchableOpacity
                              onPress={() => navigation.navigate("SinglePost")}
                            >
                              <Text style={styles.buttonOutLineText}>
                                View Detail
                              </Text>
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
              <TouchableOpacity style={styles.Btn} onPress={showDialog}>
                <Text style={{ fontSize: 9 }}>NEW</Text>
              </TouchableOpacity>
            </MapView>
          </View>
        )}
        <StatusBar style="auto" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  carousel: {
    position: "absolute",
    zIndex: 10,
    bottom: 0,
    marginBottom: 48,
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
    backgroundColor: "white",
  },
  box: {
    width: 90,
  },
  Btn: {
    position: "absolute",
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 40,
    backgroundColor: "orange",
    alignSelf: "flex-end",
    marginTop: -5,
    top: 10,
    right: 10,
  },
  viewWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalView: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: "50%",
    left: "50%",
    elevation: 5,
    transform: [{ translateX: -(width * 0.4) }, { translateY: -90 }],
    height: 180,
    width: width * 0.8,
    backgroundColor: "#fff",
    borderRadius: 7,
  },
  textInput: {
    width: "80%",
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    marginBottom: 8,
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});

const mapDispatchToProps = (dispatch) => ({
  getPost: (post) => dispatch(get_Post(post)),
});

export default connect(null, mapDispatchToProps)(MapScreen);
