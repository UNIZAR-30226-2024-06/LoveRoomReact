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
  const ignorePlay = useRef(false);
  const ignorePause = useRef(false);
  const ignorarBugPause = useRef(false); // Para ignorar el bug de que se manden dos eventos de pause seguidos
  const [videoPlaying, setVideoPlaying] = useState(false);
  const playerRef = useRef(null); // Referencia al reproductor de video
  const idRoom = useRef(null);
  const [isEnabled, setIsEnabled] = useState(true); // Sincronización activada al principio por defecto
  const emitirGetSync = useRef(false); // Se activa solo para indicar que cuando llegue el play hay que pausar (necesario para sincronizar)
  const currentTime = useRef(0); // Tiempo actual del video
  // console.log('SocketState en video Screen: ', socketState);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', () => {
      //socketState.socket.emit(socketEvents.LEAVE_ROOM, socketState.idSala);
      socketState.socket.disconnect();
      socketState.socket.off('connect');
      setSocketState((prevState) => ({
        ...prevState,
        receiverId: '',
        idVideo: '',
        idSala: '',
        matchRecibido: false
      }));
      console.log('Socket disconnected');
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
          console.log('Success:', data);
          // setMessages(data);
          const transformedData = data.map((item) => {
            return {
              id: item.id,
              multimedia: item.rutamultimedia,
              message: item.texto,
              timestamp: item.fechaHora,
              senderId: item.idusuario
            };
          });
          // Ahora transformedData contiene los datos transformados en la estructura deseada
          console.log('Transformed data:', transformedData);
          setMessages(transformedData);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [socketState.idSala]);

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

  const handleSelectVideo = async (videoUrl) => {
    console.log('Video seleccionado en la seleccion:', videoUrl);
    setSelectedVideoUrl(videoUrl);
    setModalVisible(false);
  };

  const handleChangeVideo = () => {
    const nuevoVideo = selectedVideoUrl;
    console.log('Video seleccionado:', nuevoVideo);
    console.log('Emitiendo evento CHANGE_VIDEO ', socketState.idSala, nuevoVideo);
    socketState.socket.emit(
      socketEvents.CHANGE_VIDEO,
      socketState.idSala,
      nuevoVideo,
      (message) => {
        console.log('Respuesta del servidor:', message);
        if (message) {
          setSocketState((prevState) => ({
            ...prevState,
            idVideo: nuevoVideo
          }));
        }
      }
    );
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
        idRoom.current = socketState.idSala;
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
        idRoom.current = socketState.idSala;
      }
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

  const toggleSwitch = () => {
    setIsEnabled((previousState) => {
      if (previousState) {
        console.log(authState.id, ' enviando Sync off');
        socketState.socket.emit(socketEvents.SYNC_OFF, socketState.idSala, (boolean) => {
          if (boolean == false) {
            return previousState;
          }
        });
      } else {  // Si se activa la sincronización, se envía un evento SYNC_ON
        handleSendSync(true); // da igual true o false, no se va a tener en cuenta en este caso
      }

      return !previousState;
    });
  };

  // USO IDROOM.CURRENT PORQUE idSala va mal
  // De momento por defecto, el video se pausa al sincronizar
  const handleSendSync = async (pausado) => {
    // Pausamos el video
    ignorePause.current = true;
    setVideoPlaying(false);
    // Obtenemos el tiempo actual del video
    const timesegundos = await playerRef.current?.getCurrentTime();
    currentTime.current = timesegundos; // Guardamos el tiempo actual por haber pausado
    // Enviamos el evento SYNC_ON para que el otro usuario se sincronice con nosotros
    console.log(
      authState.id,
      ' enviando Sync on con idsala:',
      idRoom.current,
      ' idvideo:',
      socketState.idVideo,
      ' timesegundos:',
      timesegundos,
      ' pausado:',
      pausado
    );
    socketState.socket.emit(
      socketEvents.SYNC_ON,
      idRoom.current,
      socketState.idVideo,
      timesegundos,
      pausado
    );
    alert('¡Vídeo sincronizado con el otro usuario!');
  };

  const handlePause = () => {
    console.log('Pause event received by ', authState.id);
    ignorePause.current = true;
    setVideoPlaying(false);
    // Leemos y guardamos el tiempo actual del video por haber pausado
    playerRef.current?.getCurrentTime().then((time) => {
      currentTime.current = time;
    });
  };

  const handlePlay = () => {
    console.log('Play event received by ', authState.id);
    ignorePlay.current = true;
    setVideoPlaying(true);
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
      timestamp: fechaHora
    };

    setMessages((prevState) => [...prevState, data]);
  };

  const handleSyncOn = async (idVideo, timesegundos, pausado, otroUsuarioOnline) => {
    console.log('handleSyncOn ', authState.id, ' isEnabled:', isEnabled);
    let estabaDesactivada = false;
    if (!isEnabled) {
      setIsEnabled(true);
      estabaDesactivada = true;
    }
    console.log(
      'Sync on received by ',
      authState.id,
      ' idVideo:',
      idVideo,
      ' timesegundos:',
      timesegundos,
      ' pausado:',
      pausado,
      ' estabaDesactivada:',
      estabaDesactivada
    );

    // Cambiamos el video actual al video que nos envia el otro usuario
    if (idVideo != null && socketState.idVideo != idVideo) {
      console.log('Cambiando video a: ', idVideo);
      setSocketState((prevState) => ({
        ...prevState,
        idVideo: idVideo
      }));
    }

    // Si la sincronización estaba desactivada, hay que asegurarse de que el video se pausa al sincronizar
    if (estabaDesactivada) {
      console.log('Estaba desactivada by ', authState.id , ' videoPlaying:', videoPlaying);
      if (videoPlaying) {
        console.log('Pausando video al activar la sincronización');
        ignorePause.current = true;
        setVideoPlaying(false);
      }
    } else {  // Si la sincronización estaba activada
      // El video se debe quedar pausado al sincronizar
      if (pausado) { // Si antes del SYNC_ON ya se habia mandado un PAUSE, no hace falta pausar el video
        console.log('No hace falta pausar el video en handleSyncOn');
      } else {  // Si se habia mandado un PLAY, hay que pausar el video
        console.log('Pausando video al sincronizar by ', authState.id);
        ignoreStateChange.current = true; // Sin esto no funciona
        setVideoPlaying(false);
      }
    }    

    if (timesegundos != null) {
      console.log('Cambiando tiempo a: ', timesegundos);
      playerRef.current?.seekTo(timesegundos, true);
      currentTime.current = timesegundos; // Guardamos el tiempo actual por haber pausado
      if (otroUsuarioOnline) {
        alert('¡Vídeo sincronizado con el otro usuario!');
      } else {
        alert('¡El otro usuario no está conectado. Último punto de vídeo recuperado!');
      }
    } else {
      console.log('No se ha recibido tiempo');
    }
  };

  const handleGetSync = () => {
    console.log('GET_SYNC event received by ', authState.id, ' mi video es ', socketState.idVideo);
    console.log('Inside GET_SYNC -> isEnabled:', isEnabled, ' user id:', authState.id);
    if (isEnabled) {  // Si la sincronización está activada, mandamos un SYNC_ON
      // Llamamos a la función handleSendSync para enviar nuestro video y tiempo al otro usuario
      handleSendSync(false); // false para indicar que no se ha pausado el video
    }
    else {  
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
    console.log('Sync off received');
  };

  const handleEventoChangeVideo = (idVideo) => {
    console.log('Change video event received');
    setSocketState((prevState) => ({
      ...prevState,
      idVideo: idVideo
    }));
  };

  const handleCheckRoom = () => {
    console.log('CHECK_ROOM event received by ', authState.id);
    if (socketState.idSala != null && socketState.idSala != '') {
      // Si estabamos en una sala, al reconectarnos al socket volvemos a hacer JOIN_ROOM
      console.log('Emitiendo evento JOIN_ROOM para reconectarse a la sala ', socketState.idSala, ' by ', authState.id);
      socketState.socket.emit(socketEvents.JOIN_ROOM, socketState.idSala);
    } else {
      // Aqui se deberia volver a la pantalla de búsqueda ya que el usuario ya no va a poder hacer match
      console.log('No hay sala, volviendo a la pantalla de búsqueda');
      alert(
        'Te has desconectado del vídeo.\n Si quieres hacer match debes salir y volver a entrar.'
      );
      //navigation.navigate('Search');???
    }
  };

  useEffect(() => {
    if (socketState.socket != null) {
      console.log('Eventos de socket');

      // Desuscribirse de los eventos anteriores (no necesario?)
      socketState.socket.off(socketEvents.CHECK_ROOM, handleCheckRoom);
      socketState.socket.off(socketEvents.GET_SYNC, handleGetSync);
      socketState.socket.off(socketEvents.PAUSE, handlePause);
      socketState.socket.off(socketEvents.PLAY, handlePlay);
      socketState.socket.off(socketEvents.RECEIVE_MESSAGE, handleMessage);
      socketState.socket.off(socketEvents.SYNC_ON, handleSyncOn);
      socketState.socket.off(socketEvents.SYNC_OFF, handleSyncOff);
      socketState.socket.off(socketEvents.CHANGE_VIDEO, handleEventoChangeVideo);

      // Suscribirse a los nuevos eventos
      socketState.socket.on(socketEvents.CHECK_ROOM, handleCheckRoom); // Para que al reconectarse al socket se vuelva a hacer JOIN_ROOM
      socketState.socket.on(socketEvents.GET_SYNC, handleGetSync);
      socketState.socket.on(socketEvents.PAUSE, handlePause);
      socketState.socket.on(socketEvents.PLAY, handlePlay);
      socketState.socket.on(socketEvents.RECEIVE_MESSAGE, handleMessage);
      socketState.socket.on(socketEvents.SYNC_ON, handleSyncOn);
      socketState.socket.on(socketEvents.SYNC_OFF, handleSyncOff);
      socketState.socket.on(socketEvents.CHANGE_VIDEO, handleEventoChangeVideo);

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
        timestamp: null
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
        console.log('Success');
        //console.log('Success:', data);
        setUser(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleStateChange = async (event) => {
    //console.log('Evento:', event, ' by ', authState.id, 'ignoreStateChange:', ignoreStateChange.current, ' ignorePlay:', ignorePlay.current, ' ignorePause:', ignorePause.current, ' isEnabled:', isEnabled);
    if (event === 'playing') {
      // CASO ESPECIAL 1: Ya ha cargado el video y se requiere emitir un GET_SYNC para la sincronización
      if (emitirGetSync.current) {
        emitirGetSync.current = false;
        // Emitimos un evento GET_SYNC para que el otro usuario nos mande su tiempo
        console.log(authState.id, ' emitiendo evento GET_SYNC');
        socketState.socket.emit(socketEvents.GET_SYNC, socketState.idSala);
        return;
      }
      ignorarBugPause.current = false;  // Cuando se pone a play, ya no hay que tener en cuenta el bug de que se manden dos eventos de pause seguidos
      // CASO ESPECIAL 2: Ignorar play porque no lo ha hecho el usuario manualmente
      if (ignorePlay.current) {
        console.log('Ignorando evento de play by ', authState.id);
        ignorePlay.current = false;
        return;
      } else if (ignoreStateChange.current) { // Creo que no deberia darse nunca este caso
        console.log('\n\nALERTA Ignorando evento de PLAY IGNORESTATECHANGE by ', authState.id);
        ignoreStateChange.current = false;
        return;
      }
      // CASO NORMAL: El usuario ha dado al play manualmente o avanzado/retrocedido el video
      console.log('Playing: videoPlaying ', videoPlaying); // Deberia ser false siempre
      setVideoPlaying(true);
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
        console.log('Tiempo actual:', time, ' Tiempo guardado:', currentTime.current, ' Diferencia:', diff);
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
      if (!videoPlaying) {  // Si me llega un pause pero el video ya estaba pausado, significa que el usuario a avanzado o retrocedido
        if (isEnabled && idRoom.current != null && !ignorarBugPause.current) {
          // Mandamos un evento SYNC_ON para sincronizar
          // Obtenemos el tiempo actual del video
          const timesegundos = await playerRef.current?.getCurrentTime();
          // Enviamos el evento SYNC_ON para que el otro usuario se sincronice con nosotros
          console.log(' PAUSE: ', authState.id, ' enviando Sync on con idsala:', idRoom.current, ' idvideo:', socketState.idVideo, ' timesegundos:', timesegundos);
          socketState.socket.emit(
            socketEvents.SYNC_ON,
            idRoom.current,
            socketState.idVideo,
            timesegundos,
            true  // true porque ya se ha mandado un evento de pause antes
          );
          alert('¡Vídeo sincronizado con el otro usuario!');
        } else {
          console.log('Bug evitado o sincronizacion desactivada')
        }
        return;
      }
      // CASO NORMAL: El usuario ha pausado el video manualmente
      setVideoPlaying(false);
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
      // NOTA: el evento GET_SYNC se manda en el handleStateChange cuando nos hayamos asegurado de que ya se ha puesto a play el video
    } else {
      // Si soy el primer usuario en unirme a la sala
      // Por temas de sincronización, al cargar el reproductor hay que darle a play
      console.log('Reproductor listo, dandole a play');
      ignorePlay.current = true;
      setVideoPlaying(true);
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
          ref={playerRef}
          videoId={socketState.idVideo}
          height={'100%'}
          width={'95%'}
          webViewStyle={styles.Video}
          play={videoPlaying}
          onChangeState={handleStateChange}
          onReady={handleReady}
        />
        {/* <TouchableOpacity onPress={console.log("SocketState en video Screen: ", socketState)}>
          <Text>Console log</Text>
        </TouchableOpacity> */}
      </View>
      <View
        style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, flex: 0.15 }}
      >
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
    backgroundColor: '#2196F3'
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
