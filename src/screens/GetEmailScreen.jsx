import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Dimensions
} from 'react-native';
import AuthContext from '../components/AuthContext';

export default function GetEmailScreen({ navigation }) {
  const { isRegistered, setIsRegistered } = React.useContext(AuthContext);
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
      method: 'GET'
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

  const { height, width } = Dimensions.get('window');

  // Al calcular la menor dimensión (minDimension) entre la altura (height) y el ancho (width), estás obteniendo el valor más pequeño entre los dos,
  // lo que te permite diseñar la UI de una forma más adaptable y flexible a los cambios de orientación.
  const minDimension = Math.min(height, width);
  // Calcular el margen inferior del 10%
  const marginBottomLine = height * 0.07;
  const marginBottomBackToLogin = height * 0.03;
  const logoHeight = height * -0.3;
  const formHeight = height * 0;

  return (
    <View style={styles.container}>
      <Image
        style={[styles.logo, { marginTop: logoHeight }]}
        source={require('../img/logoTexto.png')}
      />
      <View style={[styles.formContainer, { marginBottom: formHeight }]}>
        <Text style={styles.label}>Correo electrónico</Text>
        <TextInput
          style={[
            styles.input,
            !isValidEmail && formSubmitted && styles.inputError,
            errorText === 'Usuario no existente' && styles.inputError
          ]}
          placeholder="Introduzca su correo electrónico "
          onChangeText={handleEmailChange}
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

      {/* <View style={[styles.line, { marginBottom: marginBottomLine }]} />
      <View style={[styles.registerContainer, { marginBottom: marginBottomBackToLogin }]}>
        <Text style={styles.registerText}>Volver al </Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Login');
          }}
        >
          <Text style={styles.registerLink}>Login</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain'
  },
  formContainer: {
    //position: 'absolute',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    width: '100%'
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
