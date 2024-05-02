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

const OtherProfile = ({ route }) => {
  // Obtener el usuario desde los parámetros de navegación
  const { user } = route.params;

  const statusBarHeight = StatusBar.currentHeight;

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
                user.fotoperfil !== 'null.jpg'
                  ? { uri: user.fotoperfil }
                  : require('../img/perfil-vacio-con-relleno.png')
              }
            />
          </View>
        </View>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre completo:</Text>
        <Text style={styles.text}>{user.nombre}</Text>

        <Text style={styles.label}>Sexo:</Text>
        <Text style={styles.text}>
          {user.sexo === 'H' ? 'Masculino' : user.sexo === 'M' ? 'Femenino' : 'Otro'}
        </Text>

        <Text style={styles.label}>Localidad:</Text>
        <Text style={styles.text}>{provinciasDeEspana[user.idlocalidad]}</Text>

        <Text style={styles.label}>Fecha de nacimiento:</Text>
        <Text style={styles.text}>{user.edad}</Text>

        <Text style={styles.label}>Preferencia Sexual:</Text>
        <Text style={styles.text}>
          {user.buscasexo === 'H' ? 'Hombres' : user.buscasexo === 'M' ? 'Mujeres' : 'Ambos'}
        </Text>

        <View style={styles.labelContainer}>
          <Text style={styles.label}>Preferencia de edad:</Text>
          <Text style={styles.sliderLabel}>
            {user.buscaedadmin}-{user.buscaedadmax}
          </Text>
        </View>

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
