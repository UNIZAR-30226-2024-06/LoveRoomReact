import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import AuthContext from '../components/AuthContext';
import NotRegisteredScreen from './NotRegisteredScreen';
import * as FileSystem from 'expo-file-system';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default function ProfileScreen({ navigation }) {
  const { authState, setAuthState } = React.useContext(AuthContext);
  if (!authState.isLoggedIn) {
    return <NotRegisteredScreen />;
  }
  const scrollViewRef = useRef(null);

  const [isProfileImageSelected, setIsProfileImageSelected] = useState(false);

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
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleScroll = (event) => {
    const { y } = event.nativeEvent.contentOffset;
    if (y < 0) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
    }
  };

  const checkProfileImage = async () => {
    const fileInfo = await FileSystem.getInfoAsync(userProfileImage);
    setIsProfileImageSelected(fileInfo.exists);
    if (fileInfo.exists) {
      updateProfileImage(FileSystem.documentDirectory + 'userProfileImage.jpeg');
      console.log('Profile image updated');
    }
  };

  const [userProfileImage, setUserProfileImage] = useState(
    FileSystem.documentDirectory + 'userProfileImage.jpeg'
  );

  const updateProfileImage = async (newImageUri) => {
    setUserProfileImage(newImageUri);
  };

  useEffect(() => {
    checkProfileImage();
  }, [userProfileImage]);

  useFocusEffect(
    React.useCallback(() => {
      checkProfileImage();
      return () => {};
    }, [userProfileImage])
  );

  return (
    <ScrollView
      style={styles.container}
      ref={scrollViewRef}
      scrollEventThrottle={16}
      onScroll={handleScroll}
    >
      <View style={styles.header} />
      <View style={styles.profileInfo}>
        <Text style={styles.profileText}>Perfil</Text>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImageBorder}>
            <Image
              source={
                isProfileImageSelected
                  ? { uri: userProfileImage + '?' + new Date() }
                  : require('../img/profileImage.jpg')
              } // Ruta de la imagen de perfil
              style={styles.profileImage}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            console.log(authState);
            navigation.navigate('EditProfile');
            //navigation.navigate('RegisterPreferences');
          }}
        >
          <Text style={styles.editButtonText}>Editar perfil</Text>
        </TouchableOpacity>

        <View style={styles.headlineContainer}>
          <View style={styles.headlineRectangle}>
            <Text style={styles.headlineText}>Mi plan</Text>
          </View>
          <TouchableOpacity
            style={styles.faqButton}
            onPress={() => {
              console.log(authState);
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../img/premium.png')} style={styles.faqIcon} />
              <Text style={styles.faqText}>¡Hazte premium!</Text>
            </View>
            <Icon name="chevron-right" size={25} color="#000" style={styles.arrowImage} />
          </TouchableOpacity>
        </View>

        <View style={styles.headlineContainer}>
          <View style={styles.headlineRectangle}>
            <Text style={styles.headlineText}>Acerca de</Text>
          </View>
          <View>
            <TouchableOpacity
              style={styles.faqButton}
              onPress={() => {
                navigation.navigate('FAQ');
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../img/ayudar.png')} style={styles.faqIcon} />
                <Text style={styles.faqText}>Preguntas frecuentes</Text>
              </View>
              <Icon name="chevron-right" size={25} color="#000" style={styles.arrowImage} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.faqButton}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../img/llamada.png')} style={styles.faqIcon} />
                <Text style={styles.faqText}>Contáctanos</Text>
              </View>
              <Icon name="chevron-right" size={25} color="#000" style={styles.arrowImage} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.faqButton}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../img/informacion.png')} style={styles.faqIcon} />
                <Text style={styles.faqText}>Sobre nosotros</Text>
              </View>
              <Icon name="chevron-right" size={25} color="#000" style={styles.arrowImage} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.faqButton}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../img/verificado.png')} style={styles.faqIcon} />
                <Text style={styles.faqText}>Gestión de credenciales</Text>
              </View>
              <Icon name="chevron-right" size={25} color="#000" style={styles.arrowImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headlineCuentaCont}>
          <View style={styles.headlineCuentaRect}>
            <Text style={styles.headlineCuentaText}>Cuenta</Text>
          </View>
          <TouchableOpacity
            style={styles.faqButton}
            onPress={() => {
              Alert.alert(
                'Cerrar sesión',
                '¿Estás seguro de que quieres cerrar sesión?',
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel'
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      setAuthState({
                        isLoggedIn: false,
                        id: null,
                        token: null,
                        correo: null,
                        contrasena: null,
                        nombre: null,
                        sexo: null,
                        edad: null,
                        idLocalidad: null,
                        buscaedadmin: null,
                        buscaedadmax: null,
                        buscasexo: null,
                        fotoperfil: null,
                        descripcion: null,
                        tipousuario: null,
                        baneado: false
                      });
                      AsyncStorage.removeItem('token');
                    }
                  }
                ],
                { cancelable: false }
              );
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../img/salida.png')} style={styles.faqIcon} />
              <Text style={styles.faqText}>Cerrar sesión</Text>
            </View>
            <Icon name="chevron-right" size={25} color="#000" style={styles.arrowImage} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.faqButton}
            onPress={() => {
              Alert.alert(
                'Borrar cuenta',
                '¿Estás seguro de que quieres borrar tu cuenta?\n\nADVERTENCIA: Esta es una opción permanente y no se puede deshacer.',
                [
                  {
                    text: 'Cancelar',
                    style: 'cancel'
                  },
                  {
                    text: 'OK',
                    onPress: () => {
                      handleDelete();
                      setAuthState({
                        isLoggedIn: false,
                        id: null,
                        token: null,
                        correo: null,
                        contrasena: null,
                        nombre: null,
                        sexo: null,
                        edad: null,
                        idLocalidad: null,
                        buscaedadmin: null,
                        buscaedadmax: null,
                        buscasexo: null,
                        fotoperfil: null,
                        descripcion: null,
                        tipousuario: null,
                        baneado: false
                      });
                      AsyncStorage.removeItem('token');
                    }
                  }
                ],
                { cancelable: false }
              );
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../img/borrar.png')} style={styles.faqIcon} />
              <Text style={styles.faqText}>Borrar cuenta</Text>
            </View>
            <Icon name="chevron-right" size={25} color="#000" style={styles.arrowImage} />
          </TouchableOpacity>
        </View>
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
    height: screenHeight * 0.17,
    backgroundColor: '#F89F9F'
  },
  profileInfo: {
    flex: 1,
    alignItems: 'center',
    marginTop: -screenHeight * 0.17
  },
  profileText: {
    color: 'white',
    fontSize: 20,
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
  editButton: {
    marginTop: 14,
    width: 140,
    height: 40,
    backgroundColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },

  headlineContainer: {
    marginTop: 50,
    width: '100%',
    height: 35,
    backgroundColor: '#E8DEDE'
  },

  headlineRectangle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Para distribuir los elementos horizontalmente
    paddingHorizontal: 20
  },

  headlineText: {
    paddingTop: 8,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },

  headlineCuentaCont: {
    marginTop: 185,
    width: '100%',
    height: 130
  },

  headlineCuentaRect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Para distribuir los elementos horizontalmente
    paddingHorizontal: 20,
    paddingBottom: 5,
    backgroundColor: '#E8DEDE',
    height: 35
  },

  headlineCuentaText: {
    paddingTop: 8,
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },

  faqButton: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between', // Añade esta línea
    alignItems: 'center',
    paddingHorizontal: 15 // Añade esta línea para dar un poco de espacio a los lados
  },

  faqIcon: {
    width: 20,
    height: 20,
    marginRight: 5
  },

  contactIcon: {
    width: 30,
    height: 30,
    marginRight: 0
  },

  faqText: {
    fontSize: 18,
    marginLeft: 5
  },

  arrowImage: {
    width: 25,
    height: 25
  }
});
