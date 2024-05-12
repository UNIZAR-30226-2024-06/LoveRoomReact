import * as React from 'react';
import SafeArea from './src/components/SafeArea';
import BottomTab from './src/components/BottomTab';
import { ScrollView } from 'react-native';
import Login from './src/screens/LoginScreen';
import { useEffect } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import StackNavigator from './src/components/StackNavigator';
import { AuthProvider } from './src/components/AuthContext';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <AuthProvider>
          <View
            style={{
              flex: 1
            }}
          >
            <StackNavigator />
            <Toast />
          </View>
    </AuthProvider>
  );
}
