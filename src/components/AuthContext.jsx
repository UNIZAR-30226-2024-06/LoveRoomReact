import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    id: null,
    token: null,
    correo: null,
    contrasena: null,
    nombre: null,
    sexo: null,
    edad: null,
    idLocalidad: null,
    buscaedadmin: null,
    buscaedadmax: null,
    buscasexo: null,
    fotoperfil: null,
    descripcion: null,
    tipousuario: null,
    baneado: false,
  });
  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log(token);
    fetch('http://192.168.1.29:5000/user/check/token', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.valido) {
          console.log('Token válido');
          setAuthState((prevState) => ({
            ...prevState,
            isLoggedIn: true,
            token: data.token,
          }));
        } else {
          console.log('Token inválido');
          setAuthState((prevState) => ({ ...prevState, isLoggedIn: false, token: null }));
          AsyncStorage.removeItem('token');
        }
      });
  };
  React.useEffect(() => {
    checkToken();
  }, []);

  return <AuthContext.Provider value={{ authState, setAuthState }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
