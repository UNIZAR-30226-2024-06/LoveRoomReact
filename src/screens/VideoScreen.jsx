// VideoScreen.jsx
import React, { useContext, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  Button,
  Modal,
  Image,
  StatusBar
} from 'react-native';
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
import defaultProfilePicture from '../img/perfil-vacio.png';

const Video = () => {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const { socketState, setSocketState } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { showActionSheetWithOptions } = useActionSheet();
  const [user, setUser] = useState({});
  const statusBarHeight = StatusBar.currentHeight;
  const ignoreStateChange = useRef(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      socketState.socket.disconnect();
      setSocketState((prevState) => ({
        ...prevState,
        receiverId: '',
        idVideo: ''
      }));
      console.log('Socket disconnected');
    });

    // Devuelve una función de limpieza para ejecutar al desmontar el componente
    return unsubscribe;
  }, [navigation]);

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
    handleInfoReceiver();
  }, []);

  useEffect(() => {
    handleInfoReceiver();
    if(socketState.socket != null && socketState.socket.connected == true){
    }
  }, [socketState.receiverId]);

  useEffect(() => {
    console.log('ID de sala:', socketState.idSala);
    if(socketState.idSala != '' && socketState.idSala != null){
      console.log('Emitiendo evento JOIN_ROOM');
      socketState.socket.emit(socketEvents.JOIN_ROOM, socketState.idSala); // Necesario que idSala sea un string
    }
  }, [socketState.idSala]);

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

  const handlePause = () => {
    console.log('Pause event received by ', authState.id);
    ignoreStateChange.current = true;
    setVideoPlaying(false);
  };

  const handlePlay = () => {
    console.log('Play event received by ', authState.id);
    ignoreStateChange.current = true;
    setVideoPlaying(true);
  };

  const handleMessage = (senderId, texto, multimedia) => {
    console.log('Mensaje recibido: ', senderId);
    setMessages((prevState) => [...prevState, data]);
  };

  useEffect(() => {
    if (socketState.socket != null) {
      console.log('Eventos de socket');


      // Para que al reconectarse al socket se vuelva a hacer JOIN_ROOM
      socketState.socket.on('connect', () => {
        socketState.socket.on(socketEvents.CHECK_ROOM, () => {
          console.log('CHECK_ROOM event received by ', authState.id);
          if (socketState.idSala != null && socketState.idSala != '') {
            // Si estabamos en una sala, al reconectarnos al socket volvemos a hacer JOIN_ROOM
            console.log('Emitiendo evento JOIN_ROOM');
            socketState.socket.emit(socketEvents.JOIN_ROOM, socketState.idSala);
          } else {
            // Aqui se deberia volver a la pantalla de búsqueda ya que el usuario ya no va a poder hacer match
            alert('Te has desconectado del vídeo.\n Si quieres hacer match debes salir y volver a entrar.')
            //navigation.navigate('Search');???
          }
        });
      });

      socketState.socket.on(socketEvents.PAUSE, handlePause);
      socketState.socket.on(socketEvents.PLAY, handlePlay);
      socketState.socket.on(socketEvents.RECEIVE_MESSAGE, (senderID, texto, rutamultimedia) => {
        // Esta es la función que se ejecutará cuando se reciba el evento RECEIVE_MESSAGE
        // Aquí puedes hacer algo con senderID, texto, y rutamultimedia
        console.log('Mensaje recibido de: ', senderID);
        console.log('Texto del mensaje: ', texto);
        console.log('Ruta multimedia: ', rutamultimedia);
      });

      return () => {
        console.log('Desmontando eventos de socket');
        socketState.socket.off(socketEvents.PAUSE, handlePause);
        socketState.socket.off(socketEvents.PLAY, handlePlay);
        socketState.socket.off(socketEvents.SEND_MESSAGE, handleMessage);
      };
    } else {
      console.log('Socket = null');
    }
  }, [socketState.socket]);

  const sendMessage = () => {
    if (socketState.socket != null && socketState.socket.connected == true && newMessage != '') {
      const data = {
        senderId: null,
        message: newMessage,
        timestamp: null
      };
      console.log('Enviando mensaje: ', data);
      const idsala = socketState.idSala;
      const texto = data.message;
      const rutamultimedia = null;
      const callback = (message, timestamp) => {
        console.log('Respuesta del servidor:', message);
        console.log('Timestamp:', timestamp);
        data.timestamp = timestamp;
        data.senderId = socketState.senderId;
        setMessages((prevState) => [...prevState, data]);
        setNewMessage('');
      };
      socketState.socket.emit(socketEvents.CREATE_MESSAGE, idsala, texto, rutamultimedia, callback);
    }
  };

  const handleInfoReceiver = () => {
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/user/${socketState.receiverId}`);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/${socketState.receiverId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setUser(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleStateChange = (event) => {
    if (event === 'playing') {
      if (ignoreStateChange.current) {
        ignoreStateChange.current = false;
        return;
      }
      console.log('Playing: videoPlaying ', videoPlaying); // Deberia ser false siempre
      setVideoPlaying(true);
      const callback = (message) => {
        console.log('Respuesta del servidor:', message);
      };
      socketState.socket.emit(socketEvents.PLAY, socketState.idSala, callback);
      // console.log('Play event emitted by ', authState.id);
    } else if (event === 'paused') {
      if (ignoreStateChange.current) {
        ignoreStateChange.current = false;
        return;
      }
      const callback = (message) => {
        console.log('Respuesta del servidor:', message);
      };
      console.log('Paused: videoPlaying ', videoPlaying); // Deberia ser true siempre
      setVideoPlaying(false);
      socketState.socket.emit(socketEvents.PAUSE, socketState.idSala, callback);
      //console.log('Pause event emitted by ', authState.id);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {socketState.receiverId != '' && (
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', padding: 15 }}
          onPress={() => {
            navigation.navigate('OtherProfile', { user: user });
          }}
        >
          <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
            <Image
              source={
                user.fotoperfil === 'null.jpg' ? defaultProfilePicture : { uri: user.fotoperfil }
              }
              style={{ width: 50, height: 50 }}
            />
            <Text style={{ padding: 15 }}>
              {user.nombre}, Edad: {user.edad}
            </Text>
          </View>
          <Text style={{ padding: 5 }}>Ver perfil</Text>
          <Icon name="chevron-right" size={25} color="#000" style={styles.arrowImage} />
        </TouchableOpacity>
      )}
      <View style={{ alignItems: 'center', flex: 1 }}>
        <YoutubePlayer
          videoId={socketState.idVideo}
          height={'100%'}
          width={'95%'}
          webViewStyle={styles.Video}
          play={videoPlaying}
          onChangeState={handleStateChange}
        />
      </View>
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
