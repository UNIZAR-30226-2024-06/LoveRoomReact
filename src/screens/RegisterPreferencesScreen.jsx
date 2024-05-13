import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  ActivityIndicator,
} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import AuthContext from '../components/AuthContext';
import * as FileSystem from 'expo-file-system';
import { Feather } from '@expo/vector-icons';
import { differenceInYears } from 'date-fns';


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const provinciasDeEspana = [
  '-- Seleccione su localidad --',
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
  const { authState, setAuthState } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [gender, setGender] = useState('');
  const [sexualPreference, setSexualPreference] = useState('');
  const [agePreference, setAgePreference] = useState([18, 100]);
  const [description, setDescription] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [idlocalidad, setIdLocalidad] = useState(0);
  const [isProfileImageSelected, setIsProfileImageSelected] = useState();
  const { StorageAccessFramework } = FileSystem;
  const isDataSaved = useRef(false);
  const [descriptionLength, setDescriptionLength] = useState(0);

  const [genderError, setGenderError] = useState(false);
  const [idlocalidadError, setIdLocalidadError] = useState(false);
  const [sexualPreferenceError, setSexualPreferenceError] = useState(false);
  const [fechaNacimientoError, setFechaNacimientoError] = useState(false);
  const [isValidDate, setIsValidDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    return () => {
      console.log(isDataSaved);
      if (isDataSaved.current === false) {
        console.log('Cleaning up...');
        handleDelete();
      }
    };
  }, []);

  const handleSave = () => {
    // Calcular la edad a partir de la fecha de nacimiento
    const [day, month, year] = fechaNacimiento.split('/').map(Number);
    const birthday = new Date(year, month - 1, day); // Date espera el mes basado en 0-index
    const currentDate = new Date();
    const edad = differenceInYears(currentDate, birthday);
    console.log('Edad:', edad)
  
    // Verificar si la edad es mayor o igual a 18 años
    if (edad < 18) {
      setFechaNacimientoError(true); // Establecer el error de fecha de nacimiento
      return; // Salir de la función si la edad no es válida
    }
  
    setIsLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState.token}`
      },
      body: JSON.stringify({
        correo: authState.correo,
        nombre: authState.nombre,
        edad: edad,
        sexo: gender,
        buscaedadmin: agePreference[0],
        buscaedadmax: agePreference[1],
        buscasexo: sexualPreference,
        descripcion: description,
        fotoperfil: 'null.jpg',
        idlocalidad: idlocalidad
      })
    })
    .then((response) => response.json())
    .then((data) => {
      setIsLoading(false);
      console.log(data);
      if (data === 'Usuario actualizado correctamente') {
        isDataSaved.current = true;
        setAuthState((prevState) => ({
          ...prevState,
          edad: edad, // Actualiza la edad con el valor calculado
          sexo: gender,
          buscaedadmin: agePreference[0],
          buscaedadmax: agePreference[1],
          buscasexo: sexualPreference,
          descripcion: description,
          fotoperfil: 'null.jpg',
          idlocalidad: idlocalidad
        }));
        navigation.navigate('Cuenta');
        console.log('Preferencias del registro configuradas correctamente');
      } else if (data.error === 'Error al actualizar el usuario') {
        console.log('Error al configurar las preferencias del usuario');
      }
    })
    .catch((error) => {
      setIsLoading(false);
      console.error('Error:', error);
    });
  };
  
  

  const idToValue = (id) => {
    return provinciasDeEspana[id];
  };

  const handleDelete = () => {
    console.log(`${process.env.EXPO_PUBLIC_API_URL}/user/delete`);
    fetch(`${process.env.EXPO_PUBLIC_API_URL}/user/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        navigation.navigate('Register');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // Función para verificar si un año es bisiesto
  const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  // Función para obtener el número de días en un mes específico
  const getDaysInMonth = (month, year) => {
    const daysInMonths = {
      1: 31,
      2: isLeapYear(year) ? 29 : 28, // febrero tiene 28 días o 29 si es bisiesto
      3: 31,
      4: 30,
      5: 31,
      6: 30,
      7: 31,
      8: 31,
      9: 30,
      10: 31,
      11: 30,
      12: 31
    };
    return daysInMonths[month];
  };

  // Función para verificar si una fecha es válida considerando los años bisiestos y días en cada mes
  const checkDate = (day, month, year) => {
    if (year < 1900 || year > new Date().getFullYear()) {
      return false;
    }

    if (month < 1 || month > 12) {
      return false;
    }

    const daysInMonth = getDaysInMonth(month, year);

    return day >= 1 && day <= daysInMonth;
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
    setCursorPosition(formattedCursorPosition);

    // Valida la fecha para evitar errores en el input
    const [day, month, year] = formattedText.split('/').map(Number);
    const valid = checkDate(day, month, year);
    setIsValidDate(valid);
    setFechaNacimientoError(false);
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
      setProfileImage(fileName + '?' + new Date());
      setIsProfileImageSelected(true);
    }
  };

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps={'handled'}>
      <View style={styles.header} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileText}>Completar perfil</Text>
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
                  : require('../img/perfil-vacio.png')
              }
            />
          </View>
        </View>
      </View>

      <Modal
        transparent={true}
        animationType={'none'}
        visible={isLoading}
        onRequestClose={() => {
          console.log('close modal');
        }}
      >
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator animating={isLoading} size="large" color="#F89F9F" />
            <Text style={styles.loadingText}>Creando cuenta...</Text>
          </View>
        </View>
      </Modal>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Género</Text>
        <View style={[styles.input, genderError && styles.inputError]}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => {
              setGender(itemValue);
              setGenderError(false);
            }}
          >
            <Picker.Item label="-- Seleccione su género --" value="" />
            <Picker.Item label="Masculino" value="H" />
            <Picker.Item label="Femenino" value="M" />
            <Picker.Item label="Otro" value="O" />
          </Picker>
        </View>
        {genderError && <Text style={styles.errorText}>* Por favor, seleccione un género.</Text>}

        <Text style={styles.label}>Localidad</Text>
        <View style={[styles.input, idlocalidadError && styles.inputError]}>
          <Picker
            selectedValue={idToValue(idlocalidad)}
            onValueChange={(itemValue) => {
              const index = provinciasDeEspana.indexOf(itemValue);
              setIdLocalidad(index);
              setIdLocalidadError(false);
            }}
          >
            {provinciasDeEspana.map((provincia, index) => (
              <Picker.Item key={index} label={provincia} value={provincia} />
            ))}
          </Picker>
        </View>
        {idlocalidadError && (
          <Text style={styles.errorText}>* Por favor, seleccione una localidad.</Text>
        )}

        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TextInput
          style={[styles.dateInput, fechaNacimientoError && styles.dateInputError]}
          value={fechaNacimiento}
          onChangeText={handleDateChange}
          placeholder="DD/MM/AAAA"
          maxLength={10}
          keyboardType="numeric"
          onSelectionChange={(event) => {
            // Captura la posición actual del cursor
            setCursorPosition(event.nativeEvent.selection.start);
          }}
        />
        {fechaNacimientoError && (
          <Text style={styles.errorText}>
            * Por favor, introduzca una fecha de nacimiento válida.
          </Text>
        )}

        <Text style={styles.label}>Preferencia Sexual</Text>
        <View style={[styles.input, sexualPreferenceError && styles.inputError]}>
          <Picker
            selectedValue={sexualPreference}
            onValueChange={(itemValue) => {
              // Utiliza llaves para encapsular ambas instrucciones
              setSexualPreference(itemValue);
              setSexualPreferenceError(false);
            }}
          >
            <Picker.Item label="-- Seleccione su preferencia sexual --" value="" />
            <Picker.Item label="Hombres" value="H" />
            <Picker.Item label="Mujeres" value="M" />
            <Picker.Item label="Ambos" value="T" />
          </Picker>
        </View>
        {sexualPreferenceError && (
          <Text style={styles.errorText}>* Por favor, seleccione una preferencia sexual.</Text>
        )}

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
        <View style={styles.descriptionInputContainer}>
          <TextInput
            style={styles.description}
            placeholder="Cuéntanos un poco sobre ti..."
            multiline={true}
            numberOfLines={4}
            maxLength={500}
            onChangeText={(text) => {
              setDescription(text);
              setDescriptionLength(text.length);
            }}
            value={description}
          />
          <Text style={styles.characterCount}>{descriptionLength}/500</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            let isFormValid = true;
            if (gender === '') {
              setGenderError(true);
              isFormValid = false;
            }
            if (idlocalidad === 0) {
              setIdLocalidadError(true);
              isFormValid = false;
            }
            if (sexualPreference === '') {
              setSexualPreferenceError(true);
              isFormValid = false;
            }
            if (!isValidDate) {
              setFechaNacimientoError(true);
              isFormValid = false;
            }
            if (isFormValid) {
              console.log('Guardando...: ', authState);
              handleSave();
            }
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

  descriptionInputContainer: {
    position: 'relative'
  },
  description: {
    height: 100,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    paddingRight: 40,
    marginBottom: 10
  },
  characterCount: {
    position: 'absolute',
    bottom: 15,
    right: 8,
    color: '#666',
    fontSize: 12
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

  slider: {
    width: '100%'
  },

  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5
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

  sliderLabel: {
    fontSize: 16
  },

  input: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center'
  },

  inputError: {
    height: 40,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center'
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

  dateInput: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlign: 'left' // Centra el texto
  },

  dateInputError: {
    height: 40,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlign: 'left' // Centra el texto
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00000040'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 120,
    width: 200,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  loadingText: {
    textAlign: 'center', // Centra el texto
    flexWrap: 'wrap' // Permite que el texto se ajuste
  }
});
