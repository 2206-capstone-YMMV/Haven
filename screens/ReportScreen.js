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
      <Text style={styles.title}>Spam</Text>
    </TouchableOpacity>
    <TouchableOpacity>
      <Text style={styles.title}>Misinformation</Text>
    </TouchableOpacity>
    <TouchableOpacity>
      <Text style={styles.title}>Out of Supplies</Text>
    </TouchableOpacity>
    <TouchableOpacity>
      <Text style={styles.title}>Harassment </Text>
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
    margin: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    flexWrap: "wrap",
    marginTop: 16,
    paddingVertical: 8,
    borderWidth: 4,
    borderColor: "#20232a",
    borderRadius: 1,
    backgroundColor: "#42ADF0",
    color: "#20232a",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default ReportScreen;
