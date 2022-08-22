import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './screens/Home'
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import NewPost from './screens/NewPost';
import CameraTake from './components/CameraTake';
import SinglePost from './screens/SinglePost';
import { Provider } from 'react-redux';
import { store } from './redux';
const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <SafeAreaProvider>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={LoginScreen}  />
            <Stack.Screen name="SignUp" component={SignUpScreen} options={{ title: 'Sign Up' }}/>
            <Stack.Screen name="NewPost" component={NewPost}  />
            <Stack.Screen name="CameraTake" component={CameraTake}  />
            <Stack.Screen name="SinglePost" component={SinglePost}  />
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});