import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import Input from "./Input";
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  updateDoc,
  query,
  increment,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase";

export const inappropriate = (id, inappropriate) => {
  getDocs(
    query(
      collection(db, "Post"),
      where("postId", "==", id),
      where("uid", "==", auth.currentUser.uid)
    )
  ).then(
    updateDoc(doc(db, "Post", id), { "reports.inappropriate": increment(1) })
  );
};
export const falseLocation = (id, falseLocation) => {
  getDocs(
    query(
      collection(db, "Post"),
      where("postId", "==", id),
      where("uid", "==", auth.currentUser.uid)
    )
  ).then(
    updateDoc(doc(db, "Post", id), { "reports.falseLocation": increment(1) })
  );
};
export const spam = (id, spam) => {
  getDocs(
    query(
      collection(db, "Post"),
      where("postId", "==", id),
      where("uid", "==", auth.currentUser.uid)
    )
  ).then(updateDoc(doc(db, "Post", id), { "reports.spam": increment(1) }));
};
export const misinformation = (id, spam) => {
  getDocs(
    query(
      collection(db, "Post"),
      where("postId", "==", id),
      where("uid", "==", auth.currentUser.uid)
    )
  ).then(
    updateDoc(doc(db, "Post", id), { "reports.misinformation": increment(1) })
  );
};
export const harassment = (id, spam) => {
  getDocs(
    query(
      collection(db, "Post"),
      where("postId", "==", id),
      where("uid", "==", auth.currentUser.uid)
    )
  ).then(
    updateDoc(doc(db, "Post", id), { "reports.harassment": increment(1) })
  );
};
export const outOfSupplies = (id, spam) => {
  getDocs(
    query(
      collection(db, "Post"),
      where("postId", "==", id),
      where("uid", "==", auth.currentUser.uid)
    )
  ).then(
    updateDoc(doc(db, "Post", id), { "reports.outOfSupplies": increment(1) })
  );
};
