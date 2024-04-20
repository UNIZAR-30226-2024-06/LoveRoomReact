import React, { useEffect, useState, useContext } from 'react'
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { socketEvents } from './Socket';
import Socket from './Socket';
import AuthContext from './AuthContext';

const SearchFilter = ({data, search, setListVideos, nextPageToken, setNextPageToken}) => {
    const navigation = useNavigation();
    const [counter, setCounter] = useState(5);
    const [showModal, setShowModal] = useState(false);
    const [videoId, setVideoId] = useState('');
    const { authState } = useContext(AuthContext);
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        let intervalId;
        let count = 1;
        if (showModal && counter > 0) {
            intervalId = setInterval(() => {
                setCounter(counter => counter - 1);
            }, 1000);
        } else if (counter === 0) {
            clearInterval(intervalId);
            setShowModal(false);
            
            if(count && mensaje!="Error al buscar match, inténtalo de nuevo"){
                count = 0;
                navigation.navigate('Video', {videoId: videoId});
                alert(mensaje);
            } else if( count && mensaje=="Error al buscar match, inténtalo de nuevo"){
                alert(mensaje);
            }
        }

        return () => clearInterval(intervalId);
    }, [showModal, counter]);

    useEffect(() => {
        if (mensaje) {
            setShowModal(true);
        }
    }, [mensaje]);
        

    const buscarMatch = (videoId) => {
        setShowModal(true);
        setCounter(5);   
        fetchMatch(videoId);  
    }

    const fetchMatch = (videoId) => {
        console.log(authState.token)
        fetch(`${process.env.EXPO_PUBLIC_API_URL}/videos/watch/${videoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application',
                Authorization: `Bearer ${authState.token}`
            }
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            if(data.esSalaUnitaria==true){
                setMensaje("No hay nadie en la sala, ¡espera a que alguien entre!");
                setVideoId(videoId);
            }
            else if(data.esSalaUnitaria==false){
                // console.log("Sala con persona, ¡he hecho match!");
                setMensaje("Has hecho match con alguien, ¡disfruta la sala!");
                setVideoId(videoId);
            }
            else{
                setMensaje("Error al buscar match, inténtalo de nuevo");
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }


    const handlePeticionAux =() => {
        const params = new URLSearchParams({
            "key": "AIzaSyBr5DjVR2-rcywoSZ2Df2pmqDmS32_HVz4",
            "part": "id, snippet",
            "q": search,
            "type": "video",
            "pageToken": nextPageToken, // Aquí está el cambio
            "maxResults": 50,
        });
          console.log(params);
        fetch(
            `https://youtube.googleapis.com/youtube/v3/search?${params}`, {
                method: "GET",
            }
        )
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setListVideos(prevVideos => [...prevVideos, ...data.items]);
            setNextPageToken(data.nextPageToken);
            console.log(data.nextPageToken);
            // console.log(listVideos);
        });
    }

    if(search=== ""){
        return (
            <View style={{
                marginVertical: 10,
                paddingHorizontal: 50,
            }}>
                <Text style={{
                    fontSize: 14,
                    fontWeight: "bold",
                }}>
                    No matched results for your search
                </Text>
                {/* <Text style={{
                    borderColor:"gray",
                    borderWidth: 1,
                    height: 1,
                    marginTop: 5,
                }}/> */}
            </View>
        )
    }
    return (
        <View style={{
            marginTop: 10,
        }}>
            <Modal
                transparent={true}
                animationType={'none'}
                visible={showModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.activityIndicatorWrapper}>
                        <ActivityIndicator animating={showModal} size="large" color="#0000ff" />
                        <Text>Buscando match... {counter}</Text>
                    </View>
                </View>
            </Modal>
            <FlatList data={data} 
                    keyExtractor={(item, index) => item.id.videoId + index}
                    renderItem={({item}) => {
                // if(item.snippet.title.toLowerCase().includes(search.toLowerCase())){
                    return (
                        <TouchableOpacity onPress={() => { 
                            // navigation.navigate('Video', {videoId: item.id.videoId})
                                buscarMatch(item.id.videoId);

                            }}>
                            <View style={{
                                marginVertical: 10,
                            }}>
                                <View style={{
                                    flexDirection: "row",
                                }}>
                                    <Image source={{uri: item.snippet.thumbnails.default.url}} style={{
                                        width: item.snippet.thumbnails.default.width,
                                        height: item.snippet.thumbnails.default.height,
                                        borderRadius: 10,
                                        marginRight: 10,
                                    }}/>
                                    <View style={{flex: 1 }}>
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: "bold",
                                        }}
                                        >
                                            {item.snippet.title}
                                        </Text>
                                        <View style={{ flex: 1, justifyContent: 'flex-end'}}>
                                            <Text style={{
                                                fontSize: 10,
                                                // fontWeight: "italic",
                                            }}
                                            >
                                                Canal: {item.snippet.channelTitle}
                                            </Text>
                                            <Text style={{
                                                fontSize: 10,
                                                // fontWeight: "italic",
                                            }}
                                            >
                                                Fecha de publicación: {item.snippet.publishTime.slice(0, 10)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                                <Text style={{
                                        borderColor:"gray",
                                        borderWidth: 1,
                                        height: 1,
                                        marginTop: 5,
                                    }}/>
                            </View>
                        </TouchableOpacity>
                    )
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
