import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar"
import Constants from "expo-constants"
import { StyleSheet, Text, View } from "react-native"
import * as Device from 'expo-device';

export default function App() {
  const [deviceName, setDeviceName] = useState('');

  useEffect(() => {
    async function getDeviceName() {
      const modelName = await Device.modelName;
      setDeviceName(modelName);
    }

    getDeviceName();
  }, []);

  const platformMessage = Constants.platform.ios ? `Estoy en iOS, dispositivo ${deviceName}` : `Estoy en Android, dispositivo ${deviceName}`;

  return (
    <View style={styles.container}>
      <Text>{platformMessage}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
