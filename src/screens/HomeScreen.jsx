import React from 'react';
import { View, Button, Text } from 'react-native';
import NotRegisteredScreen from './NotRegisteredScreen';
import AuthContext from '../components/AuthContext';
import YouTubeIframe from 'react-native-youtube-iframe';
import YoutubeSearch from '../components/YoutubeSearch';
import { StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  const { authState } = React.useContext(AuthContext);

  // if (!authState.isLoggedIn) {
  //   return <NotRegisteredScreen />;
  // }
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text style={styles.TextBienvenida}> ¡Bienvenido de nuevo, {authState.nombre}! </Text>
      <View style={styles.Video}>
        <YouTubeIframe videoId={'TQtT9QgWjIY'} height={220} width={'100%'} style={styles.Video} />
      </View>
      {/* <YoutubeSearch /> */}
      {/* <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  TextBienvenida: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 20,
  },
  Video: {
    marginVertical: 20,
    height: '100%',
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
