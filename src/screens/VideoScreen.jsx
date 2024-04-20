// VideoScreen.jsx
import React, {useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe'
import Socket from '../components/Socket';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { socketEvents } from '../constants/SocketConstants';

const VideoScreen = ({ route }) => {
  const { videoId } = route.params;
  const navigation = useNavigation();
  const [senderId, setSenderId] = useState('');
  const [idVideo, setIdVideo] = useState(videoId);
  const [receiverId, setReceiverId] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

  
  useEffect(() => {
    // Función para conectar al socket
    const connectToSocket = async () => {
      await Socket.connect();
      await Socket.waitForMatch(setSenderId, setReceiverId, setIdVideo, setIsPlaying);
    };

    // Llamar a la función para conectar al socket
    connectToSocket();
  }, []);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      Socket.disconnect();
    });

    // Devuelve una función de limpieza para ejecutar al desmontar el componente
    return unsubscribe;
  }, [navigation]);

  const handleStateChange = (event) => { 
    if (event === 'playing') {
      console.log('playing');
      setIsPlaying(true);
      Socket.socket.emit(socketEvents.PLAY, senderId);
      console.log('Play event emitted');
      
    } else if (event === 'paused') {
      console.log('paused');
      setIsPlaying(false);
      Socket.socket.emit(socketEvents.PAUSE, senderId);
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
    <View style={{flex : 1, alignItems:'center'}}>
        <YoutubePlayer videoId={idVideo} height={'46%'} width={'95%'} webViewStyle={styles.Video} play={isPlaying} onChangeState={handleStateChange}/>
        <Text>Sender: {senderId}</Text>
        <Text>Receiver: {receiverId}</Text>
        <Text>Video: {idVideo}</Text>
      </View>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
    Video: {
        padding: 10,
        marginTop: 20,
        
    }
    }); 
