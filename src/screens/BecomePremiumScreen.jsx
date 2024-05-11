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
import AuthContext from '../components/AuthContext';
import Toast from 'react-native-toast-message';

const { width: ScreenWidth } = Dimensions.get('screen');

const App = () => {
  // Inicializa selectedPlan con 'premium' para que esté seleccionado por defecto
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const { authState, setAuthState } = React.useContext(AuthContext);

  // Función para manejar la selección de un plan
  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName);
  };

  // Función para manejar el botón de continuar
  // const handleContinue = () => {
  //   console.log(authState.tipousuario)
  //   if (authState.tipousuario == 'premium') {
  //     switch (selectedPlan) {
  //       case 'premium':
  //         navigator.pop();
  //         Toast.show({
  //           type: 'success',
  //           position: 'bottom',
  //           text1: 'Ya eres premium',
  //           text2: 'No se han realizado cambios en tu suscripción',
  //           visibilityTime: 2500
  //         });

  //         case 'normal':
  //           setAuthState({ ...authState, tipousuario: 'normal' });
  //           navigator.pop();
  //           Toast.show({
  //             type: 'success',
  //             position: 'bottom',
  //             text1: 'Plan cambiado correctamente',
  //             text2: 'Se han eliminado las funcionalidades premium',
  //             visibilityTime: 2500
  //           });


  //   if (selectedPlan === 'premium') {
  //     // Haz algo si el plan seleccionado es premium
  //   } else if (selectedPlan === 'básico') {
  //     navigation.pop();
  //   }
  // };
  

  const ContinueButton = (  ) => (
    <View
      style={{
        flex: 1,
        marginBottom: 16,
        justifyContent: 'flex-end',
      }}>
      <TouchableOpacity
      onPress={() => {
        handleContinue();
      }}
        style={{
          height: 50,
          borderRadius: 12,
          width: ScreenWidth * 0.9,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#F89F9F',
          shadowRadius: 12,
          shadowOpacity: 0.5,
          shadowColor: '#F89F9F',
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
          color: '#000',
          fontSize: 32,
        }}>
        Planes disponibles
      </Text>
      <View style={{ marginTop: 24 }}>
        <Text
          style={{
            color: '#000',
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
        price={9.99}
        isSelected={selectedPlan === 'premium'}
        discountText="¡Oferta!"
        onPress={() => handlePlanSelect('premium')}
        selectedContainerStyle={{ backgroundColor: '#F89F9F' }}
        selectedOuterContainerStyle={{ borderColor: '#F89F9F' }}
        discountTextStyle={{ color: '#F89F9F' }}
        priceTextStyle={{ color: '#F89F9F' }}
        currencyTextStyle={{ color: '#F89F9F' }}
      />
      <SubscribeCard
        title="Plan básico"
        description="Funcionalidades limitadas"
        isSelected={selectedPlan === 'básico'}
        onPress={() => handlePlanSelect('básico')}
        selectedContainerStyle={{ backgroundColor: '#F89F9F' }}
        selectedOuterContainerStyle={{ borderColor: '#F89F9F' }}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff', alignItems: 'center' }}>
      <StatusBar barStyle="light-content" />
      <HeaderContainer />
      <Plans />
      <ContinueButton />
    </SafeAreaView>
  );
};

export default App;
