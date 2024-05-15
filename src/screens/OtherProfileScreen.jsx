import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';

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

const OtherProfile = ({ user, userPhotoUrl }) => {
  const idToValue = (id) => {
    return provinciasDeEspana[id - 1];
  };

  // Obtener el usuario desde los parámetros de navegación
  console.log('user:', userPhotoUrl);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Perfil de {user.nombre}</Text>
      </View>
      <View style={styles.profileInfo}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageBorder}>
            <Image
              style={styles.profileImage}
              source={
                userPhotoUrl !== 'http://48.216.156.246/multimedia/null.jpg'
                  ? { uri: userPhotoUrl }
                  : require('../img/perfil-vacio-con-relleno.png')
              }
            />
          </View>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre:</Text>
        <Text style={styles.text}>{user.nombre}</Text>

        <Text style={styles.label}>Sexo:</Text>
        <Text style={styles.text}>
          {user.sexo === 'H' ? 'Masculino' : user.sexo === 'M' ? 'Femenino' : 'Otro'}
        </Text>

        <Text style={styles.label}>Localidad:</Text>
        <Text style={styles.text}>{idToValue(user.idlocalidad)}</Text>

        <Text style={styles.label}>Edad:</Text>
        <Text style={styles.text}>{user.edad}</Text>

        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.text}>{user.descripcion}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    backgroundColor: '#F89F9F',
    paddingHorizontal: 20,
    paddingVertical: 80
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    padding: 10
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: -150 / 2 // Mitad de la altura de la imagen de perfil
  },
  profileImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginBottom: 20
  },
  profileImageBorder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: 'white',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
  },
  profileImage: {
    width: '100%',
    height: '100%'
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5
  },
  text: {
    fontSize: 16,
    marginBottom: 15
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 15,
    paddingEnd: 20
  },
  sliderLabel: {
    fontSize: 16
  }
});

export default OtherProfile;
