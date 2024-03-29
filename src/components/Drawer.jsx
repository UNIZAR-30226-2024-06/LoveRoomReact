import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import { Image } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";

const Drawer = createDrawerNavigator();

export default function DrawerComp() {
    return (
        <Drawer.Navigator>
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
        <Drawer.Screen name="Mis salas" component={SettingsScreen} 
        options={{
          drawerIcon: ({ color, size }) => (
            <Image
              source={require('../img/video-camara-alt.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}/>
        <Drawer.Screen name="Cuenta" component={SettingsScreen} 
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