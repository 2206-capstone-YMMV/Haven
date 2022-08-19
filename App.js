import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Home from './screens/Home'
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
       <SafeAreaProvider>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen}  />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
      </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
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