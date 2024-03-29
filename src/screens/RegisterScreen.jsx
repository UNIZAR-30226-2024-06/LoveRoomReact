import React from 'react';
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

export default function Login({ navigation }) {
  const { setIsRegistered } = React.useContext(AuthContext);
  const [email, setEmail] = React.useState('');
  const [isValidEmail, setIsValidEmail] = React.useState(false);

  const [password, setPassword] = React.useState('');
  const [isValidPassword, setIsValidPassword] = React.useState(false);

  const handlePasswordChange = (text) => {
    setPassword(text);
    setIsValidPassword(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(text));
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    setIsValidEmail(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(text));
  };

  const handleRegister = () => {
    setIsRegistered(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.logoContainer, { marginBottom: -90 }]}>
        <Image style={styles.logo} source={require('../img/logoTexto.png')} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput style={styles.input} placeholder="Introduzca su nombre completo" />
        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduzca su correo electrónico"
          onChangeText={handleEmailChange}
        />
        {!isValidEmail && <Text style={styles.errores}>* Por favor, introduzca un correo electrónico válido.</Text>}

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduzca su contraseña"
          secureTextEntry={true}
          onChangeText={handlePasswordChange}
        />
        {!isValidPassword && (
          <Text style={styles.errores}>
            * La contraseña debe tener entre 8 y 16 caracteres, incluyendo al menos una mayúscula, una minúscula y un
            número.
          </Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleRegister();
            navigation.navigate('Cuenta');
          }}
          disabled={!isValidEmail || !isValidPassword}
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
  },
  button: {
    backgroundColor: '#E58080',
    paddingVertical: 10,
    marginVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  errores: {
    marginTop: -10,
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
  },
  forgotPassword: {
    textAlign: 'right',
    marginTop: 10,
    color: '#E58080',
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
    color: '#E58080',
  },
  line: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: '45%',
    alignSelf: 'stretch', // Ajuste para que la línea ocupe todo el ancho
  },
});
