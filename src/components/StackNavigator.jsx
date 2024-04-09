import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './BottomTab';
import NotRegisteredScreen from '../screens/NotRegisteredScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChangePasswdScreen from '../screens/ChangePasswdScreen';
import GetCodeScreen from '../screens/GetCodeScreen';
import { useWindowDimensions } from 'react-native';
import GetEmailScreen from '../screens/GetEmailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import RegisterPreferencesScreen from '../screens/RegisterPreferencesScreen';
import UserGuidelinesScreen from '../screens/UserGuidelinesScreen';
import VideoScreen from '../screens/VideoScreen';
import FAQScreen from '../screens/FAQScreen';

const Stack = createStackNavigator();

export default function StackNavigator() {
  const dimensions = useWindowDimensions();
  const isLandscape = dimensions.width > dimensions.height;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Account" component={BottomTab} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="RegisterPreferences"
          component={RegisterPreferencesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UserGuidelines"
          component={UserGuidelinesScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NotRegistered"
          component={NotRegisteredScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswdScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="GetCode" component={GetCodeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GetEmail" component={GetEmailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Video" component={VideoScreen} />
        <Stack.Screen name="FAQ" component={FAQScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
