import React, {useState} from 'react';

const AuthContext = React.createContext();

export const AuthProvider = ({children}) => {
    const [authState, setAuthState] = useState({
        userName: null,
        sessionId: null,
        email: null,
        birthDate: null,
        gender: null,
        agePreference: null,
        genderPreference: null,
        profilePicture: null,
    });


    return (
        <AuthContext.Provider value={{authState, setAuthState}}>
            {children}
        </AuthContext.Provider>
    );
};


export default AuthContext;
