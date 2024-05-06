import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import { socketEvents } from '../constants/SocketConstants';

const AuthContext = React.createContext();

// Inicializa el socket con el token del usuario
export const initializeSocket = async(token, setSocketState, socketState) => {
  let newSocket = socketState.socket;
  let isSocketInitialized = false; // Bandera para controlar si el socket está inicializado

  if (newSocket == null) {
    console.log('Initializing socket');
    newSocket = io(`${process.env.EXPO_PUBLIC_API_URL}`, {
      auth: {
        token: `Bearer ${token}`
      }
    });

    await setSocketState((prevState) => ({
      ...prevState,
      socket: newSocket,
    }));

    newSocket.on('connect', () => {
      console.log('Connected to socket');
      isSocketInitialized = true;
      newSocket.on(socketEvents.MATCH, (senderId, receiverId, idSala, idVideo) => {
        console.log('Match event received: ', receiverId, senderId, idSala, idVideo);
        setSocketState((prevState) => ({
          ...prevState,
          senderId: receiverId,
          receiverId: senderId,
          idSala: idSala.toString(),
          idVideo: idVideo,
          matchRecibido: true
        }));
        alert('Has hecho match con alguien, ¡disfruta la sala!');
      });
    });
  } else if (!newSocket.connected) {
    console.log('Socket already initialized but not connected, reconnecting...');
    await newSocket.connect();
    isSocketInitialized = true; // Establecer la bandera en true cuando el socket esté completamente inicializado
  } else {
    console.log('Socket already initialized and connected');
    isSocketInitialized = true; // Establecer la bandera en true cuando el socket esté completamente inicializado
  }

  return { isSocketInitialized }; // Devolver el socket y la bandera
};

export const AuthProvider = ({ children }) => {
  // useState se utiliza para definir y gestionar el estado local en componentes de función.
  // Recibe un valor inicial como argumento y devuelve un array con dos elementos: el estado actual y una función para actualizar ese estado.
  // Cuando se llama a seAuthState,react re-renderiza el componente AuthProvider y actualiza el valor de authState
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    id: null,
    token: null,
    correo: null,
    contrasena: null,
    nombre: null,
    sexo: null,
    fechanacimiento: null,
    idlocalidad: null,
    buscaedadmin: null,
    buscaedadmax: null,
    buscasexo: null,
    fotoperfil: null,
    descripcion: null,
    tipousuario: null,
    baneado: false
  });
  console.log(authState);

  const [socketState, setSocketState] = useState({
    socket: null,
    senderId: authState.id,
    receiverId: '',
    idVideo: '',
    idSala: '',
    matchRecibido: false
  });

  // Función asincrónica que se encarga de verificar si hay un token de autenticación almacenado en AsyncStorage y si es válido.
  // Luego, actualiza el estado de autenticación en consecuencia.
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token'); // Obtiene el token de autenticación almacenado en AsyncStorage
    console.log(token);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/check/token`, {
      // Realiza una petición al servidor para verificar si el token es válido
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => response.json()) // Convierte la respuesta del servidor en un objeto JSON
      .then((data) => {
        console.log(data);
        if (data.valido) {
          console.log('Token válido');
          setAuthState((prevState) => ({
            // Actualiza el estado de autenticación con el token y otros datos del usuario
            ...prevState,
            isLoggedIn: true,
            token: token,
            id: data.usuario.id,
            correo: data.usuario.correo,
            contrasena: data.usuario.contrasena,
            nombre: data.usuario.nombre,
            sexo: data.usuario.sexo,
            edad: data.usuario.edad,
            idlocalidad: data.usuario.idlocalidad,
            buscaedadmin: data.usuario.buscaedadmin,
            buscaedadmax: data.usuario.buscaedadmax,
            buscasexo: data.usuario.buscasexo,
            fotoperfil: data.usuario.fotoperfil,
            descripcion: data.usuario.descripcion,
            tipousuario: data.usuario.tipousuario,
            baneado: data.usuario.baneador
          }));
          // fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/check/token`,{
          //   method: 'GET',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     Authorization: `Bearer ${token}`
          //   }
          // });
        } else {
          console.log('Token inválido');
          setAuthState((prevState) => ({ ...prevState, isLoggedIn: false, token: null }));
          AsyncStorage.removeItem('token');
        }
      });
  };

  //  useEffect se utiliza para llamar a la función checkToken después de que el componente se haya renderizado por primera vez.
  React.useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState, socketState, setSocketState }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
