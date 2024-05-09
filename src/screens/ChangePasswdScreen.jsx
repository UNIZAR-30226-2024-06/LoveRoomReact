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
  StatusBar
} from 'react-native';
import AuthContext from '../components/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePasswdScreen({ navigation }) {
  const { setIsRegistered } = React.useContext(AuthContext);

  const [oldPassword, setOldPassword] = React.useState('');
  const [isValidOldPassword, setIsValidOldPassword] = useState(false);
  const [oldPasswordError, setOldPasswordError] = useState(false);
  const [oldHidePassword, setOldHidePassword] = useState(true);

  const [new1Password, setNew1Password] = React.useState('');
  const [isValidNew1Password, setIsValidNew1Password] = useState(false);
  const [new1PasswordError, setNew1PasswordError] = useState(false);
  const [new1HidePassword, setNew1HidePassword] = useState(true);

  const handleOldPasswordChange = (text) => {
    setOldPassword(text);
    setIsValidOldPassword(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(text));
    setOldPasswordError(false);
  };

  const handleNew1PasswordChange = (text) => {
    setNew1Password(text);
    setIsValidNew1Password(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(text));
    setNew1PasswordError(false);
  };

  const handlePasswordUpdate = (text) => {};

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
      <View style={[styles.logoContainer, { marginBottom: -90 }]}>
        <Image style={styles.logo} source={require('../img/logoTexto.png')} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Contraseña actual</Text>
        <View>
          <TextInput
            style={[
              styles.input,
              { paddingRight: 40, flex: 1 },
              oldPasswordError && { borderColor: 'red' }
            ]}
            placeholder="Introduzca su contraseña actual"
            secureTextEntry={oldHidePassword}
            onChangeText={handleOldPasswordChange}
            maxLength={100}
          />
          <TouchableOpacity
            onPress={() => setOldHidePassword(!oldHidePassword)}
            style={{
              position: 'absolute',
              right: 20,
              height: 40,
              top: 0,
              justifyContent: 'center'
            }}
          >
            <Ionicons name={oldHidePassword ? 'eye-off' : 'eye'} size={24} color="black" />
          </TouchableOpacity>
          {oldPasswordError && (
            <Text style={styles.errorText}>* Por favor, introduzca la contraseña actual.</Text>
          )}
        </View>

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
        {/* 
        <Text style={styles.label}>Introduce de nuevo la contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduzca la nueva contraseña otra vez"
          onChangeText={handleChangePassword}
          secureTextEntry={true}
        />
        {!isValidPassword2 && <Text style={styles.errores}>* Las contraseñas no coinciden.</Text>}
         */}

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            let isFormValid = true;

            if (!isValidOldPassword) {
              setOldPasswordError(true);
              isFormValid = false;
            }

            if (!isValidNew1Password) {
              setNew1PasswordError(true);
              isFormValid = false;
            }

            if (isFormValid) {
              handlePasswordUpdate();
              navigation.navigate('GetEmail');
            }
          }}
        >
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('GetEmail');
          }}
        >
          <Text style={styles.forgotPassword}>He olvidado mi contraseña</Text>
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
