// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import AuthContext from './AuthContext';
// import { socketEvents } from '../constants/SocketConstants';

// // Crear el contexto SocketContext
// const SocketContext = createContext();
// // Inicializa el socket con el token del usuario
// export const initializeSocket = async (token, setSocketState) => {
//   const newSocket = io(`${process.env.EXPO_PUBLIC_API_URL}`, {
//     auth: {
//       token: `Bearer ${token}`
//     }
//   });

//   await setSocketState(() => ({socket: newSocket, senderId: "", receiverId: "", idVideo: "", isPlaying: false}));

//   newSocket.on('connect', () => {
//     console.log('Connected to socket');
//     newSocket.on(socketEvents.MATCH, (senderId,receiverId, videoId) => {
//       console.log('Match event received: ', receiverId, senderId, videoId);
//       setSocketState(() => ({socket: socketState.socket, senderId: senderId, receiverId: receiverId, idVideo: videoId }));
//   });
//   });

// };

// export const SocketProvider = ({ children }) => {

//   return (
//     <SocketContext.Provider value={{ socketState, setSocketState }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export default SocketContext;
