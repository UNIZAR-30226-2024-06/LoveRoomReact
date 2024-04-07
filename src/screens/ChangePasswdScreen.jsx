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
  StatusBar
} from 'react-native';
import AuthContext from '../components/AuthContext';

export default function ChangePasswdScreen({ navigation }) {
  const { setIsRegistered } = React.useContext(AuthContext);
  const [password, setPassword] = React.useState('');
  const [password2, setPassword2] = React.useState('');
  const [isValidPassword, setIsValidPassword] = React.useState(false);
  const [isValidPassword2, setIsValidPassword2] = React.useState(false);

  const handlePasswordChange = (text) => {
    setPassword(text);
    setIsValidPassword(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(text));
    setIsValidPassword2(password2 === text);
  };

  const handleChangePassword = (text) => {
    setPassword2(text);
    setIsValidPassword2(password === text);
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
        <Text style={styles.label}>Nueva contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduzca la nueva contraseña"
          onChangeText={handlePasswordChange}
          secureTextEntry={true}
        />
        {!isValidPassword && (
          <Text style={styles.errores}>
            * La contraseña debe tener entre 8 y 16 caracteres, incluyendo al menos una mayúscula,
            una minúscula y un número.
          </Text>
        )}

        <Text style={styles.label}>Introduce de nuevo la contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduzca la nueva contraseña otra vez"
          onChangeText={handleChangePassword}
          secureTextEntry={true}
        />
        {!isValidPassword2 && <Text style={styles.errores}>* Las contraseñas no coinciden.</Text>}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleChangePassword();
            navigation.navigate('Login');
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
