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
import Drawer from './Drawer';
import { useWindowDimensions } from 'react-native';

const Stack = createStackNavigator();

export default function StackNavigator() {
    const dimensions = useWindowDimensions();
    const isLandscape = dimensions.width > dimensions.height;

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Account" component={isLandscape ? Drawer : BottomTab} options={{ headerShown: false }}/>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="NotRegistered" component={NotRegisteredScreen} options={{ headerShown: false }}/>
                <Stack.Screen name="ChangePassword" component={ChangePasswdScreen} options={{ headerShown: false }} />
                <Stack.Screen name="ChangePassword2" component={ChangePasswd2Screen} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
      );
}
