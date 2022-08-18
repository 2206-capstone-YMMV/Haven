import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearProgress, Button } from "@rneui/base";
import { useState, useEffect } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let subs = true;
    if (progress < 1 && progress !== 0) {
      setTimeout(() => {
        if (subs) {
          setProgress(progress + 0.1);
        }
      }, 1000);
    }
    return () => {
      subs = false;
    };
  }, [progress]);

  return (
    <View style={styles.container}>
      <LinearProgress style={{ marginVertical: 10 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
