import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AuthContext from '../components/AuthContext';
import NotRegisteredScreen from './NotRegisteredScreen';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function ProfileScreen() {
  const { authState } = React.useContext(AuthContext);

  if (!authState.isLoggedIn) {
    return <NotRegisteredScreen />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileText}>Perfil</Text>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageBorder}>
            <Image
              source={require('../img/profileImage.jpg')} // Ruta de la imagen de perfil
              style={styles.profileImage}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => console.log(authState)}>
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>
        <View style={styles.headlineContainer}>
          <View style={styles.headlineRectangle}>
            <Text style={styles.headlineText}>Acerca de</Text>
          </View>
          <TouchableOpacity style={styles.faqButton}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../img/ayudar.png')} style={styles.faqIcon} />
              <Text style={styles.faqText}>Preguntas frecuentes</Text>
            </View>
            <Icon name="chevron-right" size={25} color="#000" style={styles.arrowImage} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: screenHeight * 0.18,
    backgroundColor: '#F89F9F',
  },
  profileInfo: {
    flex: 1,
    alignItems: 'center',
    marginTop: -screenHeight * 0.16,
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
  editButton: {
    marginTop: 14,
    width: 140,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },

  headlineContainer: {
    marginTop: 60,
    width: '100%',
    height: 35,
    backgroundColor: '#E8DEDE',
  },

  headlineRectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Para distribuir los elementos horizontalmente
    paddingHorizontal: 20,
  },

  headlineText: {
    paddingTop: 8,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },

  faqButton: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Añade esta línea
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20, // Añade esta línea para dar un poco de espacio a los lados
  },

  faqIcon: {
    width: 25,
    height: 25,
    marginRight: 5,
  },

  faqText: {
    fontSize: 18,
    marginLeft: 5,
  },

  arrowImage: {
    width: 25,
    height: 25,
  },
});
