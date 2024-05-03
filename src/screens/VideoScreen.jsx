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
  StatusBar,
  Switch
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
import SearchBar from '../components/SearchBarYt';

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
  const [videoPlaying, setVideoPlaying] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      socketState.socket.emit(socketEvents.LEAVE_ROOM, socketState.idSala);
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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

  const handleSelectVideo =async(videoUrl) => {
    console.log('Video seleccionado en la seleccion:', videoUrl);
    setSelectedVideoUrl(videoUrl);
    setModalVisible(false);
  };
  

  const handleChangeVideo = () => {
    console.log('Video seleccionado:', selectedVideoUrl); 
    socketState.socket.emit(socketEvents.CHANGE_VIDEO, socketState.idSala, selectedVideoUrl, (message) => {
      console.log('Respuesta del servidor:', message);
      if(message){
        setSocketState((prevState) => ({
          ...prevState,
          idVideo: selectedVideoUrl
        }));
      }
    });
    setSelectedVideoUrl('');
  };
  
  useEffect(() => {
    if (selectedVideoUrl !== '') {
      handleChangeVideo();
    }
  }, [selectedVideoUrl]);


  useEffect(() => {
    console.log('Efecto ejecutado. receiverId:', socketState.receiverId);
    setIsEnabled(true);
    handleInfoReceiver();
    if (socketState.idSala != '' && socketState.idSala != null && socketState.socket != null && socketState.socket.connected == true) {
      console.log('Emitiendo evento JOIN_ROOM');
      socketState.socket.emit(socketEvents.JOIN_ROOM, socketState.idSala); // Necesario que idSala sea un string
    }
  }, []);

  useEffect(() => {
    console.log('Efecto ejecutado. receiverId:', socketState.receiverId);
    handleInfoReceiver();
  }, [socketState.receiverId]);

  useEffect(() => {
    console.log('ID de sala:', socketState.idSala);
    if (socketState.idSala != '' && socketState.idSala != null) {
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

  const [isEnabled, setIsEnabled] = useState(false);

  const toggleSwitch = () => {
    setIsEnabled(previousState => {
      if (previousState) {
        console.log('Sync off');
        socketState.socket.emit(socketEvents.SYNC_OFF, socketState.idSala, (boolean) => {
          if(boolean == false) {
            return previousState;
          }
        });
      } else {
        console.log('Sync on');
        socketState.socket.emit(socketEvents.SYNC_ON, socketState.idSala, (boolean) => {
          if(boolean == false) {
            return previousState;
          }
        });
      }
      
      return !previousState;
    });
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

  const handleMessage = (senderId, texto, rutamultimedia) => {
    console.log('Mensaje recibido de: ', senderId);
    console.log('Texto del mensaje: ', texto);
    console.log('Ruta multimedia: ', rutamultimedia);
    const data = {
      senderId: senderId,
      message: texto,
      timestamp: Date.now()
    };

    setMessages((prevState) => [...prevState, data]);
  };

  useEffect(() => {
    if (socketState.socket != null) {
      console.log('Eventos de socket');
  
      // Desuscribirse de los eventos anteriores
      socketState.socket.off(socketEvents.PAUSE, handlePause);
      socketState.socket.off(socketEvents.PLAY, handlePlay);
      socketState.socket.off(socketEvents.RECEIVE_MESSAGE, handleMessage);
      socketState.socket.off(socketEvents.SYNC_ON);
      socketState.socket.off(socketEvents.SYNC_OFF);
      socketState.socket.off(socketEvents.CHANGE_VIDEO);
  
      // Suscribirse a los nuevos eventos
      
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
      socketState.socket.on(socketEvents.RECEIVE_MESSAGE, handleMessage);
      socketState.socket.on(socketEvents.CHANGE_VIDEO, (idVideo) => {
        console.log('Change video event received');
        setSocketState((prevState) => ({
          ...prevState,
          idVideo: idVideo
        }));
      });
  
      socketState.socket.on(socketEvents.SYNC_ON, () => {
        setIsEnabled(prevState => !prevState);
        console.log('Sync on received');
      });
  
      socketState.socket.on(socketEvents.SYNC_OFF, () => {
        setIsEnabled(prevState => !prevState);
        console.log('Sync off received');
      });
  
      return () => {
        console.log('Desmontando eventos de socket');
        // Desuscribirse de los eventos al desmontar el componente
        socketState.socket.off(socketEvents.PAUSE, handlePause);
        socketState.socket.off(socketEvents.PLAY, handlePlay);
        socketState.socket.off(socketEvents.RECEIVE_MESSAGE, handleMessage);
        socketState.socket.off(socketEvents.SYNC_ON);
        socketState.socket.off(socketEvents.SYNC_OFF);
        socketState.socket.off(socketEvents.CHANGE_VIDEO);
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
      if(isEnabled) {
        socketState.socket.emit(socketEvents.PLAY, socketState.idSala, callback);
      }
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
      if(isEnabled) {
        socketState.socket.emit(socketEvents.PAUSE, socketState.idSala, callback);
      }
      //console.log('Pause event emitted by ', authState.id);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.contentContainer}>
              <SearchBar setVideoUrl={handleSelectVideo} />
            </View>
            <View style={[styles.button, styles.buttonClose]}>
              <Icon name="close"  type="ionicon" color="white" onPress={()=>{setModalVisible(false)}} />
            </View>
          </View>
        </View>
      </Modal>
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
      <View style={{ alignItems: 'center', flex: 0.7 }}>
        <YoutubePlayer
          videoId={socketState.idVideo}
          height={'100%'}
          width={'95%'}
          webViewStyle={styles.Video}
          play={videoPlaying}
          onChangeState={handleStateChange}
        />
        {/* <TouchableOpacity onPress={console.log("SocketState en video Screen: ", socketState)}>
          <Text>Console log</Text>
        </TouchableOpacity> */}
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, flex:0.15 }}>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{fontSize: 12, fontWeight: 'bold', padding:10}}>¡Cambia el vídeo!</Text>
          <Icon name="refresh-cw" type="feather" onPress={() => {
            console.log('Emitiendo evento CHANGE_VIDEO');
            setModalVisible(true);
            // socketState.socket.emit(socketEvents.CHANGE_VIDEO, socketState.idSala);
          }} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{fontSize: 12, fontWeight: 'bold'}}>Sala Sincronizada</Text>
          <Switch
            trackColor={{ false: "#767577", true: "gray" }}
            thumbColor={'lightgray'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      <View style={styles.chatContainer}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.timestamp+ item.message}
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '80%',
    overflow: 'hidden'
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  contentContainer: {
    flex: 1, // Toma todo el espacio disponible
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

const VideoScreen = () => {
  return (
    <ActionSheetProvider>
      <Video />
    </ActionSheetProvider>
  );
};

export default VideoScreen;
