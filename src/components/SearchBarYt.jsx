import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchFilter from './SearchFilter';




const SearchBar = () => {
  const [search, setSearch] = useState("");
  const [listVideos, setListVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState("");

    // useEffect(() => {
    //    setListVideos([]);
    // }, [search]);

    const handlePeticion =() => {
        setNextPageToken("");
        setListVideos([]);
        const params = new URLSearchParams({
            "key": "AIzaSyBr5DjVR2-rcywoSZ2Df2pmqDmS32_HVz4",
            "part": "id, snippet",
            "q": search,
            "type": "video",
            "pageToken": nextPageToken,
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
  console.log(search);
  return (
    <View 
      style={{
        margin: 15,
        width: "90%",
      }}
    >
        <View 
            style={{ 
                flexDirection: "row", 
                padding: 10,
                width: "95%",
                backgroundColor: "#d9dbda",
                borderRadius: 10,
                alignItems: "center",
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
                placeholder="Search"
                style={{ fontSize: 15, width: "100%", padding: 0}}
            />
        </View>
        <SearchFilter data={listVideos} search={search} setListVideos={setListVideos} nextPageToken={nextPageToken} setNextPageToken={setNextPageToken}/>
    </View>
  );
};

export default SearchBar;
