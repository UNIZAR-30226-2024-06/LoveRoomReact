import React, {useEffect, useState} from 'react';
import { View, Button, Text } from 'react-native';
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
  
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.TextBienvenida}> ¡Hola de nuevo, {authState.nombre}! </Text>
      <SearchBar setVideoUrl={null} />
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
