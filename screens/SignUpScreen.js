import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
  KeyboardAvoidingView,
  Button,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import DropDownPicker from "react-native-dropdown-picker";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const colRef = collection(db, "users");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: "User", value: "user" },
    { label: "Helper", value: "helper" },
  ]);

  const [fontsLoaded] = useFonts({
    "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
    "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
    "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
    "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
    "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
  });

  const SignUp = () => {
    if (pwd == pwd2) {
      createUserWithEmailAndPassword(auth, email, pwd)
        .then((x) => {
          addDoc(colRef, {
            uid: x.user.uid,
            email: email,
            name: name,
            role: role,
          });
        })
        .catch((error) => {
          alert(error.message);
        });
    } else {
      alert("Passwords are different!");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ backgroundColor: "#fff" }}
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
            <Text style={{ fontFamily: "signika-light" }}>
              Already have an account?
              <Text
                onPress={() => navigation.navigate("Login")}
                style={{ color: "red", fontFamily: "signika-regular" }}
              >
                {" "}
                Sign in now
              </Text>
            </Text>
            <View style={{ marginTop: 20 }}>
              <TextInput
                style={styles.input}
                placeholder="Name"
                onChangeText={(text) => setName(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
              />

              <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => setPwd(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry={true}
                onChangeText={(text) => setPwd2(text)}
              />
              <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setRole}
                setItems={setItems}
                textStyle={{ color: "grey", fontFamily: "signika-regular" }}
                style={{
                  backgroundColor: "#ECECEC",
                  borderColor: "#fff",
                }}
                dropDownContainerStyle={{
                  backgroundColor: "#ECECEC",
                  borderColor: "#fff",
                }}
                containerStyle={{
                  width: 300,
                  height: 40,
                  borderColor: "#fff",
                  margin: 5,
                }}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              title="Sign Up"
              onPress={SignUp}
              style={styles.signup}
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={styles.back}
            >
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

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
  signup: {
    backgroundColor: "#4632A1",
    elevation: 8,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignSelf: "center",
    width: Dimensions.get("window").width / 2,
    justifyContent: "center",
  },
  signUpText: {
    fontSize: 18,
    fontFamily: "signika-bold",
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  back: {
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
  backText: {
    fontSize: 18,
    fontFamily: "signika-bold",
    color: "black",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
});
