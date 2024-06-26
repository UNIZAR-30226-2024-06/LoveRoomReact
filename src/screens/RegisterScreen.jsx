import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Modal
} from 'react-native';
import AuthContext from '../components/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function Login({ navigation }) {
  const { authState, setAuthState } = React.useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const [isValidName, setIsValidName] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState('');

  const [isValidEmail, setIsValidEmail] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState(
    '* Por favor, introduzca un correo electrónico válido.'
  );

  const [password, setPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (text) => {
    setName(text);
    setIsValidName(text.trim().length > 0);
    setNameError(false);
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsValidEmail(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(text));
    setEmailError(false); // Reinicia el estado de error del correo electrónico
    if (!isValidEmail) {
      setEmailErrorMessage('* Por favor, introduzca un correo electrónico válido.');
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setIsValidPassword(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(text));
    setPasswordError(false); // Reinicia el estado de error de la contraseña
  };

  const handleRegister = () => {
    setIsLoading(true);
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/user/create`);
    console.log(name, email, password);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/create`, {
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

          if (data.usuario.tipousuario === 'administrador') {
            navigation.navigate("Account", {screen : 'Admin'});
          }
          AsyncStorage.setItem('token', data.token);
          navigation.navigate('RegisterPreferences');
        } else if (data.error === 'Ya existe un usuario con ese correo') {
          setEmailError(true);
          setEmailErrorMessage('* Este correo electrónico ya está registrado');
        } else {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: 'Error al conectar con la base de datos',
            visibilityTime: 2500
          });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error('Error:', error);
      });
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
      <View style={[styles.logoContainer, { marginBottom: -90 }]}>
        <Image style={styles.logo} source={require('../img/logoTexto.png')} />
      </View>
      <Modal
        transparent={true}
        animationType={'none'}
        visible={isLoading}
        onRequestClose={() => console.log('close modal')}
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
          style={[styles.input, nameError && styles.inputError]}
          placeholder="Introduzca su nombre completo"
          onChangeText={handleNameChange}
          maxLength={50}
        />
        {nameError && (
          <Text style={styles.errorText}>* Por favor, introduzca su nombre completo.</Text>
        )}

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="Introduzca su correo electrónico"
          onChangeText={handleEmailChange}
          autoCapitalize="none"
          maxLength={254}
        />
        {emailError && <Text style={styles.errorText}>{emailErrorMessage}</Text>}

        <Text style={styles.label}>Contraseña</Text>
        <View>
          <TextInput
            style={[
              styles.input,
              { paddingRight: 40, flex: 1 },
              passwordError && styles.inputError
            ]}
            placeholder="Introduzca una contraseña"
            secureTextEntry={hidePassword}
            onChangeText={handlePasswordChange}
            maxLength={100}
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
            <Text style={[styles.errorText]}>
              * La contraseña debe tener entre 8 y 16 caracteres, incluyendo al menos una mayúscula,
              una minúscula y un número.
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            let isFormValid = true;

            if (!isValidName) {
              setNameError(true);
              isFormValid = false;
            }

            if (!isValidEmail) {
              setEmailError(true);
              isFormValid = false;
            }

            if (!isValidPassword) {
              setPasswordError(true);
              isFormValid = false;
            }

            if (isFormValid) {
              handleRegister();
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
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold'
  },
  inputError: {
    borderColor: 'red'
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
    textAlign: 'center',
    flexWrap: 'wrap'
  }
});
