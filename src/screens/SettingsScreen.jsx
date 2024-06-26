import React from 'react';
import { Button, View, Text } from 'react-native';
import NotRegisteredScreen from './NotRegisteredScreen';
import AuthContext from '../components/AuthContext';

export default function SettingsScreen({ navigation }) {
  const { isRegistered } = React.useContext(AuthContext);

  if (!isRegistered) {
    return <NotRegisteredScreen />;
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Estamos en perfil</Text>
      <Button onPress={() => navigation.navigate('Login')} title="Abrir cuenta" />
    </View>
  );
}
