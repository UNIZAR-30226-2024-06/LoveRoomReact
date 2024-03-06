import React from 'react';
import { Button, View, Text } from 'react-native';
import NotRegisteredScreen from './NotRegisteredScreen';
import AuthContext from '../components/AuthContext';

export default function HomeScreen({ navigation}) {
  const {isRegistered} = React.useContext(AuthContext);

  if (!isRegistered) {
    return ( <NotRegisteredScreen />);
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Estamos en home</Text>
      <Button
        onPress={() => navigation.navigate('Cuenta')}
        title="Go to settings"
      />
    </View>
  );
}

