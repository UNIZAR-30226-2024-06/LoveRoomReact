import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import NotRegisteredScreen from './NotRegisteredScreen';
import AuthContext from '../components/AuthContext';
import SearchBar from '../components/SearchBarYt';
import BannedScreen from './BannedScreen';

export default function HomeScreen({ navigation }) {
  const { authState } = React.useContext(AuthContext);
  console.log("HOMESCREEN AUTHSTATE: ", authState);

  if (!authState.isLoggedIn) {
    return <NotRegisteredScreen />;
  }

  // if (authState.tipousuario === 'administrador') {
  //   navigation.navigate("Account", {screen : 'Admin'});
  // }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.TextBienvenida}> ¡Hola de nuevo, {authState.nombre}! </Text>
      <SearchBar setVideoUrl={null} useModal={true} />
    </View>
  );
}

const styles = StyleSheet.create({
  TextBienvenida: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20
  },
  Video: {
    marginVertical: 20,
    height: '100%',
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
