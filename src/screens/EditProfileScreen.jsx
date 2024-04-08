import { useState, useContext, useEffect } from 'react';
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
  Dimensions
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import AuthContext from '../components/AuthContext';
import * as FileSystem from 'expo-file-system';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function RegisterPreferencesScreen({ navigation }) {
  const { authState } = useContext(AuthContext);
  const [name, setName] = useState(authState.nombre);
  const [email, setEmail] = useState(authState.correo);
  const [password, setPassword] = useState(authState.contrasena);
  const [age, setAge] = useState(authState.edad);
  const [show, setShow] = useState(false);
  const [gender, setGender] = useState(authState.sexo);
  const [sexualPreference, setSexualPreference] = useState(authState.buscasexo);
  const [agePreferenceStart, setAgePreferenceStart] = useState(authState.buscaedadmin);
  const [agePreferenceEnd, setAgePreferenceEnd] = useState(authState.buscaedadmax);
  const [description, setDescription] = useState(authState.descripcion);
  const [profileImage, setProfileImage] = useState(authState.fotoperfil);
  const [isProfileImageSelected, setIsProfileImageSelected] = useState();
  const { StorageAccessFramework } = FileSystem;

  const fileName = FileSystem.documentDirectory + 'userProfileImage.jpeg';
  const checkProfileImage = async () => {
    fileInfo = await FileSystem.getInfoAsync(fileName);
    console.log('fileInfo', fileInfo);
    setProfileImage(fileName);
    setIsProfileImageSelected(fileInfo.exists);
  };
  useEffect(() => {
    checkProfileImage();
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    });

    // console.log(result);

    if (!result.cancelled) {
      // TODO: Guardar imagen en el servidor
      // Guarda la imagen en el almacenamiento local con expo-file-system
      // TODO: conversión de tipos

      //   console.log('\n\nfileName', fileName);
      //   console.log('result.assets[0].uri', result.assets[0].uri);

      await FileSystem.moveAsync({
        from: result.assets[0].uri,
        to: fileName
      });
      //   fileInfo = await FileSystem.getInfoAsync(fileName);
      //   console.log('fileInfo dentro', fileInfo);
      setProfileImage(fileName + '?' + new Date().getTime());
      setIsProfileImageSelected(true);
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileText}>Editar perfil</Text>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageBorder}>
            <Image
              //   source={require('../img/profileImage.jpg')} // Ruta de la imagen de perfil
              style={styles.profileImage}
              source={
                isProfileImageSelected
                  ? { uri: profileImage + '?' + new Date() }
                  : require('../img/profileImage.jpg')
              }
            />
          </View>
        </View>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.container}>
          <TouchableOpacity onPress={pickImage} style={styles.button}>
            <Text style={styles.buttonText}>Cambiar imagen de perfil</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.textContainer}
          defaultValue={authState.nombre}
          onChangeText={(text) => setName(text)}
        />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.textContainer}
          defaultValue={authState.correo}
          onChangeText={(text) => setEmail(text)}
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.textContainer}
          defaultValue={authState.contrasena}
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
        />

        <Text style={styles.label}>Edad</Text>
        <View style={{ ...styles.input, justifyContent: 'center' }}>
          <Picker selectedValue={age} onValueChange={(itemValue) => setAge(itemValue)}>
            {[...Array(83)].map((_, i) => (
              <Picker.Item key={i} label={(i + 18).toString()} value={i + 18} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Sexo</Text>
        <View style={{ ...styles.input, justifyContent: 'center' }}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            defaultValue={
              authState.sexo == 'H' ? 'Masculino' : authState.sexo == 'M' ? 'Femenino' : 'Otro'
            }
          >
            <Picker.Item label="Masculino" value="H" />
            <Picker.Item label="Femenino" value="M" />
            <Picker.Item label="Otro" value="O" />
          </Picker>
        </View>

        <Text style={styles.label}>Preferencia Sexual</Text>
        <View style={{ ...styles.input, justifyContent: 'center' }}>
          <Picker
            selectedValue={sexualPreference}
            onValueChange={(itemValue, itemIndex) => setSexualPreference(itemValue)}
            defaultValue={
              authState.buscasexo == 'H'
                ? 'Hombres'
                : authState.buscasexo == 'M'
                  ? 'Mujeres'
                  : 'Todos'
            }
          >
            <Picker.Item label="Hombres" value="H" />
            <Picker.Item label="Mujeres" value="M" />
            <Picker.Item label="Todos" value="T" />
          </Picker>
        </View>

        <Text style={styles.label}>Preferencia de edad</Text>
        <View style={{ ...styles.agePreferenceContainer, flexDirection: 'row' }}>
          <Picker
            selectedValue={agePreferenceStart}
            style={styles.ageInput}
            onValueChange={(itemValue, itemIndex) => setAgePreferenceStart(itemValue)}
          >
            {[...Array(83).keys()].map((value, index) => (
              <Picker.Item key={index} label={(value + 18).toString()} value={value + 18} />
            ))}
          </Picker>
          <Text style={styles.rayaEdad}> - </Text>
          <Picker
            selectedValue={agePreferenceEnd}
            style={styles.ageInput}
            onValueChange={(itemValue, itemIndex) => setAgePreferenceEnd(itemValue)}
          >
            {[...Array(83).keys()].map((value, index) => (
              <Picker.Item key={index} label={(value + 18).toString()} value={value + 18} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.description}
          placeholder="Introduce tu descripción aquí"
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => setDescription(text)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // TODO: handleRegister();
            navigation.navigate('Cuenta');
          }}
        >
          <Text style={styles.buttonText}>Guardar</Text>
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

  header: {
    height: screenHeight * 0.27,
    backgroundColor: '#F89F9F'
  },
  profileInfo: {
    flex: 1,
    alignItems: 'center',
    marginTop: -screenHeight * 0.2
  },
  profileText: {
    color: 'white',
    fontSize: 30,
    padding: 20,
    fontWeight: 'bold'
  },
  profileImageContainer: {
    marginTop: 6,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileImageBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden'
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 70
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
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 10
  },
  dateInput: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignContent: 'center'
  },
  ageInput: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '45%'
  },
  description: {
    height: 240,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    padding: 10
  },
  textContainer: {
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'center'
  },
  button: {
    backgroundColor: '#F89F9F',
    paddingVertical: 10,
    marginVertical: 20,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16
  },
  errores: {
    marginTop: -10,
    color: 'red',
    fontSize: 12,
    marginBottom: 10
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
  },
  rayaEdad: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 14
  }
});