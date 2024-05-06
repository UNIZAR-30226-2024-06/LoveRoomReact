import { useState, useContext, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import AuthContext from '../components/AuthContext';
import * as FileSystem from 'expo-file-system';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Feather } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const provinciasDeEspana = [
  'Álava',
  'Albacete',
  'Alicante',
  'Almería',
  'Asturias',
  'Ávila',
  'Badajoz',
  'Baleares',
  'Barcelona',
  'Burgos',
  'Cáceres',
  'Cádiz',
  'Cantabria',
  'Castellón',
  'Ceuta',
  'Ciudad Real',
  'Córdoba',
  'Cuenca',
  'Gerona',
  'Granada',
  'Guadalajara',
  'Guipúzcoa',
  'Huelva',
  'Huesca',
  'Jaén',
  'La Coruña',
  'La Rioja',
  'Las Palmas',
  'León',
  'Lérida',
  'Lugo',
  'Madrid',
  'Málaga',
  'Melilla',
  'Murcia',
  'Navarra',
  'Orense',
  'Palencia',
  'Pontevedra',
  'Salamanca',
  'Santa Cruz de Tenerife',
  'Segovia',
  'Sevilla',
  'Soria',
  'Tarragona',
  'Teruel',
  'Toledo',
  'Valencia',
  'Valladolid',
  'Vizcaya',
  'Zamora',
  'Zaragoza'
]; 

export default function RegisterPreferencesScreen({ navigation }) {
  console.log(authState);
  //Solo se hace estado cuando se quiere mostrar algo
  const { authState, setAuthState } = useContext(AuthContext);
  const [name, setName] = useState(authState.nombre);
  const [fechaNacimiento, setFechaNacimiento] = useState(authState.fechaNacimiento);
  const [show, setShow] = useState(false);
  const [gender, setGender] = useState(authState.sexo);
  const [sexualPreference, setSexualPreference] = useState(authState.buscasexo);
  const [agePreference, setAgePreference] = useState([
    authState.buscaedadmin,
    authState.buscaedadmax
  ]);
  const [description, setDescription] = useState(authState.descripcion);
  const [profileImage, setProfileImage] = useState(authState.fotoperfil);
  const [idlocalidad, setIdLocalidad] = useState(authState.idlocalidad);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isProfileImageSelected, setIsProfileImageSelected] = useState();
  const { StorageAccessFramework } = FileSystem;

  const handleSave = () => {
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/user/update`);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState.token}`
      },
      body: JSON.stringify({
        correo: authState.correo,
        nombre: name,
        //FALTA PONER FECHA NACIMIENTO Y QUITAR EDAD
        edad: 21,
        sexo: gender,
        buscaedadmin: agePreference[0],
        buscaedadmax: agePreference[1],
        buscasexo: sexualPreference,
        descripcion: description,
        //subir foto primero a multimedia yt luego actualizarla
        fotoperfil: 'null.jpg', //para que se pueda actualziar, subirla al multimedia y nos devolvera un path para subir,
        idlocalidad: idlocalidad
      })
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(authState);
        if (data == 'Usuario actualizado correctamente') {
          setAuthState((prevState) => ({
            ...prevState,
            edad: 21,
            sexo: gender,
            nombre: name,
            buscaedadmin: agePreference[0],
            buscaedadmax: agePreference[1],
            buscasexo: sexualPreference,
            descripcion: description,
            //subir foto primero a multimedia yt luego actualizarla
            fotoperfil: 'null.jpg', //para que se pueda actualziar, subirla al multimedia y nos devolvera un path para subir,
            idlocalidad: idlocalidad
          }));
          navigation.navigate('Cuenta');
          console.log('G: Actualizo bien');
        } else if (data.error == 'Error al actualizar el usuario') {
          console.log('G: Actualizo mal');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        console.log('Llega al catch');
      });
  };

  const valueToId = (value) => {
    const index = provinciasDeEspana.indexOf(value);
    setIdLocalidad(index + 1);
  };

  const idToValue = (id) => {
    return provinciasDeEspana[id - 1];
  };

  const handleDateChange = (text) => {
    // Elimina todos los caracteres que no sean números
    const cleanedText = text.replace(/[^0-9]/g, '');

    // Formatea la fecha de acuerdo al formato DD/MM/AAAA
    let formattedText = '';
    let formattedCursorPosition = cursorPosition;

    for (let i = 0; i < cleanedText.length; i++) {
      if (i === 2 || i === 4) {
        formattedText += '/';
        if (i < cursorPosition) {
          formattedCursorPosition++;
        }
      }
      formattedText += cleanedText[i];
    }

    // Asegúrate de que el texto formateado no exceda los 10 caracteres
    if (formattedText.length > 10) {
      formattedText = formattedText.slice(0, 10);
    }

    setFechaNacimiento(formattedText);
    // Actualiza la posición del cursor
    setCursorPosition(formattedCursorPosition);
  };

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
          <TouchableOpacity style={styles.editIconContainer} onPress={pickImage}>
            <Feather name="edit" size={25} color="black" />
          </TouchableOpacity>
          <View style={styles.profileImageBorder}>
            <Image
              style={styles.profileImage}
              source={
                isProfileImageSelected
                  ? { uri: profileImage + '?' + new Date() }
                  : require('../img/profileImage.jpg') //OBTENER FOTO DE LA BASE DE DATOS NO?
              }
            />
          </View>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre completo</Text>
        <TextInput
          style={styles.textContainer}
          defaultValue={authState.nombre}
          onChangeText={(text) => setName(text)}
        />

        <Text style={styles.label}>Género</Text>
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

        <Text style={styles.label}>Localidad</Text>
        <View style={{ ...styles.input, justifyContent: 'center' }}>
          <Picker
            selectedValue={idToValue(idlocalidad)}
            onValueChange={(itemValue) => {
              const index = provinciasDeEspana.indexOf(itemValue);
              setIdLocalidad(index + 1);
            }}
          >
            {provinciasDeEspana.map((provincia, index) => (
              <Picker.Item key={index} label={provincia} value={provincia} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TextInput
          style={styles.dateInput}
          value={fechaNacimiento}
          onChangeText={handleDateChange}
          placeholder="DD/MM/AAAA"
          maxLength={10}
          keyboardType="numeric"
          onSelectionChange={(event) => {
            setCursorPosition(event.nativeEvent.selection.start);
          }}
        />

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
            <Picker.Item label="Ambos" value="T" />
          </Picker>
        </View>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Preferencia de edad</Text>
          <Text style={styles.sliderLabel}>
            {agePreference[0]}-{agePreference[1]}
          </Text>
        </View>
        <View style={styles.sliderContainer}>
          <MultiSlider
            values={agePreference}
            sliderLength={screenWidth - 40}
            min={18}
            max={100}
            step={1}
            onValuesChange={(values) => setAgePreference(values)}
            allowOverlap={false}
            snapped={true}
            minMarkerOverlapDistance={20}
            selectedStyle={{
              backgroundColor: '#F89F9F'
            }}
            markerStyle={{
              backgroundColor: '#F89F9F'
            }}
            customMarker={(e) => {
              return <View style={styles.customMarker} />;
            }}
          />
        </View>

        <Text style={styles.label}>Descripción</Text>
        <TextInput
          style={styles.description}
          placeholder="Cuéntanos un poco sobre ti..."
          multiline={true}
          numberOfLines={4}
          defaultValue={authState.descripcion}
          onChangeText={(text) => setDescription(text)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleSave();
          }}
        >
          <Text style={styles.buttonText}> Guardar</Text>
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

  editIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 15,
    padding: 5,
    borderColor: 'black',
    borderWidth: 1,
    zIndex: 1
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
    fontSize: 20,
    padding: 10,
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
    width: '100%', // Reduzca ligeramente el tamaño de la imagen
    height: '100%', // Reduzca ligeramente el tamaño de la imagen
    borderRadius: 70,
    marginBottom: 0,
    marginRight: 0 // Añade este estilo para evitar que el ícono de edición cubra la imagen
  },
  formContainer: {
    backgroundColor: '#ffffff',
    marginTop: 0,
    padding: 20,
    borderRadius: 10
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
    fontWeight: 'bold',
    textAlign: 'left'
  },

  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10
  },

  sliderText: {
    fontSize: 16,
    marginBottom: 10
  },
  slider: {
    width: '100%'
  },

  sliderContainer: {
    marginBottom: 0
  },

  customMarker: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: '#F89F9F'
  },
  sliderLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  sliderLabel: {
    fontSize: 16
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
    height: 35,
    marginBottom: 0,
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
  },
  dateInput: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlign: 'left' // Centra el texto
  }
});
