import React, { useState, useRef } from 'react';
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
  ToastAndroid
} from 'react-native';
import Toast from 'react-native-toast-message';
import { correoFP, actualizarCode } from '../utils/globalVariables';

export default function GetCodeScreen({ navigation }) {
  const [lastSentTime, setLastSentTime] = useState(null);
  const lastSentTimeRef = useRef(null);
  const [code, setCode] = useState('');
  const [isValidCode, setIsValidCode] = useState(false);
  const [isSixDigits, setIsSixDigits] = useState(false); 
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorText, setErrorText] = useState('* El código debe tener 6 dígitos');

  const handleCodeChange = (text) => {
    setCode(text);
    setFormSubmitted(false);
    setErrorText('');
    if (text.length === 6) {
      setIsSixDigits(true);
    } else {
      setIsSixDigits(false);
    }
  };
  


  const handleReSendCode = () => {
    const currentTime = Date.now();
    const resendDelay = 60000; // 60 segundos
    if (lastSentTimeRef.current && currentTime - lastSentTimeRef.current < resendDelay) {
      // Si han pasado menos de 60 segundos desde el último envío, mostrar un mensaje de error
      Toast.show({
        type: 'info',
        position: 'bottom',
        text1: 'Espere antes de volver a reenviar el código',
        text2: 'Debe esperar 60 segundos antes de reenviar el código.',
        visibilityTime: 4000
      });
    } else {
      // Si han pasado más de 60 segundos, enviar el código nuevamente y actualizar el tiempo del último envío
      reSendCode();
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Código reenviado',
        text2: 'El código ha sido reenviado a su correo electrónico.',
        visibilityTime: 2500
      });
      lastSentTimeRef.current = currentTime;
    }
  };

  const reSendCode = () => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/send/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ correo: correoFP })
    })
      .then((response) => response.json()) 
      .then((data) => {
        let respuestaValida = false;
        if (data.mensaje === 'Correo para resetear contraseña enviado con exito') {
          respuestaValida = true;
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

  const handleContinue = () => {
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/check/code`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        correo: correoFP,
        codigo: code
      })
    })
      .then((response) => response.json()) 
      .then((data) => {
        let respuestaValida = false;
        if (data.valido) {
          respuestaValida = true;
          setIsValidCode(true);
          setFormSubmitted(true);
          navigation.navigate('ResetPasswdAfterCode');
          actualizarCode(code);
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: 'Código correcto, resetee su contraseña',
            text2: 'El código introducido es correcto, puede resetear su contraseña',
            visibilityTime: 2500
          }); 
        } else if (data.error === 'El usuario introducido no existe') {
          respuestaValida = true;
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: 'Error',
            text2: 'El usuario introducido no existe',
            visibilityTime: 2500
          });
        } else if (data.error === 'El codigo introducido no es correcto') {
          respuestaValida = true;
          setIsValidCode(false);
          setFormSubmitted(true);
          setErrorText('Código incorrecto');
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
  
  
    

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
      <View style={[styles.logoContainer, { marginBottom: -90 }]}>
        <Image style={styles.logo} source={require('../img/logoTexto.png')} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Código</Text>
        <TextInput 
          style={[
            styles.input,
            ((!isSixDigits || !isValidCode) && formSubmitted) && styles.inputError,
            errorText === '* El código debe tener 6 dígitos'
          ]}
          placeholder="Introduzca el código enviado a su correo" 
          onChangeText={handleCodeChange}
          maxLength={6}
        />
        {!isSixDigits && formSubmitted && errorText === '* El código debe tener 6 dígitos' && (
          <Text style={styles.errorText}>
            * El código debe tener 6 dígitos.
          </Text>
        )}
        {errorText === 'Código incorrecto' && (
          <Text style={styles.errorText}>
            * El código introducido no es correcto.
          </Text>
        )}
        

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            let isFormValid = true;
            if (!isSixDigits) {
              isFormValid = false;
              setFormSubmitted(true);
              setErrorText('* El código debe tener 6 dígitos');
            }
            if (isFormValid) {
              handleContinue();
            }
          }}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleReSendCode}>
          <Text style={styles.forgotPassword}>Reenviar código</Text>
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
    marginBottom: 5
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5
  },
  inputError: {
    borderColor: 'red'
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
