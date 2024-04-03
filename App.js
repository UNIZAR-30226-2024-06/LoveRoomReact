import * as React from 'react';
import SafeArea from './src/components/SafeArea';
import BottomTab from './src/components/BottomTab';
import { ScrollView } from 'react-native';
import Login from './src/screens/LoginScreen';
import { View } from 'react-native';
import StackNavigator from './src/components/StackNavigator';
import { AuthProvider } from './src/components/AuthContext';
import { check } from 'prettier';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from './src/components/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <View
        style={{
          flex: 1,
        }}
      >
        <StackNavigator />
      </View>
    </AuthProvider>
  );
}
