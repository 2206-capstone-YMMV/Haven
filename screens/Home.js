import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Map from "./Map";
import Profile from "./Profile";
import Posts from "./Posts";
import MessagesTab from "./MessagesTab";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

export default function Home() {
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

// tabBarIcon: ({ focused, color, size }) => {
//           let iconName;
//           let rn = route.name;
//           if (rn === "Map") {
//             iconName = focused ? (
//               <MaterialCommunityIcons name="home" color={color} size={26} />
//             ) : (
//               <MaterialCommunityIcons name="home" color={color} size={26} />
//             );
//           } else if (rn === "Posts") {
//             iconName = focused ? (
//               <MaterialCommunityIcons
//                 name="plus-circle-outline"
//                 color={color}
//                 size={26}
//               />
//             ) : (
//               <MaterialCommunityIcons
//                 name="plus-circle-outline"
//                 color={color}
//                 size={26}
//               />
//             );
//           } else if (rn === "Profile") {
//             iconName = focused ? (
//               <MaterialCommunityIcons
//                 name="account-circle"
//                 color={color}
//                 size={26}
//               />
//             ) : (
//               <MaterialCommunityIcons
//                 name="account-circle"
//                 color={color}
//                 size={26}
//               />
//             );
//           } else if (rn === "Messages") {
//             iconName = focused ? (
//               <MaterialCommunityIcons name="chat" color={color} size={26} />
//             ) : (
//               <MaterialCommunityIcons name="chat" color={color} size={26} />
//             );
//           }
//           return <Text>{iconName}</Text>;
//         },
//       })}
