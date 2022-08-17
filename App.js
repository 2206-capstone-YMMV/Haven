import { StatusBar } from "expo-status-bar";
import * as React from "react";
import MapView, { Marker } from "react-native-maps";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);

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
            {/* <Marker
              title="You are here"
              coordinate={{ latitude: lat, longitude: lon }}
            /> */}
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
});
