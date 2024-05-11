import React, { useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import SubscribeCard from 'react-native-subscribe-card';
import AuthContext from '../components/AuthContext';
import Toast from 'react-native-toast-message';

const { width: ScreenWidth, height: ScreenHeight } = Dimensions.get('window');

const App = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('premium');
  const { authState } = React.useContext(AuthContext);

  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName);
  };

  const handleContinue = () => {
    console.log(authState.tipousuario);
    console.log("plan selec:", selectedPlan);
    switch (selectedPlan) {
      case 'premium':
        navigation.navigate('Payment');
        break;

      case 'básico':
        navigation.pop();
        Toast.show({
          type: 'info',
          position: 'bottom',
          text1: 'Sigues siendo usuario básico',
          text2: 'No se han realizado cambios en tu suscripción',
          visibilityTime: 2500
        });
        break;

      default:
        break;
    }
  };

  const ContinueButton = () => (
    <View style={{ marginBottom: 16, alignItems: 'center' }}>
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
    <View style={{ height: ScreenHeight * 0.45, marginTop: 64, justifyContent: 'space-evenly' }}>
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
    <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#ffffff' }}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <HeaderContainer />
          <Plans />
          <ContinueButton />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default App;
