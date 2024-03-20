import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
// import MatchesScreen from '../screens/MatchesScreen';
// import RoomsScreen from '../screens/RoomsScreen';
// import AccountScreen from '../screens/AccountScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Image } from 'react-native';

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
      <Tab.Navigator initialRouteName="Home" screenOptions={{
        "tabBarActiveTintColor": 'black', 
      }}>
        <Tab.Screen 
        name="Inicio" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image
              source={require('../img/HomeTab.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}
      />
        <Tab.Screen name="Mis salas" component={SettingsScreen} 
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../img/video-camara-alt.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
        }}/>
        <Tab.Screen 
          name="Cuenta" 
          component={SettingsScreen} 
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <Image
                source={require('../img/MisSalasTab.png')}
                style={{ width: 25, height: 18, tintColor: color }}
              />
            ),
          }}
        />
      </Tab.Navigator>
  );
}