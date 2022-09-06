import { StatusBar } from "expo-status-bar";
import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, Text, View, Animated, Easing, LogBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { store } from "./redux/index";

import Home from "./screens/Home";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import Message from "./screens/Message";
import StartConversation from "./screens/StartConversation";
import Friends from "./screens/Friends";
import NewPost from "./screens/NewPost";
import SinglePost from "./screens/SinglePost";
import MyPosts from "./screens/MyPosts";
import EditProfile from "./screens/EditProfile";
import FriendsView from "./screens/FriendsView";
import FriendPost from "./screens/FriendPost";
import ReportScreen from "./screens/ReportScreen";
import UpdatePost from "./screens/UpdatePost";

import AnimatedSplash from "react-native-animated-splash-screen";

const Stack = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreAllLogs()
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Message"
              component={Message}
              options={{
                title: "Message",
                headerBackTitle: "",
                headerTitleStyle: {
                  color: "#fff",
                  fontFamily: "signika-bold",
                },
                headerStyle: { backgroundColor: "#251934" },
              }}
            />
            <Stack.Screen
              name="Friends"
              component={Friends}
              options={{
                title: "Friends",
                headerBackTitle: "",
                headerTitleStyle: {
                  color: "#fff",
                  fontFamily: "signika-bold",
                },
                headerStyle: { backgroundColor: "#251934" },
              }}
            />
            <Stack.Screen
              name="NewPost"
              component={NewPost}
              options={{
                title: "New Post",
                headerBackTitle: "",
                headerTitleStyle: {
                  color: "#fff",
                  fontFamily: "signika-bold",
                },
                headerStyle: { backgroundColor: "#251934" },
              }}
            />
            <Stack.Screen
              name="SinglePost"
              component={SinglePost}
              options={{
                title: "Post",
                headerBackTitle: "",
                headerTitleStyle: {
                  color: "#fff",
                  fontFamily: "signika-bold",
                },
                headerStyle: { backgroundColor: "#251934" },
              }}
            />
            <Stack.Screen
              name="MyPosts"
              component={MyPosts}
              options={{
                title: "My Posts",
                headerBackTitle: "",
                headerTitleStyle: {
                  color: "#fff",
                  fontFamily: "signika-bold",
                },
                headerStyle: { backgroundColor: "#251934" },
              }}
            />
            <Stack.Screen name="FriendPost" component={FriendPost} />
            <Stack.Screen name="UpdatePost" component={UpdatePost} />
            <Stack.Screen
              name="FriendsView"
              component={FriendsView}
              options={{
                title: "Edit Friends",
                headerBackTitle: "",
                headerTitleStyle: {
                  color: "#fff",
                  fontFamily: "signika-bold",
                },
                headerStyle: { backgroundColor: "#251934" },
              }}
            />
            <Stack.Screen
              name="NewConversation"
              component={StartConversation}
              options={{
                title: "New message",
                headerBackTitle: "",
                headerTitleStyle: {
                  color: "#fff",
                  fontFamily: "signika-bold",
                },
                headerStyle: { backgroundColor: "#251934" },
              }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfile}
              options={{
                title: "Edit Profile",
                headerBackTitle: "",
                headerTitleStyle: {
                  color: "#fff",
                  fontFamily: "signika-bold",
                },
                headerStyle: { backgroundColor: "#251934" },
              }}
            />
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}
