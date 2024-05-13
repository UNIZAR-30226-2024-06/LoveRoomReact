import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { useContext } from 'react';
import AuthContext from '../components/AuthContext';
import { Swipeable } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import Video from 'react-native-video';

const ChatMessage = ({ data }) => {
  const { authState } = useContext(AuthContext);
  const swipeableRef = useRef(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState('');

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleReport = () => {
    console.log('Reportando mensaje:', data.id);
    handleFetchReport();
  };

  const handleFetchReport = async () => {
    console.log('mensaje a reportar: ', data);
    console.log('Reportando mensaje:', data.id);
    console.log('Reportado por: ', reportReason);
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/reports/${data.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authState.token}`
      },
      body: JSON.stringify({ motivo: reportReason.toString() })
    });
    const info = await response.json();
    console.log(info);
    setModalVisible(false);
    setReportReason('');
    setTimeout(() => {
      if (info.error == null) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Mensaje reportado',
          text2: 'El mensaje ha sido reportado correctamente',
          visibilityTime: 2500
        });
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Ha habido un error',
          text2: 'Vuelva a intentarlo',
          visibilityTime: 1000
        });
      }
    }, 500);
  };

  const [imageUrl, setImageUrl] = React.useState(null);
  const [videoUrl, setVideoUrl] = React.useState(null);
  const [modalImgVisible, setModalImgVisible] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  React.useEffect(() => {
    console.log('useEffect', data.rutamultimedia);
    if (data.rutamultimedia) {
      const url = `${process.env.EXPO_PUBLIC_API_URL}/multimedia/${data.rutamultimedia}/${authState.id}`;
      console.log('URL:', url);

      fetch(url, { method: 'HEAD' })
        .then((response) => {
          multimediaType = response.headers.get('Tipo');
          console.log('Tipo multimedia:', multimediaType);
          if (multimediaType == 'F') {
            setImageUrl(url);
          } else if (multimediaType == 'V') {
            setVideoUrl(url);
          }
        })
        .catch(console.error);
    }
  }, [data.rutamultimedia]);

  const MessageContent = () => (
    <>
      <View
        style={[
          styles.messageContainer,
          data.senderId == authState.id ? styles.currentUserMessage : styles.otherUserMessage
        ]}>
        <View
          style={[
            styles.triangle,
            data.senderId == authState.id ? styles.currentUserTriangle : styles.otherUserTriangle
          ]}
        />

        <View>
          {/* TODO: así se llama a la ruta del backend o hay que hacer un fetch */}
          {imageUrl || videoUrl ? (
            <View>
              {isImageLoading && (
                <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
              )}
              <TouchableOpacity onPress={() => setModalImgVisible(true)}>
                (imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: 250, height: 250, borderRadius: 15 }}
                  onLoad={() => setIsImageLoading(false)}
                  resizeMode="contain"
                />
                ) : (
                <Video
                  source={{ uri: videoUrl }}
                  style={{ width: 250, height: 250, borderRadius: 15 }}
                  resizeMode="contain"
                  ref={(ref) => {
                    this.player = ref;
                  }} // Store reference
                  onBuffer={this.onBuffer} // Callback when remote video is buffering
                  onError={this.videoError} // Callback when video cannot be loaded
                />
                ))
                {/* // style={{ width: '40%' }} resizeMode="contain" /> */}
              </TouchableOpacity>

              <Modal
                animationType="slide"
                transparent={false}
                visible={modalImgVisible}
                onRequestClose={() => {
                  setModalImgVisible(!modalImgVisible);
                }}>
                <View style={styles.centeredView}>
                  <TouchableOpacity
                    style={styles.modalView}
                    onPress={() => setModalImgVisible(false)}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={{ width: 400, height: 400 }}
                      onLoad={() => setIsImageLoading(false)}
                    />
                    {/* // styles.fullScreenImage} /> */}
                  </TouchableOpacity>
                </View>
              </Modal>
            </View>
          ) : (
            <Text style={styles.messageText}>{data.message}</Text>
          )}
        </View>
      </View>
    </>
  );

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancel}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reportar mensaje</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setReportReason(text)}
              placeholder="Motivo del reporte"
              multiline={true}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
                <Text style={styles.buttonText}>Reportar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Swipeable
        ref={swipeableRef}
        onSwipeableOpen={() => {
          swipeableRef.current.close();
          setTimeout(() => setModalVisible(true), 100);
        }}
        renderLeftActions={(progress, dragX) => {
          const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp'
          });
          return (
            <View
              style={{
                backgroundColor: 'transparent',
                justifyContent: 'center',
                padding: 20
              }}></View>
          );
        }}>
        <MessageContent />
      </Swipeable>
    </>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    maxWidth: '80%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 15,
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    position: 'relative',
    marginTop: 10 // Ajuste para el espacio entre el pico y el mensaje
  },
  currentUserMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#F89F9F',
    borderBottomRightRadius: 10 // Redondea la esquina inferior derecha
  },
  otherUserMessage: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 10 // Redondea la esquina inferior izquierda
  },
  messageText: {
    fontSize: 16
  },
  triangle: {
    width: 0,
    height: 5,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    position: 'absolute'
  },
  currentUserTriangle: {
    borderTopWidth: 10,
    borderRightWidth: 10,
    borderTopColor: '#F89F9F',
    borderRightColor: 'transparent',
    transform: [{ rotate: '90deg' }],
    right: 10, // Ajuste para posicionar el pico en el borde derecho
    bottom: -8 // Ajuste para posicionar el pico en la esquina inferior
  },
  otherUserTriangle: {
    borderTopWidth: 10,
    borderLeftWidth: 10,
    borderTopColor: '#E5E5EA',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '-90deg' }],
    left: 10, // Ajuste para posicionar el pico en el borde izquierdo
    bottom: -8 // Ajuste para posicionar el pico en la esquina inferior
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  cancelButton: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  reportButton: {
    backgroundColor: 'red',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    flex: 1,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  fullScreenImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  loader: {
    position: 'absolute'
  }
});

export default ChatMessage;
