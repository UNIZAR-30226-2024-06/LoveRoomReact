import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
// import MatchesScreen from '../screens/MatchesScreen';
// import RoomsScreen from '../screens/RoomsScreen';
// import AccountScreen from '../screens/AccountScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Image } from 'react-native';


const Tab = createBottomTabNavigator();

export default function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: 'black',
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Image source={require('../img/HomeTab.png')} style={{ width: size, height: size, tintColor: color }} />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Mis salas"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={require('../img/video-camara-alt.png')}
              style={{ width: size, height: size, tintColor: color }}
            />
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Cuenta"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Image source={require('../img/MisSalasTab.png')} style={{ width: 25, height: 18, tintColor: color }} />
            //PEDIR IMAGEN A BACKEND
          ),
          headerTitle: () => (
            <Image source={require('../img/logo.png')} style={{ width: 200, height: 32, backgroundColor: '#F89F9F' }} /> 
          ),
          headerStyle: {
            backgroundColor: '#F89F9F',
          },
        }}
      />
    </Tab.Navigator>
  );
}
