import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
// import MatchesScreen from '../screens/MatchesScreen';
// import RoomsScreen from '../screens/RoomsScreen';
// import AccountScreen from '../screens/AccountScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Image } from 'react-native';
import AuthContext from './AuthContext';

const Tab = createBottomTabNavigator();

export default function BottomTab({ initialScreen }) {
  const { authState, setAuthState } = React.useContext(AuthContext);

  const ImageProfile = (size, color) => {
    if (authState.isLoggedIn) {
      return (
        <Image source={require('../img/perfil-vacio.png')} style={{ width: size, height: size, tintColor: color }} />
      );
    } else {
      return (
        <Image source={require('../img/circulo-cruzado.png')} style={{ width: size, height: size, tintColor: color }} />
      );
    }
  };

  return (
    <Tab.Navigator
      initialRouteName={initialScreen}
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
          headerTitleAlign: 'center',
          headerTitle: () => (
            <Image source={require('../img/logo.png')} style={{ width: 200, height: 32, backgroundColor: '#F89F9F' }} />
          ),
          headerStyle: {
            backgroundColor: '#F89F9F',
          },
          headerShadowVisible: false,
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
          headerTitleAlign: 'center',
          headerTitle: () => (
            <Image source={require('../img/logo.png')} style={{ width: 200, height: 32, backgroundColor: '#F89F9F' }} />
          ),
          headerStyle: {
            backgroundColor: '#F89F9F',
          },
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen
        name="Cuenta"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) =>
            ImageProfile(size, color),
            //PEDIR IMAGEN A BACKEND
          headerTitle: () => (
            <Image source={require('../img/logo.png')} style={{ width: 200, height: 32, backgroundColor: '#F89F9F' }} />
          ),
          headerStyle: {
            backgroundColor: '#F89F9F',
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
    </Tab.Navigator>
  );
}
