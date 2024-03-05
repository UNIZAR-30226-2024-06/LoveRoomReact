import React from 'react';
import { Button, View, Text } from 'react-native';

export default function HomeScreen({ navigation}) {
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

