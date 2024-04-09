import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import AuthContext from '../components/AuthContext';

export default function GetEmailScreen({ navigation }) {
  // const { isRegistered, setIsRegistered } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [isValidEmail, setIsValidEmail] = React.useState(true);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');


  // const handleRegister = () => {
  //   setIsRegistered(true);
  // };

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsValidEmail(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(text));
    setFormSubmitted(false);
    if (errorText === 'Usuario no existente') {
      setErrorText(''); // Limpiar el mensaje de error cuando el usuario comienza a escribir nuevamente
    }
  };
  


  const handleChangePassword = () => {
    setFormSubmitted(true);
    if (isValidEmail) {
      isRegistered2();
    }
  };

const isRegistered2 = () => {
  fetch(`http://192.168.1.44:5000/user/${email}`, {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error al obtener el usuario');
      }
      return response.json();
    })
    .then((data) => {
      if (data.error) {
        if (data.error === 'Usuario no encontrado') {
          // Si el usuario no se encuentra, actualiza el estado para mostrar el mensaje de error
          setIsValidEmail(false);
          setFormSubmitted(true);
          setErrorText('Usuario no existente');
        } else {
          Alert.alert('Error', 'Error al obtener el usuario');
        }
      } else {
        // FALTA: ENVIAR PETICION A BACKEND DE GENERAR CODIGO Y ENVIARLO AL USUARIO
        navigation.navigate('GetCode');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      Alert.alert('Error', 'Error al conectar con la base de datos');
    });
};

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.logoContainer, { marginBottom: -90 }]}>
        <Image style={styles.logo} source={require('../img/logoTexto.png')} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={[
            styles.input,
            (!isValidEmail && formSubmitted) && styles.inputError,
            (errorText === 'Usuario no existente') && styles.inputError 
          ]} 
          placeholder="Introduzca su correo electrónico "
          onChangeText={handleEmailChange}
        />
        {!isValidEmail && formSubmitted && errorText !== 'Usuario no existente' && (
          <Text style={styles.errorText}>* Por favor, introduzca un correo electrónico válido.</Text>
        )}
        {errorText === 'Usuario no existente' && (
          <Text style={styles.errorText}>* No existe ninguna cuenta de usuario asociada a este correo electrónico.</Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleChangePassword}
        >
          <Text style={styles.buttonText}>Continuar</Text>
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
    marginBottom: 5
  },
  inputError: {
    borderColor: 'red', 
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
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: '80%',
    alignSelf: 'stretch', // Ajuste para que la línea ocupe todo el ancho
    marginBottom: 10
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
  }
});
