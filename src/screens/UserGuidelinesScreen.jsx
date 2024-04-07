import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function UserGuidelinesScreen({ navigation }) {
  const scrollViewRef = React.useRef(null); // Referencia a ScrollView

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
      <View style={styles.header}>
        {/* <View style={styles.logo}> */}
        {/* <View style={styles.logoImageContainer}> */}
        {/* <View style={styles.logoImageBorder}> */}
        <Image
          source={require('../img/logo.png')} // Ruta de la imagen de perfil
          style={styles.logoImage}
        />

        {/* </View> */}
        {/* </View> */}
      </View>
      <View style={styles.headlineContainer}>
        <Text style={styles.profileText}>Reglamento de Usuario</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {
            'Desde LoveRoom queremos permitir que todos los usuarios disfruten de una experiencia segura y agradable. \n\nPor ello, es importante que todos los usuarios sigan las siguientes reglas: \n'
          }
        </Text>
        <Text style={styles.listItem}>1. No se permite el uso de lenguaje ofensivo.</Text>
        <Text style={styles.listItem}>2. No se permite el uso de contenido inapropiado.</Text>
        <Text style={styles.listItem}>3. No se permite el uso de contenido violento.</Text>
        <Text style={styles.listItem}>4. No se permite el uso de contenido sexual.</Text>
        <Text style={styles.listItem}>5. No se permite el uso de contenido discriminatorio.</Text>
        <Text style={styles.listItem}>
          6. No se permite el uso de contenido que incite al odio.
        </Text>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // TODO: handleRegister();
          navigation.navigate('Cuenta');
        }}
      >
        <Text style={styles.buttonText}>Aceptar y continuar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    height: screenHeight * 0.17,
    backgroundColor: '#F89F9F',
    flex: 1,
    alignItems: 'center'
  },
  //   logo: {
  //     flex: 1,
  //     alignItems: 'center',
  //     // marginTop: -screenHeight * 0.17,
  //   },
  profileText: {
    color: 'black',
    fontSize: 25,
    fontWeight: 'bold'
  },
  logoImage: {
    width: screenWidth * 0.8,
    resizeMode: 'contain'
  },

  headlineContainer: {
    marginTop: 50,
    width: '100%',
    height: 50,
    backgroundColor: '#E8DEDE',
    alignItems: 'center',
    justifyContent: 'center'
  },

  headlineRectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Para distribuir los elementos horizontalmente
    paddingHorizontal: 20
  },

  headlineText: {
    paddingTop: 8,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },

  infoText: {
    marginTop: 20, // Add some margin at the top
    color: 'black', // Set the text color
    fontSize: 18, // Set the font size
    lineHeight: 20, // Set the line height for better readability
    paddingHorizontal: 15 // Add some padding on the sides
  },
  infoContainer: {
    padding: 20, // Add some padding around the container
    backgroundColor: '#f5f5f5', // Set a background color
    borderRadius: 10, // Add some border radius
    marginVertical: 10, // Add some vertical margin
    justifyContent: 'center'
  },
  listItem: {
    marginTop: 10, // Add some margin at the top
    marginLeft: 10, // Add some margin at the left
    color: 'black', // Set the text color
    fontSize: 16, // Set the font size
    lineHeight: 20 // Set the line height for better readability
  },
  button: {
    backgroundColor: '#F89F9F',
    paddingVertical: 10,
    marginVertical: 20,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16
  }
});
