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
  ActivityIndicator,
  Modal
} from 'react-native';
import AuthContext from '../components/AuthContext';
import RegisterScreen from './RegisterScreen';
import { Ionicons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const { authState, setAuthState } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [isValidEmail, setIsValidEmail] = React.useState(true);
  const [emailError, setEmailError] = React.useState(false);

  const [password, setPassword] = React.useState('');
  const [isValidPassword, setIsValidPassword] = React.useState(true);
  const [passwordError, setPasswordError] = React.useState(false);

  const [hidePassword, setHidePassword] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsValidEmail(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(text));
    setEmailError(false); // Reinicia el estado de error del correo electrónico
  };
  
  const handlePasswordChange = (text) => {
    setPassword(text);
    setIsValidPassword(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(text));
    setPasswordError(false); // Reinicia el estado de error de la contraseña
  };

  //FALTA: MODIFICAR ESTO PARA QUE PRIMERO SE VERIFIQUE QUE EL CORREO EXISTA Y LUEGO SE HAGA EL LOGIN, ASI PODEMOS DAR
  // A SABER AL USUARIO SI FALLA EL CORREO O LA CONTRASEÑA
  const handleLogin = () => {
    setIsLoading(true);
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/user/login`);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo: email, contrasena: password })
    })
      .then((response) => response.json())
      .then((data) => {
        setIsLoading(false);
        if (data.token != null) {
          setAuthState({
            isLoggedIn: true,
            token: data.token,
            baneado: data.usuario.baneado,
            id: data.usuario.id,
            correo: data.usuario.correo,
            nombre: data.usuario.nombre,
            sexo: data.usuario.sexo,
            edad: data.usuario.edad,
            idLocalidad: data.usuario.idLocalidad,
            buscaedadmin: data.usuario.buscaedadmin,
            buscaedadmax: data.usuario.buscaedadmax,
            buscasexo: data.usuario.buscasexo,
            fotoperfil: data.usuario.fotoperfil,
            descripcion: data.usuario.descripcion,
            tipousuario: data.usuario.tipousuario,
            contrasena: data.usuario.contrasena,
          });
          AsyncStorage.setItem('token', data.token);
          navigation.navigate('Cuenta');
        } else {
          alert('Usuario o contraseña incorrectos', data);
          console.log(data);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error:', error);
      });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
    >

      <View style={[styles.logoContainer, { marginBottom: -90 }]}>
        <Image style={styles.logo} source={require('../img/logoTexto.png')} />
      </View>
      <Modal
        transparent={true}
        animationType={'none'}
        visible={isLoading}
        onRequestClose={() => {console.log('close modal')}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={isLoading} size="large" color="#F89F9F" />
            <Text style={styles.loadingText}>Iniciando sesión...</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={[
            styles.input,
            emailError && styles.inputError 
          ]}
          placeholder="Introduzca su correo electrónico"
          onChangeText={handleEmailChange}
        />
        {emailError && (
          <Text style={styles.errorText}>* Por favor, introduzca un correo electrónico válido.</Text>
        )}

        <Text style={styles.label}>Contraseña</Text>
        <View>
          <TextInput
            style={[
              styles.input,
              { paddingRight: 40, flex: 1 }, // Estilos para ocupar todo el espacio horizontal disponible
              passwordError && styles.inputError // Estilo de error si hay un error en la contraseña
            ]}
            placeholder="Introduzca la contraseña"
            secureTextEntry={hidePassword}
            onChangeText={handlePasswordChange}
          />
          <TouchableOpacity
            onPress={() => setHidePassword(!hidePassword)}
            style={{
              position: 'absolute', // Posiciona el botón del ojo en relación con el contenedor View
              right: 20, // Coloca el botón del ojo a 10px del borde derecho del contenedor View
              height: 40,
              top: 0, // Asegúrate de que el botón del ojo tenga la misma altura que el TextInput
              justifyContent: 'center' // Centra el icono verticalmente dentro del botón del ojo
            }}
          >
            <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
          {passwordError && (
          <Text style={[styles.errorText]}>* Por favor, introduzca una contraseña válida.</Text>
        )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (!isValidEmail) {
              setEmailError(true); // Establecer el estado de error del correo electrónico
            }
            if (!isValidPassword) {
              setPasswordError(true); // Establecer el estado de error de la contraseña
            } else {
              handleLogin(); // Se ejecuta cuando tanto el correo electrónico como la contraseña son válidos
            }
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
    backgroundColor: '#fff'
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 130
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
  },
  formContainer: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    padding: 20,
    borderRadius: 10
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 5,
    marginEnd: 5
  },
  inputError: {
    borderColor: 'red', // Cambia el borde a rojo si hay un error
  },
  button: {
    backgroundColor: '#F89F9F',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold'
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: 10,
    color: '#F89F9F',
    textDecorationLine: 'underline'
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingBottom: '10%'
  },
  registerText: {
    fontSize: 16
  },
  registerLink: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    color: '#F89F9F'
  },
  line: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: '45%',
    alignSelf: 'stretch', // Ajuste para que la línea ocupe todo el ancho
    marginBottom: 10
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 120,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  loadingText: {
    textAlign: 'center', // Centra el texto
    flexWrap: 'wrap', // Permite que el texto se ajuste
  }
});
