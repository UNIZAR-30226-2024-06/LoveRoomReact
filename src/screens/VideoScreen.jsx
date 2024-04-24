// VideoScreen.jsx
import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import AuthContext from '../components/AuthContext';
import { useEffect } from 'react';
import { socketEvents } from '../constants/SocketConstants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const VideoScreen = ({ route }) => {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const { socketState, setSocketState } = useContext(AuthContext);
  useEffect(() => {
    setSocketState((prevState) => ({ ...prevState, senderId: authState.id }));
  }, []);

  useEffect(() => {
    if (socketState.socket != null && socketState.socket.connected == true) {
      console.log('Eventos de socket');
      // socketState.socket.on(socketEvents.MATCH, (senderId,receiverId, videoId) => {
      //     console.log('Match event received: ', receiverId, senderId, videoId);
      //     setSocketState((prevState) => ({ ...prevState, senderId: senderId, receiverId: receiverId, idVideo: videoId }));
      //     setShowModal(false);
      // });

      socketState.socket.on(socketEvents.PAUSE, (senderId) => {
        console.log('Pause event received: ', senderId);
        setSocketState((prevState) => ({ ...prevState, isPlaying: false }));
        console.log(false);
      });

      socketState.socket.on(socketEvents.PLAY, (senderId) => {
        console.log('Play event received: ', senderId);
        setSocketState((prevState) => ({ ...prevState, isPlaying: true }));
        console.log(true);
      });
    }
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      socketState.socket.disconnect();
      console.log('Socket disconnected');
    });

    // Devuelve una función de limpieza para ejecutar al desmontar el componente
    return unsubscribe;
  }, [navigation]);

  const handleStateChange = (event) => {
    if (event === 'playing') {
      console.log('playing');
      setSocketState((prevState) => ({ ...prevState, isPlaying: true }));
      socketState.socket.emit(socketEvents.PLAY, socketState.senderId);
      console.log('Play event emitted');
    } else if (event === 'paused') {
      console.log('paused');
      setSocketState((prevState) => ({ ...prevState, isPlaying: false }));
      socketState.socket.emit(socketEvents.PAUSE, socketState.senderId);
      console.log('Pause event emitted');
    }
  };

  // if(Socket.socket !== null){
  //   console.log('Socket not null');
  //   Socket.socket.on(socketEvents.PAUSE, (receiverId) => {
  //     console.log('Pause event received: ', receiverId);
  //     setIsPlaying(false);
  //   });
  // }
  // if(Socket.socket != null){
  //   console.log('Socket not null');
  //   Socket.socket.on(socketEvents.PLAY, (receiverId) => {
  //     console.log('Play event received: ', receiverId);
  //     setIsPlaying(true);
  //   });
  // }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <YoutubePlayer
        videoId={socketState.idVideo}
        height={'46%'}
        width={'95%'}
        webViewStyle={styles.Video}
        play={socketState.isPlaying}
        onChangeState={handleStateChange}
      />
      <Text>Sender: {socketState.senderId}</Text>
      <Text>Receiver: {socketState.receiverId}</Text>
      <Text>Video: {socketState.idVideo}</Text>
      <TouchableOpacity
        onPress={() => {
          console.log('videoScreen socketSTate');
          console.log(socketState);
          console.log('videoScreen socketState.socket');
          console.log(socketState.socket);
          console.log('videoScreen authState');
          console.log(authState);
        }}
      >
        <Text>Console log</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  Video: {
    padding: 10,
    marginTop: 20
  }
});
