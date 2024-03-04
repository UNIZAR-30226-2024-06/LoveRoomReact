import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/components/HomeScreen';
import SettingsScreen from './src/components/SettingsScreen';
import { Button } from 'react-native';


const Drawer = createDrawerNavigator();

export default function App() {
  const register = () => (
    <Button
      onPress={() => alert('This is a button!')}
      title="Info"
      color="#000"
    />
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
              textAlign: 'center',
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
