import React, { useEffect, useState, useContext } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator
} from 'react-native';
import { socketEvents } from '../constants/SocketConstants';
import { initializeSocket } from './AuthContext';
import AuthContext from './AuthContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';

// Muestra los videos resultados de la búsqueda
// Además, si se clica en un video, comprueba que se realice el match
// y en caso efectivo se redirige a la sala de video
const SearchFilter = ({
  data,
  search,
  setListVideos,
  nextPageToken,
  setNextPageToken,
  setVideoUrl
}) => {
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false); // Para la espera al cargar
  const { authState } = useContext(AuthContext);
  const { socketState, setSocketState } = useContext(AuthContext);
  const token = authState.token;
  const [mensaje, setMensaje] = useState('');

  const buscarMatch = async (videoId) => {
    setShowModal(true);
    initializeSocket(token, setSocketState, socketState);
    await fetchMatch(videoId);
  };

  const fetchMatch = async (videoId) => {
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/videos/watch/${videoId}`);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/videos/watch/${videoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application',
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.esSalaUnitaria == true) {
          setMensaje('No hay nadie viendo este vídeo, ¡espera a que alguien entre!');
          setSocketState((prevState) => ({
            ...prevState,
            idVideo: videoId,
            senderId: authState.id
          }));
          setShowModal(false);
          alert('No hay nadie viendo este vídeo, ¡espera a que alguien entre!');
        } else if (data.esSalaUnitaria == false) {
          // console.log("Sala con persona, ¡he hecho match!");
          setMensaje('Has hecho match con alguien, ¡disfruta la sala!');
          setSocketState((prevState) => ({
            ...prevState,
            idVideo: videoId,
            senderId: authState.id,
            receiverId: data.idusuario,
            idSala: data.idsala.toString()
          }));
          setShowModal(false);
          alert('Has hecho match con alguien, ¡disfruta la sala!');
        } else if (data.message == '404 Not Found') {
          setShowModal(false);
          alert('Error al buscar match, inténtalo de nuevo');
        } else {
          setShowModal(false);
          alert('Error al buscar match, inténtalo de nuevo');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && socketState.idVideo !== '') {
      navigation.navigate('Video');
    }
  }, [isFocused, socketState.idVideo]);

  const handlePeticionAux = () => {
    const params = new URLSearchParams({
      key: `${process.env.EXPO_PUBLIC_YT_KEY}`,
      part: 'id, snippet',
      q: search,
      type: 'video',
      pageToken: nextPageToken, // Aquí está el cambio
      maxResults: 50
    });
    console.log(params);
    fetch(`https://youtube.googleapis.com/youtube/v3/search?${params}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setListVideos((prevVideos) => [...prevVideos, ...data.items]);
        setNextPageToken(data.nextPageToken);
        console.log(data.nextPageToken);
        // console.log(listVideos);
      });
  };

  if (search === '') {
    return (
      <View
        style={{
          marginVertical: 10,
          paddingHorizontal: 50
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontWeight: 'bold'
          }}
        >
          No matched results for your search
        </Text>
        {/* <Text style={{
                    borderColor:"gray",
                    borderWidth: 1,
                    height: 1,
                    marginTop: 5,
                }}/> */}
      </View>
    );
  }
  return (
    <View
      style={{
        padding: 10
      }}
    >
      <Modal transparent={true} animationType={'none'} visible={showModal}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={showModal} size="large" color="#0000ff" />
            <Text>Buscando match... </Text>
          </View>
        </View>
      </Modal>
      <FlatList
        data={data.filter((item) =>
          item.snippet.title.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item, index) => item.id.videoId + index}
        renderItem={({ item }) => {
          // if(item.snippet.title.toLowerCase().includes(search.toLowerCase())){
          return (
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('Video', {videoId: item.id.videoId})
                if (setVideoUrl == null) {
                  buscarMatch(item.id.videoId);
                } else {
                  setVideoUrl(item.id.videoId);
                }
              }}
            >
              <View
                style={{
                  marginVertical: 10
                }}
              >
                <View
                  style={{
                    flexDirection: 'row'
                  }}
                >
                  <Image
                    source={{ uri: item.snippet.thumbnails.default.url }}
                    style={{
                      width: item.snippet.thumbnails.default.width,
                      height: item.snippet.thumbnails.default.height,
                      borderRadius: 10,
                      marginRight: 10
                    }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: 'bold'
                      }}
                    >
                      {item.snippet.title}
                    </Text>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                      <Text
                        style={{
                          fontSize: 10
                          // fontWeight: "italic",
                        }}
                      >
                        Canal: {item.snippet.channelTitle}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10
                          // fontWeight: "italic",
                        }}
                      >
                        Fecha de publicación: {item.snippet.publishTime.slice(0, 10)}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text
                  style={{
                    borderColor: 'gray',
                    borderWidth: 1,
                    height: 1,
                    marginTop: 5
                  }}
                />
              </View>
            </TouchableOpacity>
          );
          // }
        }}
        onEndReached={handlePeticionAux}
        onEndReachedThreshold={0.5}
      />
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
  }
});

export default SearchFilter;
