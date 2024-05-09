import { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import SearchFilter from './SearchFilter';
import { StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import AuthContext from '../components/AuthContext';

const SearchBar = ({ setVideoUrl }) => {
  const { authState } = useContext(AuthContext);
  const [search, setSearch] = useState('');
  const [listVideos, setListVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [listVideosInterest, setListVideosInterest] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyVideos = async () => {
    const token = authState.token;
    console.log('Fetching videos...');
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/videos/interest`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setListVideosInterest(data);
        setLoading(false);
      }); 
  };


  useFocusEffect(
    useCallback(() => {
      console.log('Fetching interest videos...');
      setLoading(true);
      fetchMyVideos();
    }, [])
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
        setShowModal(true);
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
      <Modal transparent={true} animationType={'none'} visible={showModal} onRequestClose={()=> {setShowModal(false);setListVideos([])}}>
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
            />
          </View>
          <View style={[styles.button, styles.buttonClose]}>
              <Icon
                name="close"
                type="ionicon"
                color="white"
                onPress={() => {
                  setShowModal(false);
                  setListVideos([]);
                }}
              />
            </View>
        </View>
      </Modal>
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
});


export default SearchBar;
