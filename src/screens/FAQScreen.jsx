import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function F() {
    const [expanded, setExpanded] = useState([]);

    const toggleExpand = (index) => {
      setExpanded((prevExpanded) => {
        const newExpanded = [...prevExpanded];
        newExpanded[index] = !newExpanded[index];
        return newExpanded;
      });
    };

  const scrollViewRef = useRef(null); // Referencia a ScrollView

  const handleScroll = (event) => {
    const { y } = event.nativeEvent.contentOffset;
    if (y < 0) {
      // Si el usuario intenta desplazarse hacia abajo, establecer el desplazamiento en 0
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: false });
    }
  };

  const faqs = [
    { question: '¿Cuál es la diferencia entre una cuenta estándar y una cuenta premium?', answer: 'La cuenta estándar es gratuita y te ofrece acceso básico a las funciones de la aplicación. La cuenta premium, disponible mediante una suscripción de pago, ofrece ventajas adicionales como la capacidad de buscar perfiles más específicos, acceso prioritario a salas privadas y otras características exclusivas.' },
    { question: '¿Cómo puedo buscar vídeos de YouTube en la aplicación?', answer: 'En la sección de búsqueda, encontrarás una opción para buscar vídeos de YouTube. Ingresa palabras clave relacionadas con el contenido que te interesa y nuestra aplicación te mostrará resultados relevantes.' },
    { question: '¿Qué sucede si quiero abandonar una sala de forma permanente?', answer: 'Si decides abandonar una sala y no deseas volver a emparejarte con la persona con la que hiciste match, la sala será eliminada de manera permanente. Esto garantiza tu privacidad y te permite controlar tus conexiones.' },
    { question: '¿Cómo puedo pausar, avanzar o retroceder un vídeo mientras estoy en una sala?', answer: 'Tanto tú como tu pareja de sala tienen la capacidad de controlar la reproducción del vídeo. Simplemente toca los controles de reproducción en la interfaz del vídeo para realizar las acciones deseadas.' },
    { question: '¿Puedo cerrar la aplicación y volver a entrar en una sala sin perder mi progreso?', answer: 'Nuestra aplicación está diseñada para mantener la sincronización entre los usuarios incluso si cierras la aplicación y vuelves a entrar en la sala. No perderás el punto del vídeo ni se desincronizará.' },
    { question: '¿Cómo puedo modificar mi información personal?', answer: 'Para cambiar tu información personal en tu perfil, ve a la sección de perfil. Desde allí, seleciona la opción "Editar perfil", una vez ahí podrás actualizar detalles como tu nombre, edad, ubicación y descripción personal.' },
    { question: '¿Cómo elimino mi cuenta?', answer: 'Puedes eliminar tu cuenta en la parte inferior de la sección de tu perfil. Busca la opción "Eliminar cuenta" y sigue las instrucciones para completar el proceso.' },
    { question: '¿Qué debo hacer si olvidé mi contraseña?', answer: 'Si olvidaste tu contraseña, puedes restablecerla desde la pantalla de inicio de sesión o desde la sección de configuración en tu perfil. En la pantalla de inicio de sesión, busca la opción "¿Olvidaste tu contraseña?" y sigue las instrucciones para restablecerla a través del correo electrónico asociado a tu cuenta. Alternativamente, puedes acceder a la sección de configuración en tu perfil, donde también encontrarás la opción para restablecer o cambiar tu contraseña.' },
    { question: '¿Qué debo hacer si experimento problemas de conexión mientras uso la aplicación?', answer: 'Si experimentas problemas de conexión, primero verifica tu conexión a Internet y asegúrate de tener una señal estable. Si el problema persiste, intenta cerrar y volver a abrir la aplicación. Si los problemas continúan, ponte en contacto con nuestro equipo de soporte técnico para obtener ayuda adicional.' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        ref={scrollViewRef}
        scrollEventThrottle={16} // Controla con qué frecuencia se llamará al evento onScroll
        onScroll={handleScroll} // Manejador para el evento de desplazamiento
      >
        <View style={styles.innerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              ¿Cómo podemos{'\n'}
              ayudarte?
            </Text>
          </View>
          <Text style={styles.pregFrecuentes}>Preguntas frecuentes</Text>
          <Text style={styles.introduccion}>
            Desde LoveRoom, nos preocupamos por tu comodidad. Esta sección está diseñada para ayudarte a resolver tus dudas de la forma más rápida y sencilla posible.
          </Text>

          {faqs.map((faq, index) => (
            <TouchableOpacity key={index} onPress={() => toggleExpand(index)}>
              <View style={styles.faqContainer}>
                <Text style={[styles.faqQuestion, expanded[index] && styles.bold]}>
                  {faq.question}
                </Text>
                <Text style={styles.expandIcon}>{expanded[index] ? '-' : '+'}</Text>
              </View>
              {expanded[index] && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.contactContainer}>
        <Text style={styles.contactText}>¿Sigues con problemas? Puedes contactarnos en <Text style={[styles.bold, { fontWeight: 'bold', color: '#F89F9F' }]}>loveroomapp@gmail.com</Text></Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  innerContainer: {
    paddingBottom: 50, // Espacio para el componente de contacto fijo en la parte inferior
  },
  header: {
    backgroundColor: '#F89F9F',
    height: '27%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 30,
    color: '#fff',
    textAlign: 'center',
  },
  pregFrecuentes: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 17,
    marginBottom: 10,
  },
  introduccion: {
    fontSize: 15,
    paddingHorizontal: 17,
    color: '#888',
    textAlign: 'justify',
    marginBottom: 10,
  },
  faqContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  faqQuestion: {
    fontSize: 15,
    flex: 1,
  },
  expandIcon: {
    fontSize: 20,
  },
  faqAnswer: {
    marginTop: 5,
    paddingHorizontal: 17,
    textAlign: 'justify',
    paddingBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
  },
  contactContainer: {
    backgroundColor: '#f2f2f2',
    paddingVertical: 10,
    paddingHorizontal: 17,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  contactText: {
    textAlign: 'center',
    color: '#333',
  },
});
