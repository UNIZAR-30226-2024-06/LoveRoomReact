import React from 'react';
import { Button, View, Text } from 'react-native';

export default function SettingsScreen({ navigation, route }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>{route.params.title}</Text>
      <Button
        onPress={() => navigation.openDrawer()}
        title="Abrir menú"
      />
    </View>
  );
}

