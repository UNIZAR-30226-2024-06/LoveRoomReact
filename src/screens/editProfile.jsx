import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView, TextInput, Button } from 'react-native';
import AuthContext from '../components/AuthContext';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function EditProfileScreen() {
  const scrollViewRef = useRef(null); // Referencia a ScrollView
  const { authState, setAuthState } = React.useContext(AuthContext);

  const handleScroll = (event) => {
    const { y } = event.nativeEvent.contentOffset;
    if (y < 0) {
      // Si el usuario intenta desplazarse hacia abajo, establecer el desplazamiento en 0
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
    }
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setName(authState.name);
    setEmail(authState.email);
    setPassword(authState.password);
  }
  , []);

  const handleSave = () => {
    // Aquí iría el código para guardar los datos del perfil del usuario
    console.log('Guardando perfil:', { name, email });
  };

  return (
    <View style={styles.container}>
    <ScrollView
      style={styles.scrollViewContainer}
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
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contraseña</Text>
          <TextInput
            style={styles.input}
            value={authState.password}
            onSecureTextEntry={true}
            onChangeText={setPassword}
          />
        </View>
        
      </View>
      <Button title="Guardar" onPress={handleSave} style= {styles.saveButton} />
    </ScrollView>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', 
    justifyContent: 'space-between', // Fondo blanco
  },
   scrollViewContainer: { // New style for ScrollView
    flex: 1,
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
    marginTop: -screenHeight * 0.2,
  },
  profileText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    marginTop: 40,
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
  inputContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: '100%',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
});
