import React, { useRef } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useContext } from 'react';
import AuthContext from '../components/AuthContext';
import { Swipeable } from 'react-native-gesture-handler';

const ChatMessage = ({ data }) => {
  const { authState } = useContext(AuthContext);
  const swipeableRef = useRef(null);

  const handleReport = () => {
    Alert.alert(
      "Reportar mensaje",
      "¿Estás seguro de que quieres reportar este mensaje?",
      [
        {
          text: "Cancelar",
          onPress: () => console.log("Cancelado"),
          style: "cancel"
        },
        { text: "Reportar", onPress: () => handleFetchReport() }
      ]
    );
  };

  const handleFetchReport = async () => {
    console.log('Reportando mensaje:', data);
  }

  const MessageContent = () => (
    <View
      style={[
        styles.messageContainer,
        data.senderId == authState.id ? styles.currentUserMessage : styles.otherUserMessage
      ]}
    >
      <View
        style={[
          styles.triangle,
          data.senderId == authState.id ? styles.currentUserTriangle : styles.otherUserTriangle
        ]}
      />
      <Text style={styles.messageText}>{data.message}</Text>
    </View>
  );

  if (data.senderId == authState.id) {
    return <MessageContent />;
  } else {
    return (
      <Swipeable
        ref={swipeableRef}
        onSwipeableOpen={()=>{
          swipeableRef.current.close();
          handleReport();
        }}
        renderLeftActions={(progress, dragX) => {
          const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp',
          });
          return (
            <View style={{ backgroundColor: 'transparent', justifyContent: 'center', padding: 20 }}>
            </View>
          );
        }}
      >
        <MessageContent />
      </Swipeable>
    );
  }
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
  }
});

export default ChatMessage;
