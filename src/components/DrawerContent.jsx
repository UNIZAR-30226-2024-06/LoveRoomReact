import React from 'react';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();

export default function DrawerContent() {
    const register = () => (
        <TouchableOpacity style={styles.button} onPress={() => alert('This is a button!')}>
          <Text style={styles.text}>Usuario</Text>
        </TouchableOpacity>
      );
  return (
    <NavigationContainer >
        <Drawer.Navigator initialRouteName="Home" screenOptions={{
          headerRight: () => register(),
          title: 'LoveRoom',
          headerTitleAlign: 'center',
        }} >
          <Drawer.Screen name="Home" component={HomeScreen} options={{
            // Este será el título en la barra de estado
            drawerLabel: 'Inicio', // Este será el título en el Drawer
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },}}
          initialParams={{title : 'Estamos en home'}} />
          <Drawer.Screen name="Settings" component={SettingsScreen} options={{
            drawerLabel: 'Ajustes',
              headerStyle: {
                backgroundColor: '#f4511e',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}
            initialParams={{title : 'Estamos en ajustes'}} />
        </Drawer.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    padding: 10,
  },
  text: {
    fontSize: 16,
    color: '#fff', 
  },
});