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
  Button,
  TextInput,
  Modal,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { db } from "../firebase";
import { auth } from "../firebase";
import {
  collection,
  query,
  where,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  GeoPoint,
  onSnapshot,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/core";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { connect } from "react-redux";
import { get_Post } from "../redux";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Rating, AirbnbRating } from "react-native-ratings";

import SelectDropdown from "react-native-select-dropdown";
import Gifs from "../gifs/gifs";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import getDistance from "geolib/es/getDistance";
import Gifs from "../gifs/gifs";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import getDistance from "geolib/es/getDistance";
import { useFonts } from "expo-font";

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
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [search, setSearch] = React.useState("");

  const [open, setOpen] = React.useState(false);
  const [gifOpen, setGifOpen] = React.useState(false);
  const [eventOpen, setEventOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);

  const [gifValue, setGifValue] = React.useState(null);
  const [eventValue, setEventValue] = React.useState(false);
  const [dropDownValue, setDropDownValue] = React.useState("markers");
  const [dropDownText, setDropDownText] = React.useState("Locations");
  const [distanceValue, setDistanceValue] = React.useState("All");
  const [distanceText, setDistanceText] = React.useState("All");

  const [fontsLoaded] = useFonts({
    "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
    "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
    "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
    "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
    "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
  });

  const [items, setItems] = React.useState([
    { label: "Food", value: "food" },
    { label: "Clothing", value: "clothing" },
    { label: "Shelter", value: "shelter" },
    { label: "Items", value: "items" },
  ]);
  const gifs = [];
  for (let key in Gifs) {
    gifs.push({ label: key, value: key });
  }
  const [gifItems, setGifItems] = React.useState(gifs);
  const [eventItems, setEventItems] = React.useState([
    { label: "Is Event", value: true },
    { label: "Is Location", value: false },
  ]);

  const [date, setDate] = React.useState(new Date());
  const [user, setUser] = React.useState(null);

  const colRef = collection(db, "Post");
  const locationCollectionRef = collection(db, "location");

  const dropDownData = ["markers", "posts"];
  const distanceVlaue = ["10", "500", "All"];

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
      onSnapshot(locationCollectionRef, (snapshot) =>
        setMarkers(
          snapshot.docs.map((docu) => {
            let date = docu.data().date;
            if (date && date.seconds < Date.now() / 1000) {
              //Events timer are stored in seconds, while Date.now is milliseconds
              console.log("deleting event");
              deleteDoc(doc(db, "location", docu.id));
            }
            return { ...docu.data(), id: docu.id };
          })
        )
      ),
    []
  );

  React.useEffect(
    () =>
      onSnapshot(colRef, (snapshot) =>
        setPost(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      ),
    []
  );
  const votes = (id) => {
    getDocs(
      query(
        collection(db, "location"),
        where("locationId", "==", id)
        // where("uid", "==", auth.currentUser.uid)
      )
    ).then(updateDoc(doc(db, "location", id), { vote: increment(1) }));
  };
  const ratings = (id, rating) => {
    getDocs(
      query(
        collection(db, "location"),
        where("locationId", "==", id)
        // where("uid", "==", auth.currentUser.uid)
      )
    ).then(
      updateDoc(
        doc(db, "location", id),
        { ratings: increment(rating) }
        // { vote: increment(1) }
      )
    );
  };

  // React.useEffect(
  //   () =>
  //     onSnapshot(
  //       collection(db, "users"),
  //       where("uid", "==", auth.currentUser?.uid),
  //       (snapshot) =>
  //         console.log(snapshot.docs[0].data().role, snapshot.docs[0].id)
  //     ),
  //   []
  // );

  const mapMarkerAll = () => {
    return filterMarkersData?.map((pin) => (
      <Marker
        key={pin.id}
        coordinate={{ latitude: pin.coords._lat, longitude: pin.coords._long }}
        // title={pin.title} description={pin.content?.inputText}
      >
        <Callout>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text>
              {pin.title} {pin.content?.inputText}
            </Text>

            <Text>
              <Rating
                readonly={true}
                startingValue={(pin.ratings / pin.vote).toFixed(2)}
                imageSize={22}
              />
              ({pin.vote})
            </Text>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Rating
                style={styles.modalContainer}
                showRating
                imageSize={40}
                onFinishRating={(rating) => {
                  votes(pin.id);
                  ratings(pin.id, rating);
                  Alert.alert("Your report has been submitted.");
                  setModalVisible(!modalVisible);
                }}
              />
            </Modal>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <Text style={styles.title}>Click to rate location</Text>
            </TouchableOpacity>
          </View>
        </Callout>
        {pin.gif ? (
          <Image style={styles.pin} source={{ uri: Gifs[pin.gif] }} />
        ) : null}
      </Marker>
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

  const sendInput = async (title, inputText, value, gif, date) => {
    console.log(title, inputText);
    if (!eventValue) {
      date = null;
    }
    await addDoc(locationCollectionRef, {
      content: { inputText },
      title,
      category: value,
      gif,
      date,
      coords: new GeoPoint(location.coords.latitude, location.coords.longitude),
    });
    setMarked([...marked, location.coords]);
    setIsVis(!isVis);
  };

  const settingDate = (datepicker, selectedDate) => {
    setDate(selectedDate);
  };

  // filter
  const post10 = () =>
    post.filter((po) => {
      let postLat = po.location.latitude;
      let postLon = po.location.longitude;
      let value = getDistance(
        { latitude: lat, longitude: lon },
        { latitude: postLat, longitude: postLon }
      );
      value = Math.floor(value * 0.00062137);
      if (Number(value) <= 10 && po.description.indexOf(search) >= 0) {
        return po;
      }
    });

  const post500 = () =>
    post.filter((po) => {
      // return Number(set_postDistance(po)) <= 500 && po.description.indexOf(search) >= 0
      let postLat = po.location.latitude;
      let postLon = po.location.longitude;
      let value = getDistance(
        { latitude: lat, longitude: lon },
        { latitude: postLat, longitude: postLon }
      );
      value = Math.floor(value * 0.00062137);
      if (Number(value) <= 500 && po.description.indexOf(search) >= 0) {
        return po;
      }
    });

  const marker10 = () =>
    markers.filter((marker) => {
      let postLat = marker.coords.latitude;
      let postLon = marker.coords.longitude;
      let value = getDistance(
        { latitude: lat, longitude: lon },
        { latitude: postLat, longitude: postLon }
      );
      value = Math.floor(value * 0.00062137);
      if (
        Number(value) <= 10 &&
        marker.content.inputText.indexOf(search) >= 0
      ) {
        return marker;
      }
    });

  const marker500 = () =>
    markers.filter((marker) => {
      let postLat = marker.coords.latitude;
      let postLon = marker.coords.longitude;
      let value = getDistance(
        { latitude: lat, longitude: lon },
        { latitude: postLat, longitude: postLon }
      );
      value = Math.floor(value * 0.00062137);
      if (
        Number(value) <= 500 &&
        marker.content.inputText.indexOf(search) >= 0
      ) {
        return marker;
      }
    });
  const filterMarkersData = markers.filter((maker) => {
    return maker.content.inputText.indexOf(search) >= 0;
  });

  const filterPostsData = post.filter((po) => {
    return po.description.indexOf(search) >= 0;
  });

  const dropDownSwitch = () => {
    if (dropDownValue === "markers") {
      setDropDownValue("posts");
      setDropDownText("Posts");
    } else {
      setDropDownValue("markers");
      setDropDownText("Locations");
    }
  };

  const distanceSwitch = () => {
    if (distanceValue === "All") {
      setDistanceValue("10");
      setDistanceText("Near");
    } else if (distanceValue === "10") {
      setDistanceValue("500");
      setDistanceText("Far");
    } else {
      setDistanceValue("All");
      setDistanceText("All");
    }
  };

  return (
    <>
      <View>
        {!location ? (
          <Text style={{ textAlign: "center" }}>{text}</Text>
        ) : (
          <View style={styles.container}>
            <Modal visible={isVis}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  backgroundColor: "#251934",
                }}
              >
                <Text style={styles.formLabel}> Add Location </Text>
                <View zIndex={10}>
                  <TextInput
                    onChangeText={(text) => setTitle(text)}
                    placeholder="Enter Title"
                    style={{ ...styles.inputStyle, height: 40 }}
                  />
                  <TextInput
                    onChangeText={(text) => setContent(text)}
                    placeholder="Content"
                    multiline
                    blurOnSubmit={true}
                    style={{ ...styles.inputStyle, height: 80 }}
                  />
                  <DropDownPicker
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={styles.dropdown}
                    stickyHeader={true}
                    zIndex={10}
                  />
                  <DropDownPicker
                    open={gifOpen}
                    value={gifValue}
                    items={gifItems}
                    setOpen={setGifOpen}
                    setValue={setGifValue}
                    setItems={setGifItems}
                    style={styles.dropdown}
                    stickyHeader={true}
                    zIndex={9}
                  />

                  {user === "helper" ? (
                    <DropDownPicker
                      open={eventOpen}
                      value={eventValue}
                      items={eventItems}
                      setOpen={setEventOpen}
                      setValue={setEventValue}
                      setItems={setEventItems}
                      style={styles.dropdown}
                    />
                  ) : null}
                  {eventValue ? (
                    <RNDateTimePicker
                      value={date}
                      onChange={settingDate}
                      mode="datetime"
                      minimumDate={Date.now()}
                    />
                  ) : null}
                </View>
                <View zIndex={9}>
                  <Text
                    style={styles.button}
                    onPress={() =>
                      sendInput(title, content, value, gifValue, date)
                    }
                  >
                    Submit
                  </Text>
                  <Text style={styles.button} onPress={() => setIsVis(!isVis)}>
                    Hide
                  </Text>
                </View>
              </View>
            </Modal>

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

              {Number(distanceValue) == 10 && dropDownValue == "markers"
                ? marker10().map((pin) => (
                    <Marker
                      key={pin.id}
                      coordinate={{
                        latitude: pin.coords._lat,
                        longitude: pin.coords._long,
                      }}
                      title={pin.title}
                      description={pin.content?.inputText}
                    >
                      {pin.gif ? (
                        <Image
                          style={styles.pin}
                          source={{ uri: Gifs[pin.gif] }}
                        />
                      ) : null}
                    </Marker>
                  ))
                : ""}
              {Number(distanceValue) == 500 && dropDownValue == "markers"
                ? marker500().map((pin) => (
                    <Marker
                      key={pin.id}
                      coordinate={{
                        latitude: pin.coords._lat,
                        longitude: pin.coords._long,
                      }}
                      title={pin.title}
                      description={pin.content?.inputText}
                    >
                      {pin.gif ? (
                        <Image
                          style={styles.pin}
                          source={{ uri: Gifs[pin.gif] }}
                        />
                      ) : null}
                    </Marker>
                  ))
                : ""}
              {distanceValue == "All" && dropDownValue == "markers"
                ? mapMarkerAll()
                : ""}

              {Number(distanceValue) == 10 && dropDownValue === "posts"
                ? post10().map((item, index) => (
                    <Marker
                      keyExtractor={item.email}
                      coordinate={item.location}
                      title={item.username}
                      description={item.description}
                      key={index}
                    >
                      <MaterialCommunityIcons
                        name={item.role === "Helper" ? "heart" : "account"}
                        color={item.role === "Helper" ? "red" : "blue"}
                        size={25}
                        onPress={() => props.getPost(item)}
                      />
                      <Callout tooltip style={styles.box}>
                        <View>
                          <View style={styles.bubble}>
                            <Text>{item.description}</Text>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("SinglePost", { item })
                              }
                            >
                              <Text style={styles.buttonOutLineText}>
                                View Detail
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Callout>
                    </Marker>
                  ))
                : ""}
              {Number(distanceValue) == 500 && dropDownValue === "posts"
                ? post500().map((item, index) => (
                    <Marker
                      keyExtractor={item.email}
                      coordinate={item.location}
                      title={item.username}
                      description={item.description}
                      key={index}
                    >
                      <MaterialCommunityIcons
                        name={item.role === "Helper" ? "heart" : "account"}
                        color={item.role === "Helper" ? "red" : "blue"}
                        size={25}
                        onPress={() => props.getPost(item)}
                      />
                      <Callout tooltip style={styles.box}>
                        <View>
                          <View style={styles.bubble}>
                            <Text>{item.description}</Text>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("SinglePost", { item })
                              }
                            >
                              <Text style={styles.buttonOutLineText}>
                                View Detail
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Callout>
                    </Marker>
                  ))
                : ""}
              {distanceValue == "All" && dropDownValue === "posts"
                ? filterPostsData.map((item, index) => (
                    <Marker
                      keyExtractor={item.email}
                      coordinate={item.location}
                      title={item.username}
                      description={item.description}
                      key={index}
                    >
                      <MaterialCommunityIcons
                        name={item.role === "Helper" ? "heart" : "account"}
                        color={item.role === "Helper" ? "red" : "blue"}
                        size={25}
                        onPress={() => props.getPost(item)}
                      />
                      <Callout tooltip style={styles.box}>
                        <View>
                          <View style={styles.bubble}>
                            <Text>{item.description}</Text>
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("SinglePost", { item })
                              }
                            >
                              <Text style={styles.buttonOutLineText}>
                                View Detail
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Callout>
                    </Marker>
                  ))
                : ""}
              <View style={styles.searchWrapperStyle}>
                <TextInput
                  style={styles.textInput}
                  value={search}
                  placeholder="Search By Content"
                  underlineColorAndroid="transparent"
                  onChangeText={(text) => setSearch(text)}
                />
              </View>

              <Text style={[styles.filter]} onPress={() => dropDownSwitch()}>
                {dropDownText}
              </Text>
              <Text
                style={[styles.filter, styles.distance]}
                onPress={() => distanceSwitch()}
              >
                {distanceText}
              </Text>
              <Text style={styles.Btn} onPress={() => setIsVis(!isVis)}>
                Add
              </Text>
            </MapView>
          </View>
        )}
        <StatusBar style="auto" />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    backgroundColor: "#eeecef",
    alignSelf: "flex-end",
    marginTop: -5,
    top: 115,
    right: 10,
    fontFamily: "signika-bold",
  },
  viewWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  textInput: {
    height: 50,
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    flex: 1,
    fontSize: 16,
    fontFamily: "signika-regular",
    paddingVertical: 8,
    paddingHorizontal: 0,
    marginTop: 50,
    marginBottom: 30,
    borderColor: "#009688",
    backgroundColor: "white",
  },
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  formLabel: {
    fontSize: 20,
    color: "white",
    fontFamily: "signika-bold",
  },
  button: {
    fontSize: 20,
    color: "white",
    fontFamily: "signika-bold",
    paddingTop: 20,
    alignSelf: "center",
  },
  inputStyle: {
    marginTop: 20,
    width: 300,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#DCDCDC",
    fontFamily: "signika-regular",
  },
  dropdown: {
    marginTop: 20,
    width: 300,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: "#DCDCDC",
  },
  searchWrapperStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filter: {
    position: "absolute",
    top: 115,
    backgroundColor: "#eeecef",
    padding: 10,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    left: 10,
    fontFamily: "signika-bold",
  },
  distance: {
    left: 120,
  },
  iconStyle: {
    marginTop: 12,
    marginHorizontal: 8,
  },
  containerStyle: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    margin: 300,
    borderRadius: 20,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

const mapDispatchToProps = (dispatch) => ({
  getPost: (post) => dispatch(get_Post(post)),
});

export default connect(null, mapDispatchToProps)(MapScreen);
