import React, { useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import SubscribeCard from 'react-native-subscribe-card';

const { width: ScreenWidth } = Dimensions.get('screen');

const App = () => {
  // Inicializa selectedPlan con 'premium' para que esté seleccionado por defecto
  const [selectedPlan, setSelectedPlan] = useState('premium');

  // Función para manejar la selección de un plan
  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName);
  };

  const ContinueButton = () => (
    <View
      style={{
        flex: 1,
        marginBottom: 16,
        justifyContent: 'flex-end',
      }}>
      <TouchableOpacity
        style={{
          height: 50,
          borderRadius: 12,
          width: ScreenWidth * 0.9,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#805bfa',
          shadowRadius: 12,
          shadowOpacity: 0.5,
          shadowColor: '#805bfa',
          shadowOffset: {
            width: 0,
            height: 3,
          },
        }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );

  const HeaderContainer = () => (
    <View style={{ width: '80%', marginTop: '20%' }}>
      <Text
        style={{
          textAlign: 'center',
          color: '#fff',
          fontSize: 32,
        }}>
        Planes disponibles
      </Text>
      <View style={{ marginTop: 24 }}>
        <Text
          style={{
            color: '#fff',
            lineHeight: 18,
            textAlign: 'center',
          }}>
          Elige el plan premium para desbloquear todas las funcionalidades de la aplicación, como salas ilimitadas.
        </Text>
      </View>
    </View>
  );

  const Plans = () => (
    <View style={{ height: '45%', marginTop: 64, justifyContent: 'space-evenly' }}>
      <SubscribeCard
        title="Plan premium"
        descriptionPrice=" "
        description="¡Salas ilimitadas y más!"
        currency="€"
        price={9}
        timePostfix="/mes"
        isSelected={selectedPlan === 'premium'}
        discountText="¡Oferta!"
        onPress={() => handlePlanSelect('premium')}
      />
      <SubscribeCard
        title="Plan básico"
        description="Funcionalidades limitadas"
        isSelected={selectedPlan === 'básico'}
        onPress={() => handlePlanSelect('básico')}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#202020', alignItems: 'center' }}>
      <StatusBar barStyle="light-content" />
      <HeaderContainer />
      <Plans />
      <ContinueButton />
    </SafeAreaView>
  );
};

export default App;
