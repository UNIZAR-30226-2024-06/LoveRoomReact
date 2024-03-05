import React from 'react';
import { SafeAreaView, Text, StyleSheet, Platform } from 'react-native';

export default function SafeArea() {
  const handlePress = () => console.log('Texto presionado');
  return (
    <SafeAreaView style={styles.container}>
      <Text onPress={handlePress}> Prueba de G</Text>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1, //Vista flexible, se adapta horiontal y verticalmente para rellenar el espacio disponible
      backgroundColor: 'dodgerblue',
      paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, //En Android el SafeAreaView no funciona, con esto lo ajustamos el tope
    },
  }
)