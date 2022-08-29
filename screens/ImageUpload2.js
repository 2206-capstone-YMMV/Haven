import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from "react-native";
import firebaseConfig from "../firebaseConfig.tsx";
import { initializeApp } from "firebase/app"; //validate yourself
import { getStorage, ref, getDownloadURL } from "firebase/storage"; //access the storage database

initializeApp(firebaseConfig);

export default function ImageUpload2() {
  const [url, setUrl] = useState();

  useEffect(() => {
    const func = async () => {
      const reference = ref(
        getStorage(),
        "/images/78b1fa8b-9fa0-40f7-850b-0db8561e3260"
      );
      await getDownloadURL(reference).then((x) => {
        setUrl(x);
      });
    };

    if (url == undefined) {
      func();
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#123456",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image style={{ width: "70%", height: "70%" }} source={{ uri: url }} />
    </View>
  );
}
