import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoggedIn: false,
    userName: null,
    token: null,
    email: null,
    birthDate: null,
    gender: null,
    agePreference: null,
    genderPreference: null,
    profilePicture: null,
  });

  React.useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      console.log(token);
      if (token) {
        setAuthState((prevState) => ({ ...prevState, isLoggedIn: true, token: token }));
      }
    };
    checkToken();
  }, []);

  return <AuthContext.Provider value={{ authState, setAuthState }}>{children}</AuthContext.Provider>;
};

export default AuthContext;
