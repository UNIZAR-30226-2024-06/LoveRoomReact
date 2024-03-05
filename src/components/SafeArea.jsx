// import React from 'react';
// import { useDeviceOrientation } from '@react-native-community/hooks';
// import { SafeAreaView, Text, StyleSheet, Platform } from 'react-native';

// const {landscape} = useDeviceOrientation();
// console.log(landscape);
// //SafeAreaView se puede usar para ajustar el contenido en el dispositivo, es decir, para que en iOS el
// // Notch no nos tape el contenido ( mete un poco de padding automaticamente en el top)
// export default function SafeArea() {
//   const handlePress = () => console.log('Texto presionado');
//   return (
//     <SafeAreaView style={styles.container}>
//       <Text onPress={handlePress}> Prueba de G</Text>
//       <View 
//           style={{
//             backgroundColor: 'dodgerblue',
//             width: '100%',
//             height: landscape ? '100%' : '30%',
//             }}></View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//     container: {
//       flex: 1, //Vista flexible, se adapta horiontal y verticalmente para rellenar el espacio disponible
//       backgroundColor: 'dodgerblue',
//       paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0, //En Android el SafeAreaView no funciona, con esto lo ajustamos el tope
//     },
//   }
// )

