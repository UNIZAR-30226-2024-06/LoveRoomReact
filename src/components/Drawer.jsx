import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { Image } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Drawer = createDrawerNavigator();

export default function DrawerComp({initialScreen}) {
    return (
        <Drawer.Navigator initialRouteName={initialScreen}>
        <Drawer.Screen name="Home" component={HomeScreen}
        options={{
            drawerIcon: ({color, size}) => (
                <Image
                source={require('../img/HomeTab.png')}
                style={{width: size, height: size, tintColor: color}}
                />
            ),
        }}
        />
        <Drawer.Screen name="Mis salas" component={ProfileScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Image
              source={require('../img/video-camara-alt.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}/>
        <Drawer.Screen name="Cuenta" component={ProfileScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Image
              source={require('../img/video-camara-alt.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}/>
        </Drawer.Navigator>
    );
    }