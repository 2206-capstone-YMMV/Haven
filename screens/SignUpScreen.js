import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../firebase";
import { useNavigation } from "@react-navigation/core";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import DropDownPicker from "react-native-dropdown-picker";

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
    <View>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
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
      />
      <TouchableOpacity onPress={SignUp} style={[styles.button]}>
        <Text style={styles.buttonOutLineText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={[styles.button, styles.buttonOutline]}
      >
        <Text style={styles.buttonOutLineText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "80%",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: "60%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "100%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonOutline: {
    backgroundColor: "white",
    marginTop: 5,
    borderColor: "#0782F9",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonOutlineText: {
    color: "#0782F9",
    fontWeight: "700",
    fontSize: 16,
  },

});

