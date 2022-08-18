import * as React from "react";
import { NavigationContainer } from '@react-navigation/native'
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Map from './Map'
import Profile from './Profile'
import Posts from './Posts'

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
                        iconName = focused ? 'home' : 'home-outline'
                    }
                    else if (rn === "Posts"){
                        iconName = focused ? 'Posts' : 'Posts-outline'
                    }
                    else if (rn === "Profile"){
                        iconName = focused ? 'Profile' : 'Profile-outline'
                    }
                    return <Text>{iconName}</Text>
                },
            })}>
                <Tab.Screen name="Map" component={Map}/>
                <Tab.Screen name="Profile" component={Profile}/>
                <Tab.Screen name="Posts" component={Posts}/>
            </Tab.Navigator>
    )
}