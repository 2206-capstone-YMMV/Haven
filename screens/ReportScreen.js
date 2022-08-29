import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
const ReportScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Inappropriate</Text>
    <Text style={styles.title}>False Location</Text>
    <Text style={styles.title}>Sharing Personal Information</Text>
    <Text style={styles.title}>Spam</Text>
    <Text style={styles.title}>Prohibited Transaction</Text>
    <Text style={styles.title}>Harassment </Text>
    <Text style={styles.title}>Other </Text>
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
});

export default ReportScreen;
