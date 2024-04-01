import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
} from 'react-native';
import AuthContext from '../components/AuthContext';
import RegisterScreen from './RegisterScreen';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de instalar @expo/vector-icons si aún no lo has hecho
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const { authState, setAuthState } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [isValidEmail, setIsValidEmail] = React.useState(false);

  const [password, setPassword] = React.useState('');
  const [isValidPassword, setIsValidPassword] = React.useState(false);

  const [hidePassword, setHidePassword] = useState(true);

  const handlePasswordChange = (text) => {
    console.log(authState);
    setPassword(text);
    setIsValidPassword(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(text));
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsValidEmail(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(text));
  };

  const handleLogin = () => {
    fetch('http://192.168.1.29:3000/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo: email, contrasena: password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token != null) {
          setAuthState((prevState) => ({ ...prevState, isLoggedIn: true, token: data.token }));
<<<<<<< Updated upstream
          AsyncStorage.setItem('token', data.token);
=======
          console.log(authState);
>>>>>>> Stashed changes
        } else {
          alert('Usuario o contraseña incorrectos', data);
          console.log(data);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}>
      <View style={[styles.logoContainer, { marginBottom: -90 }]}>
        <Image style={styles.logo} source={require('../img/logoTexto.png')} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduzca su correo electrónico"
          onChangeText={handleEmailChange}
        />
        {!isValidEmail && <Text style={styles.errores}>* Por favor, introduzca un correo electrónico válido.</Text>}

        <Text style={styles.label}>Contraseña</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', position: 'relative' }}>
          <TextInput
            style={[styles.input, { paddingRight: 40, flex: 1 }]} // Añade paddingRight para evitar que el texto se superponga con el botón del ojo
            placeholder="Introduzca la nueva contraseña otra vez"
            onChangeText={handlePasswordChange}
            secureTextEntry={hidePassword}
          />
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={{
              position: 'absolute', // Posiciona el botón del ojo en relación con el contenedor View
              right: 20, // Coloca el botón del ojo a 10px del borde derecho del contenedor View
              height: 40,
              top: 0, // Asegúrate de que el botón del ojo tenga la misma altura que el TextInput
              justifyContent: 'center', // Centra el icono verticalmente dentro del botón del ojo
            }}
          >
            <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
        </View>
        {!isValidPassword && (
          <Text style={styles.errores}>
            * La contraseña debe tener entre 8 y 16 caracteres, incluyendo al menos una mayúscula, una minúscula y un
            número.
          </Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleLogin();
            navigation.navigate('Cuenta');
          }}
        >
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('GetEmail');
          }}
        >
          <Text style={styles.forgotPassword}>He olvidado mi contraseña</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.line}></View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Register');
          }}
        >
          <Text style={styles.registerLink}>Regístrate</Text>
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
  errores: {
    marginTop: -10,
    marginBottom: 10,
    color: 'red',
    fontSize: 12,
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
    marginEnd: 5,
  },
  button: {
    backgroundColor: '#F89F9F',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
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
});
