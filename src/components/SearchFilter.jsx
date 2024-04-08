import React from 'react'
import { FlatList, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'




const SearchFilter = ({data, search, setListVideos, nextPageToken, setNextPageToken}) => {
    const navigation = useNavigation();

    const handlePeticionAux =() => {
        const params = new URLSearchParams({
            "key": "AIzaSyA12wmEob4dgLjW35ykIc76lrJsaJHx2JA",
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
            <FlatList data={data} 
                    keyExtractor={(item, index) => item.id.videoId + index}
                    renderItem={({item}) => {
                // if(item.snippet.title.toLowerCase().includes(search.toLowerCase())){
                    return (
                        <TouchableOpacity onPress={() => { navigation.navigate('Video', {videoId: item.id.videoId})}}>
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

export default SearchFilter;

const styles = StyleSheet.create({})