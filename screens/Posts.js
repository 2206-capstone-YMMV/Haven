import React, { useEffect, useState } from 'react'
import { Text, View } from "react-native";
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore' 
import * as Location from "expo-location";

export default function Posts({ navigation }) {
    return (
        <View>
            <View >
                <Text
                    onPress={() => navigation.navigate('NewPost')}
                    style={{ fontSize: 26, fontWeight: "bold" }}>New Posts</Text>
            </View>
        </View>
    )
}