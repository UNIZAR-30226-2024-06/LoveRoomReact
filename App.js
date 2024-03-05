import * as React from 'react';
//import SafeArea from './src/components/SafeArea';
import DrawerContent from './src/components/DrawerContent';
import { View } from 'react-native';
import Login from './src/screens/Login';

export default function App() {
  return (
    <View style={{flex: 1}}>
      {/* <DrawerContent /> */}
      < Login />
      {/*<SafeArea /> */}
    </View>
  );
}

