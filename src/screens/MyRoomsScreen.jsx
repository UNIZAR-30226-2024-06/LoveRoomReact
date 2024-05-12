import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  Alert,
  Dimensions, TextInput, Button
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AuthContext, { initializeSocket } from '../components/AuthContext';
import NotRegisteredScreen from './NotRegisteredScreen';
import { Icon } from 'react-native-elements';
import Toast from 'react-native-toast-message';

const MyRoomsScreen = () => {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const { socketState, setSocketState } = useContext(AuthContext);
  const [viewModal, setViewModal] = useState(false);
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);


  useFocusEffect(
    React.useCallback(() => {
      console.log('Fetching rooms...');
      console.log('Auth state token:', authState.token);
      if (authState.isLoggedIn || authState.token != null) {
        fetchMyRooms();
      }
    }, [authState])
  );

  useEffect(() => {
    const onChange = () => {
      fetchMyRooms();
    };

    const func = Dimensions.addEventListener('change', onChange);
    return () => func?.remove();
  }, [authState]);

  const handleDeleteRoom = async (roomId) => {
    console.log('Deleting room:', roomId);
    Alert.alert(
      'Eliminar sala',
      '¿Seguro que quieres eliminar esta sala?\n¡Perderás tu match!',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        { text: 'OK', onPress: () => deleteRoom(roomId) }
      ],
      { cancelable: false }
    );
  };

  const deleteRoom = async (roomId) => {
    try {
      // Realizar la petición para eliminar la sala utilizando roomId
      console.log('Token:', authState.token);
      console.log('Room ID:', roomId);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState.token}`
        }
      });

      // Eliminar la sala de la lista
      const data = await response.json();
      console.log(data);
      if (data.message === 'Sala eliminada correctamente') {
        const updatedRooms = myRooms.filter((room) => room.idsala !== roomId);
        setMyRooms(updatedRooms);
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error al eliminar la sala',
          text2: 'Ha habido un error al eliminar la sala. Por favor, inténtelo de nuevo.',
          visibilityTime: 2500
        });
      }
    } catch (error) {
      console.error('Error al eliminar la sala:', error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error al eliminar la sala',
        text2: 'Ha habido un error al eliminar la sala. Por favor, inténtelo de nuevo.',
        visibilityTime: 2500
      });
    }
    console.log('Eliminando sala:', roomId);
  };

  const fetchMyRooms = async () => {
    setLoading(true);
    try {
      console.log('Token:', authState.token);
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/rooms`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState.token}`
        }
      });
      const data = await response.json();
      console.log(data);
      setMyRooms(data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAndProceed = async () => {
      const { isSocketInitialized } = await initializeSocket(authState.token, setSocketState, socketState);

      // Esperar hasta que el socket esté completamente inicializado antes de continuar
      if (isSocketInitialized) {
        // Realizar las acciones que dependen del socket completamente inicializado
        console.log('Socket initialized, proceeding with further actions...');
        setTimeout(() => {
          console.log('Navigating to Video...');
          setViewModal(false);
          navigation.navigate('Video');
        }, 3000);
      } else {
        console.log('Socket is not yet initialized, waiting...');
      }
    };

    console.log('View modal:', viewModal);
    if (viewModal) {
      initializeAndProceed();
    }
  }, [viewModal, socketState.socket]);

  const handleRoomUseless = async (room) => {
    console.log('Socket state:', socketState.socket);
    console.log('Room:', room);
    await setSocketState((prevState) => ({
      ...prevState,
      idSala: room.idsala,
      receiverId: room.idusuariomatch,
      idVideo: room.idvideo,
      senderId: authState.id
    }));
    setViewModal(true);
  };

  const fetchVideoInfo = async (videoId) => {
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.EXPO_PUBLIC_YT_KEY}&part=snippet`
      );
      const data = await response.json();
      if (data.items.length > 0) {
        console.log(data.items[0].snippet.thumbnails.default.url);
        setHeight(data.items[0].snippet.thumbnails.default.height);
        setWidth(data.items[0].snippet.thumbnails.default.width);
        return data.items[0].snippet.thumbnails.default.url.toString();
      } else {
        console.error('No se encontraron miniaturas para el video:', videoId);
        return ''; // Devolver una cadena vacía en caso de que no haya miniaturas
      }
    } catch (error) {
      console.error('Error al obtener información del video:', error);
      return ''; // Devolver una cadena vacía en caso de error
    }
  };

  const [thumbnails, setThumbnails] = useState({});

  useEffect(() => {
    const fetchThumbnails = async () => {
      const newThumbnails = { ...thumbnails };
      for (const room of myRooms) {
        if (!newThumbnails[room.idvideo]) {
          newThumbnails[room.idvideo] = await fetchVideoInfo(room.idvideo);
        }
      }
      setThumbnails(newThumbnails);
      console.log(newThumbnails);
    };
    if (myRooms.length > 0) {
      fetchThumbnails();
    }
  }, [myRooms]);

  const [modalVisible, setModalVisible] = useState(false);
  const inputValue = useRef('');
  const idSala = useRef('');

  const handleChangeNameVideo = (room) => {
    console.log('Cambiando nombre del video:', room);
    setModalVisible(true);
    idSala.current = room.idsala;
  };
  
  const handleConfirm = async () => {
    if (inputValue.current !== '' && idSala.current !== '') {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/rooms/${idSala.current}/rename`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authState.token}`
          },
          body: JSON.stringify({ nombreSala: inputValue.current })
        });
        const data = await response.json();
        console.log(data);
        if (data.error == null) {
          const updatedRooms = myRooms.map((r) => (
            r.idsala === idSala.current ? { ...r, nombre: inputValue.current } : r
          
          ));
          setMyRooms(updatedRooms);
        } else {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error al cambiar el nombre',
            text2: 'Ha habido un error al cambiar el nombre del video. Por favor, inténtelo de nuevo.',
            visibilityTime: 2500
          });
        }
      } catch (error) {
        console.error('Error al cambiar el nombre del video:', error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error al cambiar el nombre',
          text2: 'Ha habido un error al cambiar el nombre del video. Por favor, inténtelo de nuevo.',
          visibilityTime: 2500
        });
      }
    }
    idSala.current = '';  
    setModalVisible(false);
  };



  if (!authState.isLoggedIn || authState.token == null) {
    return <NotRegisteredScreen />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F89F9F" />
        <Text>Cargando salas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal transparent={true} animationType={'none'} visible={viewModal}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={viewModal} size="large" color="#F89F9F" />
            <Text>Cargando Sala... </Text>
          </View>
        </View>
      </Modal>
      <SwipeListView
        data={myRooms}
        keyExtractor={(item) => item.idsala.toString()}
        renderItem={({ item }) => (
          <View style={{marginBottom:10, borderWidth: 2, borderRadius: 20, borderColor: "#F89F9F"}}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                handleRoomUseless(item);
              }}
            >
              <View style={styles.roomItem}>
                <Image
                  source={{ uri: thumbnails[item.idvideo] }}
                  style={[styles.thumbnail, { width: width || 120, height: height || 90 }]}
                />
                <View style={{ flexDirection: 'column', alignItems: 'center', flex: 1, padding: 10}}>
                    <Text style={styles.roomTitle}>{item.nombre}</Text>
                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'gray', borderRadius:20, justifyContent: 'space-between', alignSelf: 'stretch'}}
                    onPress={()=> handleChangeNameVideo(item)}>
                      <Text style={{padding: 10}}>Editar nombre</Text>
                      <Icon style={{padding:10, }} name="edit" size={20} color="#000" />
                    </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.rowBack}>
            <TouchableOpacity
              style={[styles.backRightBtn, styles.backRightBtnRight]}
              onPress={() => {
                console.log(item);
                handleDeleteRoom(item.idsala);
              }}
            >
              <Icon name="trash" size={30} type="font-awesome" color="#FFF" />
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-75}
        leftOpenValue={-75}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={{...styles.input, padding: 10}}
              value={inputValue}
              onChangeText={(text)=> inputValue.current = text}
              placeholder='Introduce el nuevo nombre del video'
            
            />
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <TouchableOpacity style={{...styles.button, marginRight: 10, backgroundColor: '#DFF0D8'}} onPress={handleConfirm}>
                <Text style={styles.textStyle}>Aceptar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{...styles.button, marginLeft: 10, backgroundColor: '#F89F9F'}} onPress={() => setModalVisible(false)}>
                <Text style={styles.textStyle}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  roomItem: {
    padding: 10,
    
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10
  },
  thumbnail: {
    marginLeft: 10
  },
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
  backTextWhite: {
    color: '#FFF'
  },
  // rowFront: {
  //   alignItems: 'center',
  //   borderBottomColor: 'black',
  //   borderBottomWidth: 4,
  //   justifyContent: 'flex-end',
  //   height: 50,
  //   borderRadius: 20
  // },
  rowBack: {
    alignItems: 'flex-end',
    flex: 1,
    paddingLeft: 15,
    borderRadius: 20,
    backgroundColor: '#F89F9F',
    width: '100%',
    marginBottom: 10
  },
  backRightBtn: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 30,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20
  }, 
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    width: '100%'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    marginTop: 5,
  },
  textStyle: {
    color:  "#505050",
    fontWeight: "bold",
    textAlign: "center", 
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 20,
  }
});

export default MyRoomsScreen;
