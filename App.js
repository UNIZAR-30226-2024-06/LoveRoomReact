import * as React from 'react';
import SafeArea from './src/components/SafeArea';
import DrawerContent from './src/components/DrawerContent';
import { View } from 'react-native';

//SafeAreaView se puede usar para ajustar el contenido en el dispositivo, es decir, para que en iOS el Notch no nos tape el contenido ( mete un poco de padding automaticamente en el top).
//Con console.log(Dimensions.get('screen')) podemos ver las dimensiones de la pantalla del dispositivo para ajustar widths, heights, etc.


export default function App() {
  return (
    <View style={{flex: 1}}>
      <DrawerContent />
      <SafeArea />
    </View>
  );
}

