import * as React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Map from './Map'
import Profile from './Profile'
import Posts from './Posts'
import Chat from './Chat'


const Tab = createBottomTabNavigator();

export default function Home(){
    return (
            <Tab.Navigator 
            initialRouteName="Map"
            screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                    let iconName
                    let rn = route.name
                    if (rn === "Map"){
                        iconName = focused ?  <MaterialCommunityIcons name="home" color={color} size={26} />:  <MaterialCommunityIcons name="home" color={color} size={26} />
                       
                    }
                    else if (rn === "Posts"){
                        iconName = focused ?  <MaterialCommunityIcons name="plus-circle-outline" color={color} size={26} /> : <MaterialCommunityIcons name="plus-circle-outline" color={color} size={26} />
                    }
                    else if (rn === "Profile"){
                        iconName = focused ? <MaterialCommunityIcons name="account-circle" color={color} size={26} /> : <MaterialCommunityIcons name="account-circle" color={color} size={26} />
                    }
                    else if (rn === "Chat"){
                        iconName = focused ?  <MaterialCommunityIcons name="chat" color={color} size={26} />  : <MaterialCommunityIcons name="chat" color={color} size={26} />
                    }
                    return <Text>{iconName}</Text>
                },
            })}>
                <Tab.Screen name="Map" component={Map}/>
                <Tab.Screen name="Profile" component={Profile}/>
                <Tab.Screen name="Posts" component={Posts}/>
                <Tab.Screen name="Chat" component={Chat}/>
            </Tab.Navigator>
    )
}