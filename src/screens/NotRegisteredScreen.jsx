import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

export default function NotRegisteredScreen() {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={styles.text}>X</Text>
            <Text style={styles.text}>Necesitas registrarte para ver este contenido</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.text}>Iniciar sesión</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
});