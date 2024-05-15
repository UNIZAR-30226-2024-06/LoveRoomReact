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
  Switch,
  Alert,
  ActivityIndicator,
  AppState
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import AuthContext from '../components/AuthContext';
import { useEffect } from 'react';
import { socketEvents } from '../constants/SocketConstants';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import ChatMessage from '../components/ChatMessage';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { ActionSheetProvider, useActionSheet } from '@expo/react-native-action-sheet';
import { Dimensions } from 'react-native';
import defaultProfilePicture from '../img/perfil-vacio.png';
import SearchBar from '../components/SearchBarYt';
import OtherProfile from './OtherProfileScreen';
import mime from 'mime';
import axios from 'axios';
import Toast from 'react-native-toast-message';

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
  const ignorePlay = useRef(false);
  const ignorePause = useRef(false);
  const ignorarBugPause = useRef(false); // Para ignorar el bug de que se manden dos eventos de pause seguidos
  const [videoPlaying, setVideoPlaying] = useState(false);
  const playerRef = useRef(null); // Referencia al reproductor de video
  const [isEnabled, setIsEnabled] = useState(true); // Sincronización activada al principio por defecto
  const emitirGetSync = useRef(false); // Se activa solo para indicar que cuando llegue el play hay que pausar (necesario para sincronizar)
  const userPhotoUrl = useRef('null.jpg'); // Foto de perfil del usuario (por defecto vacía
  const currentTime = useRef(0); // Tiempo actual del video
  // console.log('SocketState en video Screen: ', socketState);
  const [modalUserVisible, setModalUserVisible] = useState(false);
  const [modalCargaMatch, setModalCargaMatch] = useState(false);
  // Copias de useStates para evitar errores
  const idRoom = useRef(null);
  const myVideoPlaying = useRef(false);
  const myIsEnabled = useRef(true);
  const myIdVideo = useRef('');
  // Para evitar que salga de la sala cuando la app se encuentra en background
  const ignoreBackgroundChange = useRef(false);

  useEffect(() => {
    const appstateList = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      appstateList?.remove();
    };
  }, []);

  // TODO: la primera vez que se pone en background se desconecta aunque esté en true
  const handleAppStateChange = (nextAppState) => {
    // setTimeout(() => {
    console.log('AppState:', nextAppState);
    console.log('ignoreBackgroundChange en background:', ignoreBackgroundChange.current);
    if (nextAppState === 'background' && ignoreBackgroundChange.current == false) {
      console.log('App is in background mode');
      if (ignoreBackgroundChange.current) {
        console.log('Ignorando evento handleAppStateChange');
        return;
      }
      console.log('comienza el timeout');
      // Retrasar la ejecución del siguiente bloque de código

      console.log('Desconectando sala');
      // La aplicación ha pasado al fondo, desconecta el socket
      socketState.socket.emit(socketEvents.LEAVE_ROOM, socketState.idSala);
      socketState.socket.disconnect();
      socketState.socket.off('connect');
      setSocketState((prevState) => ({
        ...prevState,
        receiverId: '',
        idVideo: '',
        idSala: '',
        matchRecibido: false
      }));
      myIdVideo.current = '';
      console.log('Socket disconnected');
      ignorePause.current = true; // Para evitar bug emitir pause al salir de sala si estaba playing
      navigation.goBack();
    }
    // }, 10000); // Retrasar la ejecución en 1000 milisegundos (1 segundo)
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      socketState.socket.emit(socketEvents.LEAVE_ROOM, socketState.idSala);
      socketState.socket.disconnect();
      socketState.socket.off('connect');
      setSocketState((prevState) => ({
        ...prevState,
        receiverId: '',
        idVideo: '',
        idSala: '',
        matchRecibido: false
      }));
      myIdVideo.current = '';
      console.log('Socket disconnected');
      ignorePause.current = true; // Para evitar bug emitir pause al salir de sala si estaba playing
    });

    // Devuelve una función de limpieza para ejecutar al desmontar el componente
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    console.log('Vamos a cargar el chat en la sala: ', socketState.idSala);
    if (socketState.idSala != '' && socketState.idSala != null) {
      fetch(`${process.env.EXPO_PUBLIC_API_URL}/${socketState.idSala}/chat`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState.token}`
        }
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success chat:', data);
          // setMessages(data);
          if (data.error == null) {
            const transformedData = data.map((item) => {
              return {
                id: item.id,
                multimedia: item.rutamultimedia,
                message: item.texto,
                timestamp: item.fechahora,
                senderId: item.idusuario
              };
            });
            // Ahora transformedData contiene los datos transformados en la estructura deseada
            console.log('Transformed data:', transformedData);
            setMessages(transformedData);
          } else {
            console.log('Error:', data.error);
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: 'Error al cargar el chat',
              text2: 'Ha habido un error al cargar el chat. Por favor, vuelva a cargar la sala.',
              visibilityTime: 2500
            });

            navigation.goBack();
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [socketState.idSala]);

  const screenHeight = Dimensions.get('window').height;

  const showMediaOptions = () => {
    console.log('showMediaOptions');
    const options = ['Foto', 'Video'];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          handleImagePicker('foto');
        } else if (buttonIndex === 1) {
          handleImagePicker('video');
        }
      }
    );
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState('');

  const handleSelectVideo = async (videoUrl) => {
    console.log('Video seleccionado en la seleccion:', videoUrl);
    setSelectedVideoUrl(videoUrl);
    setModalVisible(false);
  };

  const handleChangeVideo = () => {
    const nuevoVideo = selectedVideoUrl;
    console.log('Video seleccionado:', nuevoVideo);
    // Si estoy en una sala
    if (idRoom.current != null && socketState.idSala != null && socketState.idSala != '') {
      if (myIsEnabled.current) {
        // Solo se envia el evento si la sincronización está activada
        console.log('Emitiendo evento CHANGE_VIDEO ', socketState.idSala, nuevoVideo);
        socketState.socket.emit(
          socketEvents.CHANGE_VIDEO,
          socketState.idSala,
          nuevoVideo,
          (message) => {
            console.log('Respuesta del servidor:', message);
            if (message) {
              if (myVideoPlaying.current) {
                ignorePause.current = true; // Para evitar bug emitir pause al cambiar de video
              }

              setVideoPlaying(true); // Play
              myVideoPlaying.current = true;

              setSocketState((prevState) => ({
                ...prevState,
                idVideo: nuevoVideo
              }));
              myIdVideo.current = nuevoVideo;
              currentTime.current = 0; // Reseteamos el tiempo actual
            }
          }
        );
      } else {
        console.log('Sincronización desactivada, no se envía el evento CHANGE_VIDEO');
        setSocketState((prevState) => ({
          ...prevState,
          idVideo: nuevoVideo
        }));
        myIdVideo.current = nuevoVideo;
      }
    } else {
      // Si estoy en una sala unitaria, al cambiar de vídeo tengo que comprobar si hay match otra vez
      console.log('Emitiendo evento CHANGE_VIDEO_UNITARIA by ', authState.id, nuevoVideo);
      setModalCargaMatch(true);
      socketState.socket.emit(socketEvents.CHANGE_VIDEO_UNITARIA, nuevoVideo, (success, data) => {
        console.log('Respuesta del servidor:', success);
        setModalCargaMatch(false);
        if (success) {
          myIdVideo.current = nuevoVideo; // Guardamos el id del video
          if (myVideoPlaying.current) {
            ignorePause.current = true; // Para evitar bug emitir pause al cambiar de video
          }

          setVideoPlaying(true); // Play
          myVideoPlaying.current = true;

          if (data.esSalaUnitaria == true) {
            // NO HAY MATCH
            setSocketState((prevState) => ({
              ...prevState,
              idVideo: nuevoVideo
            }));
            Toast.show({
              type: 'info',
              position: 'bottom',
              text1: 'Espera a tu match',
              text2: 'No hay nadie viendo este vídeo, ¡espera a que alguien entre!',
              visibilityTime: 2500
            });
          } else if (data.esSalaUnitaria == false) {
            // HAY MATCH
            // Para emitir un GET_SYNC al cambiar de video
            emitirGetSync.current = true; // Para que se emita en el handleStateChange
            console.log('Sala con persona, ¡he hecho match! by ', authState.id);
            setSocketState((prevState) => ({
              ...prevState,
              idVideo: nuevoVideo,
              receiverId: data.idusuario,
              idSala: data.idsala.toString()
            }));
            Toast.show({
              type: 'success',
              position: 'bottom',
              text1: '¡Match encontrado!',
              text2: 'Has hecho match con alguien, ¡disfruta la sala!',
              visibilityTime: 2500
            });
          }
        } else {
          console.log('Error al cambiar de video en sala unitaria');
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error al cambiar de video',
            text2: 'Error al cambiar de video. Inténtalo de nuevo.',
            visibilityTime: 2500
          });
        }
      });
    }
    setSelectedVideoUrl('');
  };

  useEffect(() => {
    if (selectedVideoUrl !== '') {
      handleChangeVideo();
    }
  }, [selectedVideoUrl]);

  useEffect(() => {
    console.log('Efecto ejecutado. receiverId:', socketState.receiverId);
    //setIsEnabled(true);
    handleInfoReceiver();
    console.log('ID de sala:', socketState.idSala);
    //console.log('Socket:', socketState.socket);
    if (
      socketState.idSala != '' &&
      socketState.idSala != null &&
      socketState.socket != null &&
      socketState.socket.connected == true
    ) {
      console.log('Emitiendo evento JOIN_ROOM ', socketState.idSala, ' by ', authState.id);
      if (idRoom.current == null) {
        // Guardamos el id de la sala
        idRoom.current = socketState.idSala;
      }
      if (myIdVideo.current == '' && socketState.idVideo != null && socketState.idVideo != '') {
        // Guardamos el id del video
        myIdVideo.current = socketState.idVideo;
      }
      socketState.socket.emit(socketEvents.JOIN_ROOM, socketState.idSala); // Necesario que idSala sea un string
    }
  }, []);

  useEffect(() => {
    console.log('Efecto ejecutado2. receiverId:', socketState.receiverId);
    handleInfoReceiver();
  }, [socketState.receiverId]);

  // Se ejecuta por ambos cuando se actualiza el idSala, es decir, cuando se hace match
  useEffect(() => {
    console.log('ID de sala:', socketState.idSala);
    if (socketState.idSala != '' && socketState.idSala != null) {
      console.log('Emitiendo evento JOIN_ROOM ', socketState.idSala, ' by ', authState.id);
      if (idRoom.current == null) {
        // Guardamos el id de la sala
        idRoom.current = socketState.idSala;
      }
      if (myIdVideo.current == '' && socketState.idVideo != null && socketState.idVideo != '') {
        // Guardamos el id del video
        myIdVideo.current = socketState.idVideo;
      }
      socketState.socket.emit(socketEvents.JOIN_ROOM, socketState.idSala); // Necesario que idSala sea un string
    }
  }, [socketState.idSala]);

  const handleImagePicker = async (mediaType) => {
    ignoreBackgroundChange.current = true; // Para que no salga de la sala
    console.log('handleImagePicker ', ignoreBackgroundChange.current);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Permisos insuficientes',
        text2: 'Lo sentimos, necesitamos permisos para acceder a la galería',
        visibilityTime: 2500
      });
    } else {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          mediaType === 'foto'
            ? ImagePicker.MediaTypeOptions.Images
            : ImagePicker.MediaTypeOptions.Videos
      });

      console.log(result);

      if (!result.cancelled) {
        ignoreBackgroundChange.current = false;
        // Handle the selected image or video
        console.log(result.assets[0].uri);
        await uploadMedia(result.assets[0].uri, mediaType);
      } else {
        ignoreBackgroundChange.current = false;
        console.log('Cancelado');
      }
    }
  };

  const uploadMedia = async (uri, mediaType) => {
    const multimedia = await fetch(uri);

    console.log('Subiendo media:', uri);

    const formData = new FormData();
    const uriParts = uri.split('.');
    const fileType = uriParts[uriParts.length - 1];

    console.log('File type:', mime.getType(uri));
    formData.append('file', {
      uri: uri,
      type: mime.getType(uri),
      name: uri.split('/').pop()
    });
    console.log('Formdata: ', formData);

    const url = `${process.env.EXPO_PUBLIC_API_URL}/multimedia/upload/${mediaType}/${authState.id}`;
    console.log('URL:', url);
    console.log('Subiendo media:', uri);

    console.log('URL:', url);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authState.token}`
      },
      body: formData
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('response' + JSON.stringify(res));
        if (res.error == null) {
          const mediaUrl = res.nombreArchivo;
          console.log('URL de la imagen:', mediaUrl);
          const data = {
            id: null,
            senderId: authState.id,
            message: mediaUrl,
            timestamp: null,
            rutamultimedia: mediaUrl
          };
          sendMessageMultimedia(data);
        } else {
          console.log('Error: guardando mensaje ', data.error);
          alert('Ha habido un error en los datos de la imagen. Vuelva a intentarlo.');
        }
      })
      .catch((e) => console.log(e));
  };

  const sendMessageMultimedia = (data) => {
    if (socketState.socket != null && socketState.socket.connected == true) {
      console.log('Enviando mensaje multimedia: ', data.message);
      const idsala = socketState.idSala;
      const texto = data.message;
      const rutamultimedia = data.rutamultimedia;
      const callback = (message, idMsg, timestamp) => {
        console.log('Respuesta del servidor:', message);
        console.log('ID del mensaje:', idMsg);
        console.log('Timestamp:', timestamp);
        data.id = idMsg;
        data.timestamp = timestamp;
        data.senderId = socketState.senderId;
        // data.rutamultimedia = rutamultimedia;
        console.log('SocketState para mensaje:', socketState);
        console.log(socketState.senderId);
        console.log('Data en el callback: ', data);
        setMessages((prevState) => [...prevState, data]);
        // setNewMessage('');
      };

      socketState.socket.emit(socketEvents.CREATE_MESSAGE, idsala, texto, rutamultimedia, callback);
    }
  };

  const toggleSwitch = () => {
    setIsEnabled((previousState) => {
      if (previousState) {
        console.log(authState.id, ' enviando Sync off');
        socketState.socket.emit(socketEvents.SYNC_OFF, socketState.idSala, (boolean) => {
          if (boolean == false) {
            myIsEnabled.current = true;
            return previousState;
          } else {
            myIsEnabled.current = false;
          }
        });
      } else {
        // Si se activa la sincronización, se envía un evento SYNC_ON
        myIsEnabled.current = true;
        handleSendSync(true); // da igual true o false, no se va a tener en cuenta en este caso
      }

      return !previousState;
    });
  };

  // USO IDROOM.CURRENT PORQUE idSala va mal
  // De momento por defecto, el video se pausa al sincronizar
  const handleSendSync = async (pausado) => {
    // Pausamos nuestro video si no lo estaba
    if (myVideoPlaying.current) {
      console.log('handleSendSync PAUSE video al sincronizar by ', authState.id);
      ignorePause.current = true;
      setVideoPlaying(false);
      myVideoPlaying.current = false;
    } else {
      console.log('handleSendSync NO PAUSE by ', authState.id);
    }
    // Obtenemos el tiempo actual del video
    const timesegundos = await playerRef.current?.getCurrentTime();
    currentTime.current = timesegundos; // Guardamos el tiempo actual por haber pausado
    // Enviamos el evento SYNC_ON para que el otro usuario se sincronice con nosotros
    console.log(
      authState.id,
      ' enviando Sync on con idsala:',
      idRoom.current,
      ' myidvideo:',
      myIdVideo.current,
      'idvideo socket: ',
      socketState.idVideo,
      ' timesegundos:',
      timesegundos,
      ' pausado:',
      pausado
    );
    socketState.socket.emit(
      socketEvents.SYNC_ON,
      idRoom.current,
      myIdVideo.current,
      timesegundos,
      pausado
    );
    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: 'Sincronización activada',
      text2: '¡Tu vídeo se ha sincronizado con el de tu match!',
      visibilityTime: 2500
    });
    setIsEnabled(true);
    myIsEnabled.current = true;
  };

  const handlePause = () => {
    console.log('Pause event received by ', authState.id);
    ignorePause.current = true;
    setVideoPlaying(false);
    myVideoPlaying.current = false;
    // Leemos y guardamos el tiempo actual del video por haber pausado
    playerRef.current?.getCurrentTime().then((time) => {
      currentTime.current = time;
    });
  };

  const handlePlay = () => {
    console.log('Play event received by ', authState.id);
    ignorePlay.current = true;
    setVideoPlaying(true);
    myVideoPlaying.current = true;
  };

  const handleMessage = (idMsg, senderId, texto, rutamultimedia, fechaHora) => {
    console.log('Mensaje recibido de: ', senderId);
    console.log('ID del mensaje: ', idMsg);
    console.log('Texto del mensaje: ', texto);
    console.log('Ruta multimedia: ', rutamultimedia);
    console.log('Fecha y hora: ', fechaHora);
    const data = {
      id: idMsg,
      senderId: senderId,
      message: texto,
      timestamp: fechaHora,
      rutamultimedia: rutamultimedia
    };

    setMessages((prevState) => [...prevState, data]);
  };

  const handleSyncOn = async (idVideo, timesegundos, pausado, otroUsuarioOnline) => {
    console.log(
      'Sync on received by ',
      authState.id,
      ' idVideo:',
      idVideo,
      ' timesegundos:',
      timesegundos,
      ' pausado:',
      pausado
    );

    // Cambiamos el video actual al video que nos envia el otro usuario
    if (idVideo != null && myIdVideo.current != idVideo) {
      console.log('Cambiando video a: ', idVideo);
      setSocketState((prevState) => ({
        ...prevState,
        idVideo: idVideo
      }));
      myIdVideo.current = idVideo;
    }

    // Si la sincronización estaba desactivada, hay que asegurarse de que el video se pausa al sincronizar
    if (myIsEnabled.current == false) {
      console.log(
        'Estaba desactivada by ',
        authState.id,
        ' MYvideoPlaying:',
        myVideoPlaying.current
      );
      if (myVideoPlaying.current) {
        console.log('Pausando video al activar la sincronización');
        ignorePause.current = true;
        ignorarBugPause.current = true; // Aqui tambien se buguea el reproductor
        setVideoPlaying(false);
        myVideoPlaying.current = false;
      }
    } else {
      // Si la sincronización estaba activada
      // El video se debe quedar pausado al sincronizar
      if (pausado) {
        // Si antes del SYNC_ON ya se habia mandado un PAUSE, no hace falta pausar el video
        console.log('No hace falta pausar el video en handleSyncOn');
      } else {
        // Si se habia mandado un PLAY, hay que pausar el video
        console.log('Pausando video al sincronizar by ', authState.id);
        ignoreStateChange.current = true; // Sin esto no funciona
        setVideoPlaying(false);
        myVideoPlaying.current = false;
      }
    }

    if (timesegundos != null) {
      console.log('Cambiando tiempo a: ', timesegundos);
      playerRef.current?.seekTo(timesegundos, true);
      currentTime.current = timesegundos; // Guardamos el tiempo actual por haber pausado
      if (otroUsuarioOnline) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Sincronización activada',
          text2: '¡Tu vídeo se ha sincronizado con el de tu match!',
          visibilityTime: 2500
        });
        setIsEnabled(true);
        myIsEnabled.current = true;
      } else {
        Toast.show({
          type: 'info',
          position: 'bottom',
          text1: 'Tu match no está conectado',
          text2: 'Último punto de vídeo recuperado',
          visibilityTime: 2500
        });
      }
    } else {
      console.log('No se ha recibido tiempo');
    }
  };

  const handleGetSync = () => {
    console.log('GET_SYNC event received by ', authState.id, ' myidvideo es ', myIdVideo.current);
    console.log('Inside GET_SYNC -> MYisEnabled:', myIsEnabled.current, ' user id:', authState.id);
    if (myIsEnabled.current) {
      // Si la sincronización está activada, mandamos un SYNC_ON
      // Llamamos a la función handleSendSync para enviar nuestro video y tiempo al otro usuario
      handleSendSync(false); // false para indicar que no se ha pausado el video
    } else {
      // Si esta la sincronización desactivada, mandamos un SYNC_OFF para que el otro usuario la desactive tambien
      console.log('GET_SYNC: Sincronización desactivada, enviando SYNC_OFF');
      socketState.socket.emit(socketEvents.SYNC_OFF, socketState.idSala, (success) => {
        if (!success) {
          console.log('Error al enviar SYNC_OFF');
        }
      });
    }
  };

  const handleSyncOff = () => {
    setIsEnabled(false);
    myIsEnabled.current = false;
    console.log('Sync off received');
  };

  const handleEventoChangeVideo = (idVideo) => {
    console.log('Change video event received');
    if (myVideoPlaying.current) {
      ignorePause.current = true; // Para evitar bug emitir pause al cambiar de video
    }

    setVideoPlaying(true); // Play
    myVideoPlaying.current = true;

    setSocketState((prevState) => ({
      ...prevState,
      idVideo: idVideo
    }));
    myIdVideo.current = idVideo;
    currentTime.current = 0; // Reseteamos el tiempo actual
  };

  const handleCheckRoom = () => {
    console.log('CHECK_ROOM event received by ', authState.id);
    if (socketState.idSala != null && socketState.idSala != '') {
      // Si estabamos en una sala, al reconectarnos al socket volvemos a hacer JOIN_ROOM
      console.log(
        'Emitiendo evento JOIN_ROOM para reconectarse a la sala ',
        socketState.idSala,
        ' by ',
        authState.id
      );
      socketState.socket.emit(socketEvents.JOIN_ROOM, socketState.idSala);
    }
    // } else {
    //   // Aqui se deberia volver a la pantalla de búsqueda ya que el usuario ya no va a poder hacer match
    //   console.log('No hay sala, volviendo a la pantalla de búsqueda');
    // Toast.show({
    //   type: 'info',
    //   position: 'bottom',
    //   text1: 'Te has desconectado del vídeo',
    //   text2: 'Si quieres hacer match debes salir y volver a entrar.',
    //   visibilityTime: 2500
    // });
    //   //navigation.navigate('Search');???
    // }
  };

  const handleUnmatch = (idSala) => {
    console.log('UNMATCH event received by ', authState.id);
    if (idSala == idRoom.current) {
      Toast.show({
        type: 'info',
        position: 'bottom',
        text1: 'Unmatch',
        text2: 'El otro usuario ha hecho unmatch. Lo sentimos.',
        visibilityTime: 2500
      });
      navigation.goBack();
    }
  };

  useEffect(() => {
    if (socketState.socket != null) {
      console.log('Eventos de socket');

      // Desuscribirse de los eventos anteriores (no necesario?)
      // socketState.socket.off(socketEvents.CHECK_ROOM, handleCheckRoom);
      // socketState.socket.off(socketEvents.GET_SYNC, handleGetSync);
      // socketState.socket.off(socketEvents.PAUSE, handlePause);
      // socketState.socket.off(socketEvents.PLAY, handlePlay);
      // socketState.socket.off(socketEvents.RECEIVE_MESSAGE, handleMessage);
      // socketState.socket.off(socketEvents.SYNC_ON, handleSyncOn);
      // socketState.socket.off(socketEvents.SYNC_OFF, handleSyncOff);
      // socketState.socket.off(socketEvents.CHANGE_VIDEO, handleEventoChangeVideo);
      // socketState.socket.off(socketEvents.UNMATCH, handleUnmatch);

      // Suscribirse a los nuevos eventos
      socketState.socket.on(socketEvents.CHECK_ROOM, handleCheckRoom); // Para que al reconectarse al socket se vuelva a hacer JOIN_ROOM
      socketState.socket.on(socketEvents.GET_SYNC, handleGetSync);
      socketState.socket.on(socketEvents.PAUSE, handlePause);
      socketState.socket.on(socketEvents.PLAY, handlePlay);
      socketState.socket.on(socketEvents.RECEIVE_MESSAGE, handleMessage);
      socketState.socket.on(socketEvents.SYNC_ON, handleSyncOn);
      socketState.socket.on(socketEvents.SYNC_OFF, handleSyncOff);
      socketState.socket.on(socketEvents.CHANGE_VIDEO, handleEventoChangeVideo);
      socketState.socket.on(socketEvents.UNMATCH, handleUnmatch);

      return () => {
        console.log('Desmontando eventos de socket');
        // Desuscribirse de los eventos al desmontar el componente
        socketState.socket.off(socketEvents.CHECK_ROOM, handleCheckRoom);
        socketState.socket.off(socketEvents.GET_SYNC, handleGetSync);
        socketState.socket.off(socketEvents.PAUSE, handlePause);
        socketState.socket.off(socketEvents.PLAY, handlePlay);
        socketState.socket.off(socketEvents.RECEIVE_MESSAGE, handleMessage);
        socketState.socket.off(socketEvents.SYNC_ON, handleSyncOn);
        socketState.socket.off(socketEvents.SYNC_OFF, handleSyncOff);
        socketState.socket.off(socketEvents.CHANGE_VIDEO, handleEventoChangeVideo);
        socketState.socket.off(socketEvents.UNMATCH, handleUnmatch);
      };
    } else {
      console.log('Socket = null');
    }
  }, [socketState.socket]);

  const sendMessage = () => {
    if (socketState.socket != null && socketState.socket.connected == true && newMessage != '') {
      const data = {
        id: null,
        senderId: null,
        message: newMessage,
        timestamp: null,
        rutamultimedia: null
      };
      console.log('Enviando mensaje: ', data.message);
      const idsala = socketState.idSala;
      const texto = data.message;
      const rutamultimedia = null;
      const callback = (message, idMsg, timestamp) => {
        console.log('Respuesta del servidor:', message);
        console.log('ID del mensaje:', idMsg);
        console.log('Timestamp:', timestamp);
        data.id = idMsg;
        data.timestamp = timestamp;
        data.senderId = socketState.senderId;
        data.rutamultimedia = rutamultimedia;
        console.log('SocketState para mensaje:', socketState);
        console.log(socketState.senderId);
        console.log('Data en el callback: ', data);
        setMessages((prevState) => [...prevState, data]);
        setNewMessage('');
      };

      socketState.socket.emit(socketEvents.CREATE_MESSAGE, idsala, texto, rutamultimedia, callback);
    }
  };

  const handleInfoReceiver = () => {
    if (socketState.receiverId != null && socketState.receiverId != '') {
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
          console.log('Success info receiver');
          console.log('Success:', data);
          setUser(data);
          userPhotoUrl.current = `${process.env.EXPO_PUBLIC_API_URL}/multimedia/${data.fotoperfil}`;
          console.log('userphotourl', userPhotoUrl.current);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    } else {
      console.log('No hay receiverId');
    }
  };

  const handleStateChange = async (event) => {
    console.log('Evento:', event, ' by ', authState.id);
    // console.log(
    //   'Evento:',
    //   event,
    //   ' by ',
    //   authState.id,
    //   'ignoreStateChange:',
    //   ignoreStateChange.current,
    //   ' ignorePlay:',
    //   ignorePlay.current,
    //   ' ignorePause:',
    //   ignorePause.current,
    //   ' isEnabled:',
    //   isEnabled,
    //   'receiverId:',
    //   socketState.receiverId
    // );
    if (event === 'playing') {
      // CASO ESPECIAL 1: Ya ha cargado el video y se requiere emitir un GET_SYNC para la sincronización
      if (emitirGetSync.current && idRoom.current != null) {
        emitirGetSync.current = false;
        // Emitimos un evento GET_SYNC para que el otro usuario nos mande su tiempo
        console.log(authState.id, ' emitiendo evento GET_SYNC in room ', idRoom.current);
        socketState.socket.emit(socketEvents.GET_SYNC, idRoom.current);
        return;
      }
      ignorarBugPause.current = false; // Cuando se pone a play, ya no hay que tener en cuenta el bug de que se manden dos eventos de pause seguidos
      // CASO ESPECIAL 2: Ignorar play porque no lo ha hecho el usuario manualmente
      if (ignorePlay.current) {
        console.log('Ignorando evento de play by ', authState.id);
        ignorePlay.current = false;
        return;
      } else if (ignoreStateChange.current) {
        // Creo que no deberia darse nunca este caso
        console.log('\n\nALERTA Ignorando evento de PLAY IGNORESTATECHANGE by ', authState.id);
        ignoreStateChange.current = false;
        return;
      }
      // CASO NORMAL: El usuario ha dado al play manualmente o avanzado/retrocedido el video
      console.log('Playing: videoPlaying ', videoPlaying); // Deberia ser false siempre
      setVideoPlaying(true);
      myVideoPlaying.current = true;
      // Si estamos en una sala y la sincronización está activada
      if (isEnabled && idRoom.current != null) {
        console.log('Emitiendo evento PLAY by ', authState.id);
        const callback = (message) => {
          console.log('Respuesta del servidor:', message);
        };
        socketState.socket.emit(socketEvents.PLAY, idRoom.current, callback);

        // Comprobamos si el usuario ha avanzado o retrocedido el video, y si lo ha hecho, enviamos un evento SYNC_ON
        const time = await playerRef.current?.getCurrentTime();
        const diff = Math.abs(time - currentTime.current);
        console.log(
          'Tiempo actual:',
          time,
          ' Tiempo guardado:',
          currentTime.current,
          ' Diferencia:',
          diff
        );
        if (diff > 1) {
          console.log('Diferencia mayor a 1 segundo, enviando evento SYNC_ON');
          handleSendSync(false); // false para indicar que no se ha pausado el video
        }
      }
    } else if (event === 'paused') {
      // CASO ESPECIAL 1: Ignorar pause porque no lo ha hecho el usuario manualmente
      if (ignorePause.current) {
        console.log('Ignorando evento de pause by ', authState.id);
        ignorePause.current = false;
        return;
      } else if (ignoreStateChange.current) {
        console.log('Ignorando evento de PAUSE IGNORESTATECHANGE by ', authState.id);
        ignoreStateChange.current = false;
        ignorePlay.current = false;
        ignorarBugPause.current = true; // Para ignorar el bug de que se manden dos eventos de pause seguidos hasta que se ponga a play
        return;
      }
      // CASO ESPECIAL 2: Han llegado dos eventos de pause seguidos porque el usuario ha avanzado o retrocedido con un clic
      console.log('Paused: videoPlaying ', videoPlaying); // Es true siempre menos cuando se ha avanzado o retrocedido con un clic
      if (!videoPlaying) {
        // Si me llega un pause pero el video ya estaba pausado, significa que el usuario a avanzado o retrocedido
        if (isEnabled && idRoom.current != null && !ignorarBugPause.current) {
          // Mandamos un evento SYNC_ON para sincronizar
          // Obtenemos el tiempo actual del video
          const timesegundos = await playerRef.current?.getCurrentTime();
          // Enviamos el evento SYNC_ON para que el otro usuario se sincronice con nosotros
          console.log(
            ' PAUSE: ',
            authState.id,
            ' enviando Sync on con idsala:',
            idRoom.current,
            ' idvideo:',
            myIdVideo.current,
            ' timesegundos:',
            timesegundos
          );
          socketState.socket.emit(
            socketEvents.SYNC_ON,
            idRoom.current,
            myIdVideo.current,
            timesegundos,
            true // true porque ya se ha mandado un evento de pause antes
          );
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Sincronización activada',
            text2: '¡Tu vídeo se ha sincronizado con el de tu match!',
            visibilityTime: 2500
          });
          setIsEnabled(true);
          myIsEnabled.current = true;
        } else {
          console.log('Bug evitado o sincronizacion desactivada');
        }
        return;
      }
      // CASO NORMAL: El usuario ha pausado el video manualmente
      setVideoPlaying(false);
      myVideoPlaying.current = false;
      // Si estamos en una sala y la sincronización está activada
      if (isEnabled && idRoom.current != null) {
        console.log('Emitiendo evento PAUSE by ', authState.id);
        const callback = (message) => {
          console.log('Respuesta del servidor:', message);
        };
        socketState.socket.emit(socketEvents.PAUSE, idRoom.current, callback);

        // Guardamos el tiempo actual (servirá para detectar si el usuario ha avanzado o retrocedido el video)
        const time = await playerRef.current?.getCurrentTime();
        currentTime.current = time;
        console.log('Pause tiempo leido:', time);
        // Emitimos un evento para que el tiempo de la sala se actualice cada vez que se pause el video
        console.log('Emitiendo evento STORE_TIME by ', authState.id);
        socketState.socket.emit(socketEvents.STORE_TIME, idRoom.current, time);
      }
    }
  };

  // Cuando el reproductor de youtube este listo
  const handleReady = () => {
    // Si soy el ultimo usuario en unirme a la sala, mando un GET_SYNC para que el otro usuario me mande su tiempo
    if (
      socketState.idSala != '' &&
      socketState.idSala != null &&
      socketState.matchRecibido == false
    ) {
      // Antes de mandar el GET_SYNC, hay que darle a play y luego pause para que el video cargue un poco
      // y se quede pausado tras el seekto()
      emitirGetSync.current = true; // Para que se emita en el handleStateChange
      setVideoPlaying(true); // Play
      myVideoPlaying.current = true;
      // NOTA: el evento GET_SYNC se manda en el handleStateChange cuando nos hayamos asegurado de que ya se ha puesto a play el video
    } else {
      // Si soy el primer usuario en unirme a la sala
      // Por temas de sincronización, al cargar el reproductor hay que darle a play
      console.log('Reproductor listo, dandole a play');
      ignorePlay.current = true;
      setVideoPlaying(true);
      myVideoPlaying.current = true;
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Modal transparent={true} animationType={'none'} visible={modalCargaMatch}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={modalCargaMatch} size="large" color="#F89F9F" />
            <Text>Buscando match... </Text>
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.contentContainer}>
              <SearchBar setVideoUrl={handleSelectVideo} />
            </View>
            <View style={[styles.button, styles.buttonClose]}>
              <Icon
                name="close"
                type="ionicon"
                color="white"
                onPress={() => {
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
      {socketState.receiverId != '' && (
        <>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 15,
              backgroundColor: '#c1c3c9',
              borderRadius: 30,
              marginBottom: 10
            }}
            onPress={() => {
              console.log('Ver perfil');
              setModalUserVisible(true);
            }}>
            <View style={{ flex: 1, alignItems: 'center', flexDirection: 'row' }}>
              <Image
                source={
                  userPhotoUrl.current === 'null.jpg'
                    ? defaultProfilePicture
                    : { uri: userPhotoUrl.current }
                }
                style={{ width: 50, height: 50, backgroundColor: 'white', borderRadius: 60 }}
              />
              <Text style={{ padding: 15, color: 'white' }}>
                {user.nombre}, Edad: {user.edad}
              </Text>
            </View>
            <Text style={{ padding: 5, color: 'white' }}>Ver perfil</Text>
            <Icon name="chevron-right" size={25} color="white" style={styles.arrowImage} />
          </TouchableOpacity>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalUserVisible}
            onRequestClose={() => {
              setModalUserVisible(false);
            }}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ScrollView
                keyboardShouldPersistTaps={'handled'}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 10,
                  width: '90%',
                  maxHeight: '70%'
                }}>
                <OtherProfile user={user} userPhotoUrl={userPhotoUrl.current} />
              </ScrollView>
              <View style={[styles.button, styles.buttonClose]}>
                <Icon
                  name="close"
                  type="ionicon"
                  color="white"
                  onPress={() => {
                    setModalUserVisible(false);
                  }}
                />
              </View>
            </View>
          </Modal>
        </>
      )}
      <View style={{ alignItems: 'center', flex: 1 }}>
        <YoutubePlayer
          ref={playerRef}
          videoId={socketState.idVideo}
          height={'100%'}
          width={'95%'}
          webViewStyle={styles.Video}
          play={videoPlaying}
          onChangeState={handleStateChange}
          onReady={handleReady}
        />
      </View>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, flex: 0.2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', padding: 10 }}>¡Cambia el vídeo!</Text>
          <Icon
            name="refresh-cw"
            type="feather"
            onPress={() => {
              console.log('Modal visible CHANGE_VIDEO');
              setModalVisible(true);
              // socketState.socket.emit(socketEvents.CHANGE_VIDEO, socketState.idSala);
            }}
          />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Sala Sincronizada</Text>
          <Switch
            trackColor={{ false: '#767577', true: 'gray' }}
            thumbColor={'lightgray'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      </View>
      <View style={styles.chatContainer}>
        <FlatList
          removeClippedSubviews={false}
          data={messages}
          keyExtractor={(item) => item.timestamp + item.message}
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
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
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
    marginTop: 22
  },
  modalView: {
    width: '90%',
    height: '80%',
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
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
    marginTop: 10
  },
  buttonClose: {
    backgroundColor: '#797b80'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  contentContainer: {
    flex: 1 // Toma todo el espacio disponible
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
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
