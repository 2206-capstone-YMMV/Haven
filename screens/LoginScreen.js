import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
  ScrollView,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fontsLoaded] = useFonts({
    "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
    "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
    "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
    "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
    "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("Home");
      }
    });
    return unsubscribe;
  }, []);

  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setEmail("");
        setPassword("");
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView
      style={{ backgroundColor: "#fff", height: "100%" }}
      behavior="padding"
    >
      <ScrollView style={{ backgroundColor: "#fff" }}>
        <ImageBackground
          source={require("../assets/background.jpeg")}
          style={styles.background}
        >
          <View style={styles.brandView}>
            <Text style={styles.brandText}>Haven</Text>
          </View>
        </ImageBackground>
        <View style={styles.bottomView}>
          <View style={{ padding: 40 }}>
            <Text
              style={{
                color: "#4632A1",
                fontSize: 34,
                fontFamily: "signika-medium",
              }}
            >
              Welcome
            </Text>
            <View style={{ marginTop: 20 }}>
              <TextInput
                placeholder="Email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                style={styles.input}
              />

              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
                style={styles.input}
                secureTextEntry={true}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              title="Sign In"
              onPress={handleSignIn}
              style={styles.signin}
            >
              <Text style={styles.signInText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("SignUp")}
              style={styles.register}
            >
              <Text style={styles.registerText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  bottomView: {
    flex: 1.5,
    backgroundColor: "#fff",
    bottom: 50,
    borderTopStartRadius: 60,
    borderTopEndRadius: 60,
  },
  background: {
    backgroundColor: "#fff",
    height: Dimensions.get("window").height / 2.5,
  },
  brandView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  brandText: {
    color: "#fff",
    fontSize: 40,
    fontFamily: "signika-bold",
    textTransform: "uppercase",
  },
  input: {
    fontFamily: "signika-regular",
    width: 300,
    height: 40,
    backgroundColor: "#ECECEC",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: "#ECECEC",
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 14,
    margin: 5,
  },
  buttonContainer: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
  },
  signin: {
    backgroundColor: "#4632A1",
    elevation: 8,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: "center",
    width: Dimensions.get("window").width / 2,
    justifyContent: "center",
  },
  signInText: {
    fontSize: 18,
    fontFamily: "signika-bold",
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  register: {
    backgroundColor: "#ECECEC",
    elevation: 8,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: "center",
    width: Dimensions.get("window").width / 2,
    justifyContent: "center",
    margin: 10,
  },
  registerText: {
    fontSize: 18,
    fontFamily: "signika-bold",
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});