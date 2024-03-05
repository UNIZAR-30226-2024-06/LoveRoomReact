import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/components/HomeScreen';
import SettingsScreen from './src/components/SettingsScreen';
import { TouchableOpacity, Text, View, StyleSheet, Image, StatusBar, Platform, Button, SafeAreaView, Dimensions} from 'react-native';
//SafeAreaView se puede usar para ajustar el contenido en el dispositivo, es decir, para que en iOS el Notch no nos tape el contenido ( mete un poco de padding automaticamente en el top).
//Con console.log(Dimensions.get('screen')) podemos ver las dimensiones de la pantalla del dispositivo para ajustar widths, heights, etc.
const Drawer = createDrawerNavigator();

export default function App() {
  const handlePress = () => console.log('Texto presionado');
  const register = () => (
    <TouchableOpacity style={styles.button} onPress={() => alert('This is a button!')}>
      <Text style={styles.text}>Usuario</Text>
    </TouchableOpacity>
  );
  return (
    <View style={{flex: 1}}>
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
      <SafeAreaView style={styles.container}>
      <Text onPress={handlePress}> Prueba de G</Text>
      </SafeAreaView>
    </View>
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
  container: {
    flex: 1, //Vista flexible, se adapta horiontal y verticalmente para rellenar el espacio disponible
    backgroundColor: 'dodgerblue',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, //En Android el SafeAreaView no funciona, con esto lo ajustamos el tope
  },
});
