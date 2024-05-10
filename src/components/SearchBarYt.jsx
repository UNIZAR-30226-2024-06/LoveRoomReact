import { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator, FlatList, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import SearchFilter from './SearchFilter';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import AuthContext from '../components/AuthContext';
import { initializeSocket } from '../components/AuthContext';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const SearchBar = ({ setVideoUrl }) => {
  const { authState } = useContext(AuthContext);
  const navigation = useNavigation();
  const {socketState, setSocketState} = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [listVideos, setListVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [videosModal, setVideosModal] = useState(false);
  const [listVideosInterest, setListVideosInterest] = useState([]);
  const [loading, setLoading] = useState(true);

  const buscarMatch = async (videoId) => {
    setShowModal(true);
    initializeSocket(authState.token, setSocketState, socketState);
    await fetchMatch(videoId);
  };

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused && socketState.idVideo !== '') {
      navigation.navigate('Video');
    }
  }, [isFocused, socketState.idVideo]);

  const fetchMatch = async (videoId) => {
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/videos/watch/${videoId}`);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/videos/watch/${videoId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application',
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.esSalaUnitaria == true) {
          setSocketState((prevState) => ({
            ...prevState,
            idVideo: videoId,
            senderId: authState.id
          }));
          setShowModal(false);
          alert('No hay nadie viendo este vídeo, ¡espera a que alguien entre!');
        } else if (data.esSalaUnitaria == false) {
          // console.log("Sala con persona, ¡he hecho match!");
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
  

  const fetchVideoDetails = async (videoId, viewers) => {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.EXPO_PUBLIC_YT_KEY}&part=snippet`);
    const data = await response.json();
  
    // Extrae los detalles del video
    const videoDetails = data.items[0];
  
    // Crea un objeto con solo los detalles que necesitas
    const simplifiedDetails = {
      imageUrl: videoDetails.snippet.thumbnails.default.url,
      width : videoDetails.snippet.thumbnails.default.width,
      height : videoDetails.snippet.thumbnails.default.height,
      title: videoDetails.snippet.title,
      channel: videoDetails.snippet.channelTitle,
      publishedAt: videoDetails.snippet.publishedAt.slice(0, 10),
      viewers : viewers,
      videoId: videoId
    };
    console.log(simplifiedDetails);
    return simplifiedDetails;
  };
  
  const fetchMyVideos = async () => {
    console.log('Token: ', authState.token);
    console.log('AuthState Token:', authState.token);
    console.log('Fetching videos...');
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/videos/interest`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data);
        const videoDetailsPromises = data.map((video) => fetchVideoDetails(video.idvideo, video.viewers));
        const videosWithDetails = await Promise.all(videoDetailsPromises);
        setListVideosInterest(videosWithDetails);
        setLoading(false);
        console.log(videosWithDetails);
      }); 
  };


  useFocusEffect(
    useCallback(() => {
      console.log('Fetching interest videos...');
      setLoading(true);
      fetchMyVideos();
    }, [authState])
  );


  const handlePeticion = () => {
    setNextPageToken('');
    setListVideos([]);
    const params = new URLSearchParams({
      key: `${process.env.EXPO_PUBLIC_YT_KEY}`,
      part: 'id, snippet',
      q: search,
      type: 'video',
      maxResults: 50
    });
    console.log(params);
    fetch(`https://youtube.googleapis.com/youtube/v3/search?${params}`, {
      method: 'GET'
    })
      .then((response) => response.json())
      .then((data) => {
        setVideosModal(true);
        console.log(data);
        setListVideos((prevVideos) => [...prevVideos, ...data.items]);
        setNextPageToken(data.nextPageToken);
        console.log(data.nextPageToken);
        // console.log(listVideos);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando videos de interes...</Text>
      </View>
    );
  }
  return (
    <View
      style={{
        margin: 15,
        width: '90%'
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
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          width: '95%',
          backgroundColor: '#d9dbda',
          borderRadius: 10,
          alignItems: 'center'
        }}
      >
        <TouchableOpacity onPress={handlePeticion}>
          <Feather
            name="search"
            size={20}
            color="black"
            style={{ marginRight: 4, marginLeft: 1 }}
          />
        </TouchableOpacity>
        <TextInput
          value={search}
          onChangeText={(text) => setSearch(text)}
          onSubmitEditing={handlePeticion}
          placeholder="Search"
          style={{ fontSize: 15, width: '100%', padding: 0 }}
        />
      </View>
      <Modal transparent={true} animationType={'none'} visible={videosModal} onRequestClose={()=> {setVideosModal(false);setListVideos([])}}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
          <View
            style={{
              backgroundColor: 'white',
              width: '80%', // Controla el ancho del modal
              height: '80%', // Controla la altura del modal
              borderRadius: 20, // Añade bordes redondeados
              overflow: 'hidden'
            }}
          >
            <SearchFilter
              data={listVideos}
              search={search}
              setListVideos={setListVideos}
              nextPageToken={nextPageToken}
              setNextPageToken={setNextPageToken}
              setVideoUrl={setVideoUrl}
              videosInterest = {listVideosInterest}
              setVideosInterest = {setListVideosInterest}
            />
          </View>
          <View style={[styles.button, styles.buttonClose]}>
              <Icon
                name="close"
                type="ionicon"
                color="white"
                onPress={() => {
                  setVideosModal(false);
                  setListVideos([]);
                }}
              />
            </View>
        </View>
      </Modal>
      <FlatList
        data={listVideosInterest.filter((item) =>
          item.title.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item, index) => item.videoId + index}
        renderItem={({ item }) => {
          // if(item.snippet.title.toLowerCase().includes(search.toLowerCase())){
          return (
            <TouchableOpacity
              onPress={() => {
                // navigation.navigate('Video', {videoId: item.id.videoId})
                if (setVideoUrl == null) {
                  buscarMatch(item.videoId);
                } else {
                  setVideoUrl(item.videoId);
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
                    source={{ uri: item.imageUrl }}
                    style={{
                      width: item.width,
                      height: item.height,
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
                      {item.title}
                    </Text>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                      <Text
                        style={{
                          fontSize: 10
                          // fontWeight: "italic",
                        }}
                      >
                        Canal: {item.channel}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10
                          // fontWeight: "italic",
                        }}
                      >
                        Fecha de publicación: {item.publishedAt}
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
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 10
  },
  buttonClose: {
    backgroundColor: 'red'
  }, loadingContainer: {
    flex: 1,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center'
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


export default SearchBar;
