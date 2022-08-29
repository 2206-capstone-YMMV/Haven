import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
const ReportScreen = () => (
  <View style={styles.container}>
    <TouchableOpacity>
      <Text style={styles.title}>Inappropriate</Text>
    </TouchableOpacity>
    <TouchableOpacity>
      <Text style={styles.title}>False Location</Text>
    </TouchableOpacity>
    <TouchableOpacity>
      <Text style={styles.title}>Sharing Personal Information</Text>
    </TouchableOpacity>
    <TouchableOpacity>
      <Text style={styles.title}>Spam</Text>
    </TouchableOpacity>
    <TouchableOpacity>
      <Text style={styles.title}>Prohibited Transaction</Text>
    </TouchableOpacity>
    <TouchableOpacity>
      <Text style={styles.title}>Harassment </Text>
    </TouchableOpacity>

    <TextInput style={styles.title} placeholder="Other.."></TextInput>
    <TouchableOpacity style={styles.submit}>
      <Text>Submit </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#eaeaea",
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#61dafb",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
  submit: {
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 6,
    backgroundColor: "#61dafb",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default ReportScreen;
