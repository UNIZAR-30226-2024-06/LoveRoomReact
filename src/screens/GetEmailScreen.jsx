import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import AuthContext from '../components/AuthContext';
import Toast from 'react-native-toast-message';
import { actualizarCorreoFP } from '../utils/globalVariables';

export default function GetEmailScreen({ navigation }) {
  const [email, setEmail] = React.useState('');
  const [isValidEmail, setIsValidEmail] = React.useState(false);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [errorText, setErrorText] = React.useState('* Por favor, introduzca un correo electrónico válido.');

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsValidEmail(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(text));
    setFormSubmitted(false);
    if (errorText === 'Usuario no existente') {
      setErrorText(''); // Limpiar el mensaje de error cuando el usuario comienza a escribir nuevamente
    }
  };

  const handleChangePassword = () => {
    console.log(errorText);
    console.log(formSubmitted);
    console.log(isValidEmail);
    console.log(email);
    setFormSubmitted(true);
    if (isValidEmail) {
      sendCode();
    }
  };

  //pedir a backend usuario para ver si existe. si existe, ir a 
  const sendCode = () => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/send/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo: email })
    })
      .then((response) => response.json()) 
      .then((data) => {
        let respuestaValida = false;
        if (data.mensaje === 'Correo para resetear contraseña enviado con exito') {
          respuestaValida = true;
          actualizarCorreoFP(email);
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Correo enviado',
            text2: 'Se ha enviado un correo para resetear la contraseña.',
            visibilityTime: 2500
          }); 
          navigation.navigate('GetCode');
        } else if (data.error === 'El usuario introducido no existe') {
          respuestaValida = false;
          setIsValidEmail(false);
          setFormSubmitted(true);
          setErrorText('Usuario no existente');
        } else if (respuestaValida === false){
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: 'Error al enviar el correo para resetear la contraseña',
            visibilityTime: 2500
          }); 
         }
      })
      .catch((error) => {
        console.error('Error:', error);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Error',
          text2: 'Error al conectar con la base de datos',
          visibilityTime: 2500
        });
      });
  };
  

  return  (
  <ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
    <View style={[styles.logoContainer, { marginBottom: -90 }]}>
        <Image style={styles.logo} source={require('../img/logoTexto.png')} />
    </View>

    <View style={styles.formContainer}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={[
            styles.input,
            !isValidEmail && formSubmitted && styles.inputError,
            errorText === 'Usuario no existente' && styles.inputError  
          ]}
          placeholder="Introduzca su correo electrónico "
          onChangeText={handleEmailChange}
          maxLength={254}
        />
        {!isValidEmail && formSubmitted && errorText !== 'Usuario no existente' && (
          <Text style={styles.errorText}>
            * Por favor, introduzca un correo electrónico válido.
          </Text>
        )}
        {errorText === 'Usuario no existente' && (
          <Text style={styles.errorText}>
            * No existe ninguna cuenta de usuario asociada a este correo electrónico.
          </Text>
        )}

        <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
           <Text style={styles.buttonText}>Continuar</Text>
         </TouchableOpacity>
     </View>
  </ScrollView>
    )
  };




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
  inputError: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5
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
  line: {
    height: 2,
    width: '100%', // Ancho del 80% de la pantalla
    position: 'absolute', // Posicionamiento absoluto para colocar la línea en una posición específica
    bottom: 0, // Al principio, la línea estará al fondo de la pantalla
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    alignSelf: 'stretch' // Ajuste para que la línea ocupe todo el ancho
  },

  registerContainer: {
    position: 'absolute', // Posicionamiento absoluto para colocar la línea en una posición específica
    bottom: 0, // Al principio, la línea estará al fondo de la pantalla
    justifyContent: 'center',
    flexDirection: 'row'
  },
  registerText: {
    fontSize: 16
  },
  registerLink: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F89F9F'
  }
});
