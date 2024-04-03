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
  Dimensions,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import AuthContext from '../components/AuthContext';
import * as FileSystem from 'expo-file-system';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function RegisterPreferencesScreen({ navigation }) {
  const { setIsRegistered } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [gender, setGender] = useState('Seleccione su género');
  const [sexualPreference, setSexualPreference] = useState('');
  const [agePreferenceStart, setAgePreferenceStart] = useState(18);
  const [agePreferenceEnd, setAgePreferenceEnd] = useState(30);
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState('');
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
      quality: 1,
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
        to: fileName,
      });
      //   fileInfo = await FileSystem.getInfoAsync(fileName);
      //   console.log('fileInfo dentro', fileInfo);
      setProfileImage(fileName);
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
        <Text style={styles.profileText}>Completar perfil</Text>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageBorder}>
            <Image
              //   source={require('../img/profileImage.jpg')} // Ruta de la imagen de perfil
              style={styles.profileImage}
              source={isProfileImageSelected ? { uri: profileImage } : require('../img/profileImage.jpg')}
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

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.dateInput}>
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            is24Hour={true}
            display="DD/MM/YYYY"
            onChange={onChange}
          />
        )}

        <Text style={styles.label}>Sexo</Text>
        <Picker
          selectedValue={gender}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => setGender(itemValue)}
        >
          <Picker.Item label="Masculino" value="male" />
          <Picker.Item label="Femenino" value="female" />
          <Picker.Item label="Otro" value="other" />
        </Picker>

        <Text style={styles.label}>Preferencia Sexual</Text>
        <Picker
          selectedValue={sexualPreference}
          style={styles.input}
          onValueChange={(itemValue, itemIndex) => setSexualPreference(itemValue)}
        >
          <Picker.Item label="Seleccione su preferencia sexual" value="" />
          <Picker.Item label="Hombres" value="men" />
          <Picker.Item label="Mujeres" value="women" />
          <Picker.Item label="Ambos" value="both" />
          <Picker.Item label="Todos" value="all" />
          <Picker.Item label="Otros" value="others" />
          {/* <Picker.Item label="Heterosexual" value="heterosexual" />
          <Picker.Item label="Homosexual" value="homosexual" />
          <Picker.Item label="Bisexual" value="bisexual" />
          <Picker.Item label="Pansexual" value="pansexual" />
          <Picker.Item label="Otro" value="other" /> */}
        </Picker>

        <Text style={styles.label}>Preferencia de edad</Text>
        <View style={{ ...styles.agePreferenceContainer, flexDirection: 'row' }}>
          <Picker
            selectedValue={agePreferenceStart}
            style={styles.ageInput}
            onValueChange={(itemValue, itemIndex) => setAgePreferenceStart(itemValue)}
          >
            {[...Array(100).keys()].map((value, index) => (
              <Picker.Item key={index} label={value.toString()} value={value} />
            ))}
          </Picker>
          <Text> _ </Text>
          <Picker
            selectedValue={agePreferenceEnd}
            style={styles.ageInput}
            onValueChange={(itemValue, itemIndex) => setAgePreferenceEnd(itemValue)}
          >
            {[...Array(100).keys()].map((value, index) => (
              <Picker.Item key={index} label={value.toString()} value={value} />
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
            navigation.navigate('UserGuidelines');
          }}
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

  header: {
    height: screenHeight * 0.273,
    backgroundColor: '#F89F9F',
  },
  profileInfo: {
    flex: 1,
    alignItems: 'center',
    marginTop: -screenHeight * 0.2,
  },
  profileText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileImageContainer: {
    marginTop: 6,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImageBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'white',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  dateInput: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    alignContent: 'center',
  },
  ageInput: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '45%',
  },
  description: {
    height: 240,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    textAlignVertical: 'top',
    padding: 10,
  },
  button: {
    backgroundColor: '#F89F9F',
    paddingVertical: 10,
    marginVertical: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
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
    color: '#F89F9F',
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
    color: '#F89F9F',
  },
  line: {
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: '45%',
    alignSelf: 'stretch', // Ajuste para que la línea ocupe todo el ancho
  },
});
