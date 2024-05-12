import React, { useState } from 'react';
import { View, Text, Dimensions, StatusBar, TouchableOpacity, SafeAreaView, ScrollView, StyleSheet, TextInput } from 'react-native';
import Toast from 'react-native-toast-message';

export default function RegisterPreferencesScreen({ navigation }) {
    const { width: ScreenWidth } = Dimensions.get('window');

    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [cvv, setCVV] = useState('');
    const [fechaCaducidad, setFechaCaducidad] = useState('');

    const handleContinue = () => {
        let correctInput = true;
        // Verificar si el número de tarjeta tiene 16 dígitos
        if (numeroTarjeta.length !== 16) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Tarjeta incorrecta',
                text2: 'El número de tarjeta debe tener 16 dígitos',
                visibilityTime: 2500
              });
            correctInput = false;
            return;
        }

        // Verificar si el CVV tiene 3 dígitos y son todos números
        if (!/^\d{3}$/.test(cvv)) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'CVV incorrecto',
                text2: 'El CVV debe tener 3 dígitos',
                visibilityTime: 2500
              });
            correctInput = false;
            return;
        }

        // Verificar si la fecha de caducidad es válida
        const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!datePattern.test(fechaCaducidad)) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Fecha incorrecta',
                text2: 'La fecha de caducidad debe tener el formato DD/MM/AAAA',
                visibilityTime: 2500
              });
            correctInput = false;
            return;
        }

        const [day, month, year] = fechaCaducidad.split('/');
        const isValid = isValidDate(day, month, year);
        if (!isValid) {
            Toast.show({
                type: 'error',
                position: 'bottom',
                text1: 'Fecha incorrecta',
                text2: 'La fecha de caducidad no es válida',
                visibilityTime: 2500
              });
            correctInput = false;
            return;
        }

        if (correctInput) {
            //FALTA
            //LLAMADA A BD
            //navigation.navigate('');
            Toast.show({
                type: 'success',
                position: 'bottom',
                text1: 'Validación exitosa',
                text2: '¡Validación exitosa! Pronto serás premium...',
                visibilityTime: 2500
            });
        }
    };

    // Función para verificar si una fecha es válida
    const isValidDate = (day, month, year) => {
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === parseInt(year) &&
            date.getMonth() === parseInt(month) - 1 &&
            date.getDate() === parseInt(day)
        );
    };

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, backgroundColor: '#ffffff' }} keyboardShouldPersistTaps={'handled'}>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <HeaderContainer />
                    <Formulario 
                        numeroTarjeta={numeroTarjeta}
                        setNumeroTarjeta={setNumeroTarjeta}
                        cvv={cvv}
                        setCVV={setCVV}
                        fechaCaducidad={fechaCaducidad}
                        setFechaCaducidad={setFechaCaducidad}
                    />
                    <ContinueButton handleContinue={handleContinue} /> 
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

const HeaderContainer = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: '80%', marginTop: '20%' }}>
            <Text
                style={{
                    textAlign: 'center',
                    color: '#000',
                    fontSize: 32,
                }}>
                ¡Estás a un solo paso!
            </Text>
            <View style={{ marginTop: 24 }}>
                <Text
                    style={{
                        color: '#000',
                        lineHeight: 18,
                        textAlign: 'center',
                    }}>
                    Rellena tus datos de pago para pasar a ser premium y disfrutar de todas las ventajas de la aplicación.
                </Text>
            </View>
        </View>
    </View>
);

const Formulario = ({ numeroTarjeta, setNumeroTarjeta, cvv, setCVV, fechaCaducidad, setFechaCaducidad }) => (
    <View style={{ height: Dimensions.get('window').height * 0.45, marginTop: 64 }}>
        <View style={styles.formContainer}>
            <Text style={styles.label}>Número de tarjeta</Text>
            <TextInput
                style={styles.textContainer}
                placeholder="XXXX XXXX XXXX XXXX"
                value={numeroTarjeta}
                onChangeText={setNumeroTarjeta}
                maxLength={16}
            />

            <Text style={styles.label}>CVV</Text>
            <TextInput
                style={styles.textContainer}
                placeholder="XXX"
                value={cvv}
                onChangeText={setCVV}
                keyboardType='numeric'
                maxLength={3}
            />

            <Text style={styles.label}>Fecha de caducidad</Text>
            <TextInput
                style={styles.textContainer}
                placeholder="DD/MM/AAAA"
                value={fechaCaducidad}
                onChangeText={setFechaCaducidad}
                keyboardType='numeric'
                maxLength={10}
            />
        </View>
    </View>
);

const ContinueButton = ({ handleContinue }) => (
    <View style={{ marginBottom: 16, alignItems: 'center' }}>
        <TouchableOpacity
            onPress={handleContinue}
            style={{
                height: 50,
                borderRadius: 12,
                width: Dimensions.get('window').width * 0.9,
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
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirmar</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        marginBottom: 5,
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    formContainer: {
        backgroundColor: '#ffffff',
        marginTop: 0,
        padding: 20,
        borderRadius: 10
    },
    textContainer: {
        borderColor: '#cccccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 35,
        marginBottom: 0,
        textAlignVertical: 'center',
        width: '100%',
    },
});
