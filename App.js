import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
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
import Friends from "./screens/Fridens";
import NewPost from "./screens/NewPost";
import SinglePost from "./screens/SinglePost";
import MyPosts from "./screens/MyPosts";
import EditProfile from "./screens/EditProfile";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Message" component={Message} />
            <Stack.Screen name="Friends" component={Friends} />
            <Stack.Screen name="NewPost" component={NewPost} />
            <Stack.Screen name="SinglePost" component={SinglePost} />
            <Stack.Screen name="MyPosts" component={MyPosts} />
            <Stack.Screen
              name="NewConversation"
              component={StartConversation}
            />
            <Stack.Screen name="EditProfile" component={EditProfile} />
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
