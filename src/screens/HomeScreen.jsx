import React, { useEffect, useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import NotRegisteredScreen from './NotRegisteredScreen';
import AuthContext from '../components/AuthContext';
import YouTubeIframe from 'react-native-youtube-iframe';
import SearchBar from '../components/SearchBarYt';
import { StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  const { authState } = React.useContext(AuthContext);

  if (!authState.isLoggedIn) {
    return <NotRegisteredScreen />;
  }

  // if (authState.tipousuario === 'administrador') {
  //   navigation.navigate('Admin');
  // }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.TextBienvenida}> ¡Hola de nuevo, {authState.nombre}! </Text>
      <SearchBar setVideoUrl={null} />
      {/* <View style={styles.interrogationContainer}>
        <Image source={require('../img/camara.png')} style={[styles.interrogationImage, { tintColor: 'gray' }]} />
        <Text style={styles.centeredText}>
          ¡Busca tus vídeos favoritos,
          {'\n'}
          y conoce gente con los mismos gustos que tú!
        </Text>
      </View> */}
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
  },
  interrogationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  interrogationImage: {
    width: 100,
    height: 100
  },
  centeredText: {
    textAlign: 'center',
    color: 'gray'
  }
});
