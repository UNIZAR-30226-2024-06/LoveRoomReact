import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { socketEvents } from '../constants/SocketConstants';
class Socket {
  constructor() {
    this.socket = null;
  }

  async connect() {
    const token = await AsyncStorage.getItem('token'); 
    console.log(token);

    this.socket = io(`${process.env.EXPO_PUBLIC_API_URL}`, {
      auth: {
        token: `Bearer ${token}`
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to socket');
    });

  }

  async waitForMatch(setSenderId, setReceiverId, setIdVideo, setIsPlaying) {
    console.log('Waiting for match');
      this.socket.on(socketEvents.MATCH, (data) => {
        console.log('Match found', data);
        setSenderId(data.senderId);
        setReceiverId(data.receiverId);
        setIdVideo(data.idVideo);
        setIsPlaying(false);
      });
  }

  



  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      console.log('Disconnected from server');
    }
  }
}

export default new Socket();