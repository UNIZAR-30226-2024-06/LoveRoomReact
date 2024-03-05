import React from 'react';
import { Button, View, Text } from 'react-native';

export default function SettingsScreen({ navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Estamos en settings</Text>
      <Button
        onPress={() => navigation.navigate('Login')}
        title="Abrir cuenta"
      />
    </View>
  );
}

