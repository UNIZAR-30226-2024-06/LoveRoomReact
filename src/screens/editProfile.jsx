import React, { useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function EditProfileScreen() {
    const scrollViewRef = useRef(null); // Referencia a ScrollView

    const handleScroll = (event) => {
      const { y } = event.nativeEvent.contentOffset;
      if (y < 0) {
        // Si el usuario intenta desplazarse hacia abajo, establecer el desplazamiento en 0
        scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
      }
    };


  return (
    <ScrollView
        style={styles.container}
        ref={scrollViewRef}
        scrollEventThrottle={16} // Controla con qué frecuencia se llamará al evento onScroll
        onScroll={handleScroll} // Manejador para el evento de desplazamiento
    >
        <View style={styles.header} />
        <View style={styles.profileInfo}>
        <Text style={styles.profileText}>Editar perfil</Text>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageBorder}>
            <Image
              source={require('../img/profileImage.jpg')} // Ruta de la imagen de perfil
              style={styles.profileImage}
            />
          </View>
        </View>
        </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Fondo blanco
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    height: screenHeight * 0.273,
    backgroundColor: '#F89F9F',
  },
  profileInfo: {
    flex: 1,
    alignItems: 'center',
    marginTop: -screenHeight * 0.20,
  },
  profileText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    marginTop: 6,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
});

