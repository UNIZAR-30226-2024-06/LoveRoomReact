import React, { useEffect, useState, useContext } from 'react';
import { FlatList, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AuthContext from '../components/AuthContext';
import NotRegisteredScreen from './NotRegisteredScreen';

const MyRoomsScreen = () => {
  const navigation = useNavigation();
  const { authState } = useContext(AuthContext);

  if(!authState.isLoggedIn || authState.token == null) {
    return (
        <NotRegisteredScreen />
    );
    }
  const token = authState.token;
  const [myRooms, setMyRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      fetchMyRooms();
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

  const handleRoomPress = (roomId) => {
    // Navegar a la pantalla de la sala con el ID de la sala seleccionada
    // navigation.navigate('RoomScreen', { roomId });
  };

  const fetchVideoInfo = async (videoId) => {
    try {
      const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.EXPO_PUBLIC_YT_KEY}&part=snippet`);
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
      
        fetchThumbnails();
      }, [myRooms]);

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
      <FlatList
        data={myRooms}
        keyExtractor={(item) => item.idsala.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleRoomPress(item.idsala)}>
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
  }
});

export default MyRoomsScreen;
