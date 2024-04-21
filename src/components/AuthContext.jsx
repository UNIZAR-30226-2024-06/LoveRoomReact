import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = React.createContext();

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
    idLocalidad: null,
    buscaedadmin: null,
    buscaedadmax: null,
    buscasexo: null,
    fotoperfil: null,
    descripcion: null,
    tipousuario: null,
    baneado: false
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
    <AuthContext.Provider value={{ authState, setAuthState }}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
