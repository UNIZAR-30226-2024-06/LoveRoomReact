import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AuthContext from '../components/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { correoFP, Code } from '../utils/globalVariables';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ResetPassAfterCode({ navigation }) {
  const { authState, setAuthState } = React.useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const [new1Password, setNew1Password] = React.useState('');
  const [isValidNew1Password, setIsValidNew1Password] = useState(false);
  const [new1PasswordError, setNew1PasswordError] = useState(false);
  const [new1HidePassword, setNew1HidePassword] = useState(true);

  const [new2Password, setNew2Password] = React.useState('');
  const [isValidNew2Password, setIsValidNew2Password] = useState(false);
  const [new2PasswordError, setNew2PasswordError] = useState(false);
  const [new2HidePassword, setNew2HidePassword] = useState(true);

  const handleNew1PasswordChange = (text) => {
    setNew1Password(text);
    setIsValidNew1Password(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(text));
    setNew1PasswordError(false);
  };

  const handleNew2PasswordChange = (text) => {
    setNew2Password(text);
    setIsValidNew2Password(new1Password === text);
    setNew2PasswordError(false);
  };

  const handlePasswordUpdate = () => {
    setIsLoading(true);
    console.log('Nueva contraseña:', new1Password, 'Repetir nueva contraseña:', new2Password);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/reset/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authState.token}`
        },
        body: JSON.stringify({
            nuevaContrasena: new1Password,
            codigo: Code,
            correo: correoFP
        }),
    })
    .then((response) => response.json())
    .then((data) => {
        console.log('Respuesta:', data);
        console.log('Correo:', correoFP);
        console.log('Codigo:', Code);

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
          navigation.navigate('Login');
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Contraseña actualizada',
            text2: 'Se ha actualizado la contraseña correctamente',
            visibilityTime: 2500
          });
        } else if (data.error === 'El usuario introducido no existe' || 
                   data.error === 'Codigo introducido no es correcto' ||
                   data.error === 'Error al resetear la contraseña') {
            console.log('Error al actualizar la contraseña');
            Toast.show({
              type: 'error',
              position: 'bottom',
              text1: 'Error al actualizar la contraseña',
              text2: 'Error al actualizar la contraseña, inténtalo de nuevo',
              visibilityTime: 2500
            });
        }
    })
    .catch((error) => {
      setIsLoading(false);
        console.error('Error en la solicitud:', error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error en la solicitud',
          text2: 'Ocurrió un error durante la solicitud, inténtelo de nuevo',
          visibilityTime: 2500
        });
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
        onRequestClose={() => {
          console.log('close modal');
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={isLoading} size="large" color="#F89F9F" />
            <Text style={styles.loadingText}>Actualizando contraseña...</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nueva contraseña</Text>
        <View>
          <TextInput
            style={[
              styles.input,
              { paddingRight: 40, flex: 1 },
              new1PasswordError && { borderColor: 'red' }
            ]}
            placeholder="Introduzca la nueva contraseña"
            secureTextEntry={new1HidePassword}
            onChangeText={handleNew1PasswordChange}
            maxLength={100}
          />
          <TouchableOpacity
            onPress={() => setNew1HidePassword(!new1HidePassword)}
            style={{
              position: 'absolute',
              right: 20,
              height: 40,
              top: 0,
              justifyContent: 'center'
            }}
          >
            <Ionicons name={new1HidePassword ? 'eye-off' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
          {new1PasswordError && (
            <Text style={styles.errorText}>
              * La nueva contraseña debe tener entre 8 y 16 caracteres, incluyendo al menos una
              mayúscula, una minúscula y un número.
            </Text>
          )}
        </View>

        <Text style={styles.label}>Repite nueva contraseña</Text>
        <View>
          <TextInput
            style={[styles.input, { paddingRight: 40, flex: 1 },
              new2PasswordError && { borderColor: 'red' }]}
            placeholder="Introduzca la nueva contraseña"
            secureTextEntry={new2HidePassword}
            onChangeText={handleNew2PasswordChange}
            maxLength={100}
          />
          <TouchableOpacity
              onPress={() => setNew2HidePassword(!new2HidePassword)}
              style={{
                position: 'absolute',
                right: 20,
                height: 40,
                top: 0,
                justifyContent: 'center'
              }}
            >
              <Ionicons name={new2HidePassword ? 'eye-off' : 'eye'} size={24} color="black" />
            </TouchableOpacity>
          {new2PasswordError && (
            <Text style={styles.errorText}>
              * Las contraseñas no coindicen.
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            let isFormValid = true;

            if (!isValidNew1Password) {
              setNew1PasswordError(true);
              isFormValid = false;
            }

            if (!isValidNew2Password) {
              setNew2PasswordError(true);
              isFormValid = false;
            }
            
            if (isFormValid) {
              handlePasswordUpdate();
            }
          }}
        >
          <Text style={styles.buttonText}>Continuar</Text>
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
    flexWrap: 'wrap' // Permite que el texto se ajuste
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5
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
  errores: {
    marginTop: -10,
    color: 'red',
    fontSize: 12,
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
    alignSelf: 'stretch' // Ajuste para que la línea ocupe todo el ancho
  }
});
