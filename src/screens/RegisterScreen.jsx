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
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login({ navigation }) {
  const { authState, setAuthState } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [name, setName] = React.useState('');
  const [isValidEmail, setIsValidEmail] = React.useState(false);
  const [emailError, setEmailError] = React.useState(false);
  const [password, setPassword] = React.useState('');
  const [isValidPassword, setIsValidPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = (text) => {
    setPassword(text);
    setIsValidPassword(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(text));
    setPasswordError(false); // Reinicia el estado de error de la contraseña
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsValidEmail(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(text));
    setEmailError(false); // Reinicia el estado de error del correo electrónico
  };

  const handleRegister = () => {
    setIsLoading(true);
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/user/create`);
    fetch(`${process.env.
      EXPO_PUBLIC_API_URL}/user/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: name,
        correo: email,
        contrasena: password
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
            contrasena: data.usuario.contrasena
          });
          AsyncStorage.setItem('token', data.token);
          navigation.navigate('RegisterPreferences');
        } else if (data.error == 'Ya existe un usuario con ese correo') {
          alert('Ya existe un usuario con ese correo');
        } else {
          alert('Error al conectar con la base de datos');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <ScrollView style={styles.container}>
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
            <Text style={styles.loadingText}>Registrando...</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduzca su nombre completo"
          onChangeText={(text) => setName(text)}
        />
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input,
            emailError && styles.inputError
          ]}
          placeholder="Introduzca su correo electrónico"
          onChangeText={handleEmailChange}
        />
        {emailError && (
          <Text style={styles.errores}>* Por favor, introduzca un correo electrónico válido.</Text>
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
              position: 'absolute', 
              right: 20, 
              height: 40,
              top: 0,
              justifyContent: 'center' 
            }}
          >
            <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
          {passwordError && (
          <Text style={[styles.errores]}> * La contraseña debe tener entre 8 y 16 caracteres, incluyendo al menos una mayúscula,
          una minúscula y un número.</Text>
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
              handleRegister(); // Se ejecuta cuando tanto el correo electrónico como la contraseña son válidos
            }
          }}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
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
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10
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
    marginBottom: 10
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
    fontWeight: 'bold'
  },
  errores: {
    marginTop: -10,
    color: 'red',
    fontSize: 12,
    marginBottom: 10
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
  inputError: {
    borderColor: 'red', // Cambia el borde a rojo si hay un error
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
    alignSelf: 'stretch' // Ajuste para que la línea ocupe todo el ancho
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
