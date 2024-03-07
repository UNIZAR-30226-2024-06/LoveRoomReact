import React, { useState } from "react";
import { View, TextInput, FlatList, Text, Image } from "react-native";
import YouTube from "react-native-youtube";
import axios from "axios";

const SearchBar = ({ onChangeText }) => (
  <TextInput placeholder="Search Youtube" onChangeText={onChangeText} />
);

const VideoItem = ({
  title,
  thumbnails: {
    medium: { url },
  },
}) => (
  <View>
    <Image source={{ uri: url }} style={{ width: 100, height: 50 }} />
    <Text>{title}</Text>
  </View>
);

const YoutubeSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedVideoId, setSelectedVideoId] = useState("");

  // Implement search function using Youtube Data API v3

  const handleSearch = async (text) => {
    // Call search function and update searchResults
    setSearchTerm(text);

    try {
      const response = await axios.get(
        // Peticion con cliente http axios
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            maxResults: 5,
            key: "AIzaSyBKqq-OFi0biVLa5BzILCQLf25OhMFnPQE",
            q: text,
          },
        }
      );

      setSearchResults(response.data.items);
    } catch (error) {
      console.error(error);
    }
  };

  const handleVideoPress = (videoId) => {
    setSelectedVideoId(videoId);
  };

  return (
    <View>
      <SearchBar onChangeText={handleSearch} />
      <FlatList
        data={searchResults}
        renderItem={({ item }) => (
          <VideoItem
            {...item}
            onPress={() => handleVideoPress(item.id.videoId)}
          />
        )}
        keyExtractor={(item) => item.id.videoId}
      />
      {selectedVideoId && (
        <YouTube
          videoId={selectedVideoId}
          controls={1}
          apiKey="AIzaSyBKqq-OFi0biVLa5BzILCQLf25OhMFnPQE" // Replace with your Youtube Data API v3 key
          style={{ height: 300 }}
        />
      )}
    </View>
  );
};

export default YoutubeSearch;
