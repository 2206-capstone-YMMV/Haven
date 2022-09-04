import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFonts } from "expo-font";

import Map from "./Map";
import Profile from "./Profile";
import Posts from "./Posts";
import MessagesTab from "./MessagesTab";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

export default function Home() {
  const [fontsLoaded] = useFonts({
    "signika-bold": require("../fonts/SignikaNegative-Bold.ttf"),
    "signika-light": require("../fonts/SignikaNegative-Light.ttf"),
    "signika-medium": require("../fonts/SignikaNegative-Medium.ttf"),
    "signika-regular": require("../fonts/SignikaNegative-Regular.ttf"),
    "signika-semi": require("../fonts/SignikaNegative-SemiBold.ttf"),
  });

  return (
    <Tab.Navigator
      initialRouteName="Map"
      animationEnabled="true"
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 15,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: "#ECECEC",
          borderRadius: 30,
          height: 60,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 7 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
        },
      }}
    >
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          headerShown: false, 
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
              }}
            >
              <MaterialCommunityIcons
                name="home"
                style={{ color: focused ? "#4632A1" : "#fff" }}
                size={30}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false, 
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
              }}
            >
              <MaterialCommunityIcons
                name="account-circle"
                style={{ color: focused ? "#4632A1" : "#fff" }}
                size={30}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Posts"
        component={Posts}
        options={{
          headerTitleStyle: { fontFamily: "signika-bold" },
          headerShown: false,
          headerStyle: { backgroundColor: "#251934" },
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
              }}
            >
              <MaterialCommunityIcons
                name="plus-circle-outline"
                style={{ color: focused ? "#4632A1" : "#fff" }}
                size={30}
              />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesTab}
        options={{
          headerTitleStyle: { fontFamily: "signika-bold" },
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 15,
              }}
            >
              <MaterialCommunityIcons
                name="chat"
                style={{ color: focused ? "#4632A1" : "#fff" }}
                size={30}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}