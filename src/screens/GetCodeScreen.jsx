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
import { correoFP } from '../utils/globalVariables';

export default function GetCodeScreen({ navigation }) {
  const [lastSentTime, setLastSentTime] = useState(null);
  const lastSentTimeRef = useRef(null);



  const handleResendCode = () => {
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
      sendCode();
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

  const sendCode = () => {
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

  const handleContinue = () => {
    // fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/check/code`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({ 
    //     correo: correoFP,
    //     codigo: code
    //   })
    // })
    //   .then((response) => response.json()) 
    //   .then((data) => {
    //     let respuestaValida = false;
    //     if (data.mensaje === 'Correo para resetear contraseña enviado con exito') {
    //       respuestaValida = true;
    //       navigation.navigate('GetCode');
    //     } else if (data.error === 'El usuario introducido no existe') {
    //       respuestaValida = false;
    //       setIsValidEmail(false);
    //       setFormSubmitted(true);
    //       setErrorText('Usuario no existente');
    //     } else if (respuestaValida === false){
    //       Toast.show({
    //         type: 'error',
    //         position: 'bottom',
    //         text1: 'Error',
    //         text2: 'Error al enviar el correo para resetear la contraseña',
    //         visibilityTime: 2500
    //       }); 
    //      }
    //   })
    //   .catch((error) => {
    //     console.error('Error:', error);
    //     Toast.show({
    //       type: 'error',
    //       position: 'bottom',
    //       text1: 'Error',
    //       text2: 'Error al conectar con la base de datos',
    //       visibilityTime: 2500
    //     });
    //   });
  };
    

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
      <View style={[styles.logoContainer, { marginBottom: -90 }]}>
        <Image style={styles.logo} source={require('../img/logoTexto.png')} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Código</Text>
        <TextInput style={styles.input} placeholder="Introduzca el código enviado a su correo" />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleContinue();
          }}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResendCode}>
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
