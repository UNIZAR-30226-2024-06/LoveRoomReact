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
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import AuthContext from '../components/AuthContext';

export default function Login({ navigation }) {
  const { setIsRegistered } = React.useContext(AuthContext);
  const [date, setDate] = React.useState(new Date());
  const [show, setShow] = React.useState(false);
  const [gender, setGender] = React.useState('Seleccione su género');
  const [sexualPreference, setSexualPreference] = React.useState('');
  const [agePreferenceStart, setAgePreferenceStart] = React.useState(18);
  const [agePreferenceEnd, setAgePreferenceEnd] = React.useState(30);
  const [description, setDescription] = React.useState('');

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
      <View style={[styles.logoContainer, { marginBottom: -90 }]}>
        <Image style={styles.logo} source={require('../img/logoTexto.png')} />
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Fecha de nacimiento</Text>
        <TouchableOpacity onPress={showDatepicker} style={styles.input}>
          <Text>{date.toDateString()}</Text>
        </TouchableOpacity>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            is24Hour={true}
            display="default"
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
          <Picker.Item label="Heterosexual" value="heterosexual" />
          <Picker.Item label="Homosexual" value="homosexual" />
          <Picker.Item label="Bisexual" value="bisexual" />
          <Picker.Item label="Asexual" value="asexual" />
          <Picker.Item label="Pansexual" value="pansexual" />
          <Picker.Item label="Otro" value="other" />
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
          style={styles.input}
          placeholder="Introduce tu descripción aquí"
          multiline={true}
          numberOfLines={4}
          onChangeText={(text) => setDescription(text)}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleRegister();
            navigation.navigate('Cuenta');
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
  ageInput: {
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '45%',
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
