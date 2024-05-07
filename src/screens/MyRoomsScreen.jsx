import React, { useEffect, useState, useContext } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AuthContext, { initializeSocket } from '../components/AuthContext';
import NotRegisteredScreen from './NotRegisteredScreen';

const MyRoomsScreen = () => {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);
  const { socketState, setSocketState } = useContext(AuthContext);
  const [viewModal, setViewModal] = useState(false);
  const token = authState.token;
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Fetching rooms...');
      if (authState.isLoggedIn || authState.token != null) {
        fetchMyRooms();
      }
    }, [])
  );

  const fetchMyRooms = async () => {
    setLoading(true);
    try {
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
      const { isSocketInitialized } = await initializeSocket(token, setSocketState, socketState);

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

  if (!authState.isLoggedIn || authState.token == null) {
    return <NotRegisteredScreen />;
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando salas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Modal transparent={true} animationType={'none'} visible={viewModal}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={viewModal} size="large" color="#0000ff" />
            <Text>Cargando Sala... </Text>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        onPress={() => {
          console.log(socketState);
        }}
      >
        <Text>Socket state</Text>
      </TouchableOpacity>
      <FlatList
        data={myRooms}
        keyExtractor={(item) => item.idsala.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              handleRoomUseless(item);
            }}
          >
            <View style={styles.roomItem}>
              <Image
                source={{ uri: thumbnails[item.idvideo] }}
                style={[styles.thumbnail, { width: width, height: height }]}
              />
              <Text style={styles.roomTitle}>{item.nombre}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
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
    alignItems: 'center'
  },
  roomTitle: {
    fontSize: 16,
    fontWeight: 'bold'
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
  }
});

export default MyRoomsScreen;
