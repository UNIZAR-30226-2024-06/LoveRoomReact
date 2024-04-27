// VideoScreen.jsx
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import AuthContext from '../components/AuthContext';
import { useEffect } from 'react';
import { socketEvents } from '../constants/SocketConstants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import ChatMessage from '../components/ChatMessage';

const VideoScreen = ({ route }) => {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const { socketState, setSocketState } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  useEffect(() => {
    setSocketState((prevState) => ({ ...prevState, senderId: authState.id }));
  }, []);

  const handlePause = (receiverId) => {
    console.log('Pause event received: ', receiverId);
    setSocketState((prevState) => ({ ...prevState, isPlaying: false }));
    console.log(false);
  };

  const handlePlay = (receiverId) => {
    console.log('Play event received: ', receiverId);
    setSocketState((prevState) => ({ ...prevState, isPlaying: true }));
    console.log(true);
  };

  const handleMessage = (data) => {
    console.log('Mensaje recibido: ', data);
    setMessages((prevState) => [...prevState, data]);
  };

  useEffect(() => {
    if (socketState.socket != null) {
      console.log('Eventos de socket');
  
      socketState.socket.on(socketEvents.PAUSE, handlePause);
      socketState.socket.on(socketEvents.PLAY, handlePlay);
      socketState.socket.on(socketEvents.SEND_MESSAGE, handleMessage);
  
      // Devuelve una función de limpieza para ejecutar al desmontar el componente
      return () => {
        socketState.socket.off(socketEvents.PAUSE, handlePause);
        socketState.socket.off(socketEvents.PLAY, handlePlay);
        socketState.socket.off(socketEvents.SEND_MESSAGE, handleMessage);
      };
    }
  }, [socketState.socket]);

  const sendMessage = () => {
    if (socketState.socket != null && socketState.socket.connected == true) {
      const data = {
        senderId: parseInt(socketState.senderId, 10),
        receiverId: parseInt(socketState.receiverId, 10),
        message: newMessage,
        timestamp: Date.now()
      };
      console.log('Enviando mensaje: ', data);

      socketState.socket.emit(socketEvents.CREATE_MESSAGE, data);
      setNewMessage('');
    }
  }

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
      socketState.socket.emit(socketEvents.PLAY, socketState.receiverId);
      console.log('Play event emitted');
    } else if (event === 'paused') {
      console.log('paused');
      setSocketState((prevState) => ({ ...prevState, isPlaying: false }));
      socketState.socket.emit(socketEvents.PAUSE, socketState.receiverId);
      console.log('Pause event emitted');
    }
  };

  return (
    <View style={{ flex: 1, padding: 10}}>
      <View style={{ flex: 1, alignItems: 'center', maxHeight: '80%'}}>
      <YoutubePlayer
        videoId={socketState.idVideo}
        height={'100%'}
        width={'95%'}
        webViewStyle={styles.Video}
        play={socketState.isPlaying}
        onChangeState={handleStateChange}
      />
      </View>
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
          console.log(messages);
        }}
      >
        <Text>Console log</Text>
      </TouchableOpacity>
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.timestamp}
          renderItem={({ item }) => (
            <ChatMessage  data={item} />
          )}
          ref={ref => this.flatList = ref}
          onContentSizeChange={() => this.flatList.scrollToEnd({animated: true})}
        />
      </View>
      <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setNewMessage}
            value={newMessage}
            placeholder="Escribe un mensaje..."
          />
          <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
  Video: {
    padding: 10,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
  },
});
