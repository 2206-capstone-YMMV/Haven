import * as React from "react";
import { Text, View } from "react-native";

export default function Posts({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text
            onPress={() => navigation.navigate('Map')}
            style={{ fontSize: 26, fontWeight: "bold" }}>Posts Screen</Text>
        </View>
    )
}