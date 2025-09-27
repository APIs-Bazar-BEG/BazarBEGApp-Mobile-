import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { apiLogin } from './api';
// Cambiamos a Ionicons para consistencia con HomeScreen
import { Ionicons } from '@expo/vector-icons'; 

// Definimos el color principal de BazarBEG (Morado)
const PRIMARY_COLOR = '#7B24F8'; 
const SECONDARY_COLOR = '#5A1A9A'; // Morado más oscuro para textos y bordes

/**
 * Pantalla de Login
 * @param {object} props - Propiedades de navegación y manejo de autenticación.
 * @param {function} props.handleLogin - Función para establecer el estado de usuario en App.js.
 */
const LoginScreen = ({ handleLogin }) => { 
    
    const loginHandler = handleLogin || (() => console.log("handleLogin no disponible"));

    // Credenciales de prueba
    const [email, setEmail] = useState('adminBEG@gmail.com');
    const [password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginPress = async () => {
        if (!email || !password) {
            setError('Por favor, ingresa email y contraseña.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const userData = await apiLogin(email, password); 
            
            if (userData && userData.token) {
                // Si el login es exitoso, llamamos a la función pasada por App.js
                loginHandler(userData);
            } else {
                setError('Login exitoso, pero el servidor no envió el token de autenticación.');
            }
        } catch (err) {
            // Manejamos errores de autenticación o de red
            setError(err.message || 'Error de red o credenciales inválidas.');
            console.error('Error durante el login:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                
                {/* Ícono de Pavo Real estilizado (Brillos/Elegancia) */}
                <Ionicons name="sparkles" size={60} color={PRIMARY_COLOR} style={styles.logoIcon} />

                <Text style={styles.title}>Bazar BEG</Text>
                
                {/* Input de Email */}
                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={24} color={SECONDARY_COLOR} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Correo electrónico"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Input de Contraseña */}
                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={24} color={SECONDARY_COLOR} style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                {/* Mensaje de Error */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Botón de Login */}
                <TouchableOpacity
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    onPress={handleLoginPress}
                    disabled={isLoading}
                    activeOpacity={0.8}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>INGRESAR</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAEAEA', // Fondo Gris claro
    },
    card: {
        width: '90%',
        maxWidth: 400,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 30,
        elevation: 15,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        borderTopWidth: 5,
        borderTopColor: PRIMARY_COLOR, // Borde superior morado
    },
    logoIcon: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 26,
        fontWeight: '900', // Muy negrita para impacto
        marginBottom: 30,
        textAlign: 'center',
        color: SECONDARY_COLOR, // Morado oscuro
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7F7F7',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: '#333',
    },
    button: {
        backgroundColor: PRIMARY_COLOR, // Morado principal
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    buttonDisabled: {
        backgroundColor: '#C8A2C8', // Lila apagado
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#D90429', // Rojo de error
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default LoginScreen;
