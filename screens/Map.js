import { StatusBar } from "expo-status-bar";
import * as React from "react";
import MapView, { Marker } from "react-native-maps";
import { Dimensions, StyleSheet, Text, View, Image } from "react-native";
import * as Location from "expo-location";
import { db } from "../firebase";
import { collection, doc, getDocs } from "firebase/firestore";

export default function MapScreen() {
  const [markers, setMarkers] = React.useState([]);
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [marked, setMarked] = React.useState([]);

  const locationCollectionRef = collection(db, "location");

  const onMapPress = (e) => {
    setMarked([...marked, e.nativeEvent.coordinate]);
    console.log("marked", marked);
  };

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
    console.log(location);
  }, []);

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
            onPress={(e) => onMapPress(e)}
          >
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
            {mapMarker()}
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
    borderTopLeftRadius: 400,
  },
});
