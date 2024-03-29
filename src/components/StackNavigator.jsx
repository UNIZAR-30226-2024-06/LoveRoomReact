import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './BottomTab';
import NotRegisteredScreen from '../screens/NotRegisteredScreen';
import RegisterScreen from '../screens/RegisterScreen';
<<<<<<< Updated upstream
import ChangePasswdScreen from '../screens/ChangePasswdScreen';
import ChangePasswd2Screen from '../screens/ChangePasswd2Screen';
=======
import { useWindowDimensions } from 'react-native';
import Drawer from './Drawer';
>>>>>>> Stashed changes

const Stack = createStackNavigator();

export default function StackNavigator() {
<<<<<<< Updated upstream
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
=======
    const dimensions = useWindowDimensions();
    const isLandscape = dimensions.width > dimensions.height;

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Account" component={isLandscape ? Drawer : BottomTab} options={{ headerShown: false }}/>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="NotRegistered" component={NotRegisteredScreen} />
            </Stack.Navigator>
        </NavigationContainer>
      );
}
>>>>>>> Stashed changes
