// VideoScreen.jsx
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Button, Modal } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import AuthContext from '../components/AuthContext';
import { useEffect } from 'react';
import { socketEvents } from '../constants/SocketConstants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import ChatMessage from '../components/ChatMessage';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import { Dimensions } from 'react-native';

const Video = () => {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const { socketState, setSocketState } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { showActionSheetWithOptions } = useActionSheet();

  const screenHeight = Dimensions.get('window').height;

  const showMediaOptions = () => {
    console.log('showMediaOptions');
    const options = ['Photo', 'Video'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          handleImagePicker('photo');
        } else if (buttonIndex === 1) {
          handleImagePicker('video');
        }
      }
    );
  };

  useEffect(() => {
    setSocketState((prevState) => ({ ...prevState, senderId: authState.id }));
  }, []);

  const handleImagePicker = async (mediaType) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          mediaType === 'photo'
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos
      });

      console.log(result);

      if (!result.cancelled) {
        // Handle the selected image or video
        console.log(result.uri);
      }
    }
  };

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

      return () => {
        socketState.socket.off(socketEvents.PAUSE, handlePause);
        socketState.socket.off(socketEvents.PLAY, handlePlay);
        socketState.socket.off(socketEvents.SEND_MESSAGE, handleMessage);
      };
    }
  }, []);

  const sendMessage = () => {
    if (socketState.socket != null && socketState.socket.connected == true && newMessage != '') {
      const data = {
        senderId: parseInt(socketState.senderId, 10),
        receiverId: parseInt(socketState.receiverId, 10),
        message: newMessage,
        timestamp: Date.now()
      };
      console.log('Enviando mensaje: ', data);

      socketState.socket.emit(socketEvents.CREATE_MESSAGE, data, (response) => {
        console.log('Mensaje enviado: ', response);
      });
      setMessages((prevState) => [...prevState, data]);
      setNewMessage('');
    }
  };

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
    <View style={{ flex: 1, padding: 10 }}>
      <View style={{ flex: 0.85, alignItems: 'center', height: screenHeight * 0.5 }}>
        <YoutubePlayer
          videoId={socketState.idVideo}
          height={'100%'}
          width={'95%'}
          webViewStyle={styles.Video}
          play={socketState.isPlaying}
          onChangeState={handleStateChange}
        />
      </View>
      {/* <Text>Sender: {socketState.senderId}</Text>
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
      </TouchableOpacity> */}
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.timestamp}
          renderItem={({ item }) => <ChatMessage data={item} />}
          ref={(ref) => (this.flatList = ref)}
          onContentSizeChange={() => this.flatList.scrollToEnd({ animated: true })}
        />
      </View>
      <View style={styles.inputContainer}>
        <Icon name="more-vertical" type="feather" onPress={showMediaOptions} />
        <TextInput
          style={styles.input}
          onChangeText={setNewMessage}
          value={newMessage}
          placeholder="Escribe un mensaje..."
        />
        <Icon name="send" type="feather" onPress={sendMessage} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Video: {
    padding: 10
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10
  },
  input: {
    flex: 1,
    marginRight: 15,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20
  }
});

const VideoScreen = () => {
  return (
    <ActionSheetProvider>
      <Video />
    </ActionSheetProvider>
  );
};

export default VideoScreen;
