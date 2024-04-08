// VideoScreen.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import YouTubeIframe from 'react-native-youtube-iframe'

const VideoScreen = ({ route }) => {
  const { videoId } = route.params;

  return (
    <View style={{flex : 1, alignContent: 'center', alignItems:'center'}}>
        <YouTubeIframe videoId={videoId} height={220} width={'100%'} style={styles.Video} />
      </View>
  );
};

export default VideoScreen;

const styles = StyleSheet.create({
    Video: {
        marginVertical: 20,
        height: '100%',
        flex: 1,
        width: '90%',
        justifyContent: 'center',
        alignItems: 'center'
    }
    }); 
