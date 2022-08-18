import { StatusBar } from "expo-status-bar";
import * as React from "react";
import MapView, { Marker } from "react-native-maps";
import { Dimensions, StyleSheet, Text, View, Animated } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './screens/Home'
import LoginScreen from './screens/LoginScreen';
import * as Location from "expo-location";
import LoadingScreen from "./components/LoadingScreen";
import MapMarkers from "./components/MapMarkers";
const Stack = createNativeStackNavigator();


export default function App() {
  const [location, setLocation] = React.useState(null);
  const [errorMsg, setErrorMsg] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLoading(false);
    })();
  }, [fadeAnim]);

  let text = "Waiting...";

  if (errorMsg) {
    text = errorMsg;
  }

  return (

    <>
      <Animated.View style={{ ...styles.container, opacity: fadeAnim }}>
        {loading === true ? (
          <LoadingScreen />
        ) : (
          <View>
            {location && (
              <MapView
                style={styles.map}
                showsUserLocation={true}
                // initialRegion={{
                //   latitude: location?.coords?.latitude,
                //   longitude: location?.coords?.longitude,
                //   latitudeDelta: 0.0922,
                //   longitudeDelta: 0.0421,
                // }}
              >
                <MapMarkers />
              </MapView>
            )}
          </View>
        )}
        <StatusBar style="auto" />
      </Animated.View>
    </>

    <NavigationContainer>
      <Stack.Navigator>
      {/* <Stack.Screen name="Map" component={MapScreen} /> */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});