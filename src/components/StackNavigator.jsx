import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './BottomTab';
import NotRegisteredScreen from '../screens/NotRegisteredScreen';

const Stack = createStackNavigator();

export default function StackNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Account" component={BottomTab} options={{ headerShown: false }}/>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="NotRegistered" component={NotRegisteredScreen} />
            </Stack.Navigator>
        </NavigationContainer>
      );
}