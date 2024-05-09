import * as React from 'react';
import SafeArea from './src/components/SafeArea';
import BottomTab from './src/components/BottomTab';
import { ScrollView } from 'react-native';
import Login from './src/screens/LoginScreen';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import StackNavigator from './src/components/StackNavigator';
import { AuthProvider } from './src/components/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              flex: 1
            }}
          >
            <StackNavigator />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </AuthProvider>
  );
}
