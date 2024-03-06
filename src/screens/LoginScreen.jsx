import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform, StatusBar } from "react-native";
import AuthContext from '../components/AuthContext';

export default function Login({ navigation}) {
  const {setIsRegistered} = React.useContext(AuthContext);

  const handleLogin = () => {
    setIsRegistered(true);
  };

  return (
    <View style={styles.container}>
      <View style={[styles.logoContainer, { marginBottom: -90 }]}>
        <Image
          style={styles.logo}
          source={require("../img/logoTexto.png")}
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre de usuario</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduzca su nombre de usuario"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder="Introduzca su contraseña"
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.button} onPress={()=> {
          handleLogin();navigation.navigate('Cuenta');}}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotPassword}>He olvidado mi contraseña</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.line}></View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>¿No tienes una cuenta?</Text>
        <TouchableOpacity>
          <Text style={styles.registerLink}>Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between", // Ajuste para posicionar el registro al final
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 130,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    marginTop: 20,
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#cccccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#E58080",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  forgotPassword: {
    textAlign: "right",
    marginTop: 10,
    color: "#E58080",
    textDecorationLine: "underline",
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom:  '10%',
  },
  registerText: {
    fontSize: 16,
  },
  registerLink: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
    color: "#E58080",
  },
  line: {
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingBottom: '45%',
    alignSelf: "stretch", // Ajuste para que la línea ocupe todo el ancho
  },  
});
