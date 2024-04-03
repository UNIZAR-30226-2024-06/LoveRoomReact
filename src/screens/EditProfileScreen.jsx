import React, { useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions, Image, TouchableOpacity, ScrollView } from 'react-native';
import AuthContext from '../components/AuthContext';

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

  const { setIsRegistered } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [isValidEmail, setIsValidEmail] = React.useState(false);

  const [password, setPassword] = React.useState('');
  const [isValidPassword, setIsValidPassword] = React.useState(false);

  const handlePasswordChange = (text) => {
    setPassword(text);
    setIsValidPassword(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(text));
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsValidEmail(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(text));
  };

  const { authState } = React.useContext(AuthContext);

  const handleRegister = () => {
    fetch('http://192.168.1.29:3000/user/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: name,
        correo: email,
        contrasena: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          navigation.navigate('Login');
        } else {
          alert('Error al actualizar el usuario');
          console.log(data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduzca su nombre completo"
          onChangeText={(text) => setName(text)}
        />
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduzca su correo electrónico"
          onChangeText={handleEmailChange}
        />
        {!isValidEmail && <Text style={styles.errores}>* Por favor, introduzca un correo electrónico válido.</Text>}

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduzca su contraseña"
          secureTextEntry={true}
          onChangeText={handlePasswordChange}
        />
        {!isValidPassword && (
          <Text style={styles.errores}>
            * La contraseña debe tener entre 8 y 16 caracteres, incluyendo al menos una mayúscula, una minúscula y un
            número.
          </Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleRegister();
            navigation.navigate('Cuenta');
          }}
          disabled={!isValidEmail || !isValidPassword}
        >
          <Text style={styles.buttonText}>Confirmar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 130,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#F89F9F',
    paddingVertical: 10,
    marginVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  errores: {
    marginTop: -10,
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: 10,
    color: '#F89F9F',
    textDecorationLine: 'underline',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: '10%',
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#F89F9F',
  },
  line: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: '45%',
    alignSelf: 'stretch', // Ajuste para que la línea ocupe todo el ancho
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
