import React from "react";
import {ScrollView, View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Platform, StatusBar } from "react-native";
import AuthContext from '../components/AuthContext';

export default function Login({ navigation}) {
  const {setIsRegistered} = React.useContext(AuthContext);

  const handleRegister = () => {
    setIsRegistered(true);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.logoContainer, { marginBottom: -90 }]}>
        <Image
          style={styles.logo}
          source={require("../img/logoTexto.png")}
        />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre completo</Text>
          <TextInput
          style={styles.input}
          placeholder="Introduzca su nombre completo"
          />
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
          handleRegister();navigation.navigate('Cuenta');}}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
