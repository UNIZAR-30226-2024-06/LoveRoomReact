import * as React from 'react';
import SafeArea from './src/components/SafeArea';
import BottomTab from './src/components/BottomTab';
import { ScrollView } from 'react-native';
import Login from './src/screens/LoginScreen';
import { View } from 'react-native';
import StackNavigator from './src/components/StackNavigator';
import {AuthProvider} from './src/components/AuthContext';
import { check } from 'prettier';

export default function App() {
  const [authState, setAuthState] = React.useState({
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
    const checkToken = async() => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        setAuthState(prevState => ({ ...prevState, isLoggedIn: true, token: token }));
      }
    };
    checkToken();
  }, []);

  return (
    <AuthProvider >
      <View
        style={{
          flex: 1,
        }}
      >
        <StackNavigator />
        {/*<ScrollView >
          < Login />
          <SafeArea />
      </ScrollView>*/}
      </View>
    </AuthProvider>
  );
}
