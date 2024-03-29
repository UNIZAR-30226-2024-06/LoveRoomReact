import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './BottomTab';
import NotRegisteredScreen from '../screens/NotRegisteredScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ChangePasswdScreen from '../screens/ChangePasswdScreen';
import ChangePasswd2Screen from '../screens/ChangePasswd2Screen';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Account" component={BottomTab} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NotRegistered" component={NotRegisteredScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword" component={ChangePasswdScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChangePassword2" component={ChangePasswd2Screen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
