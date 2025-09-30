import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { apiLogin } from './api'; // Asegúrate de que api.js esté en src/

const logoImage = require('../assets/Logo.png'); 
// Obtener dimensiones de la pantalla para diseño responsivo
const { width } = Dimensions.get('window');

// Definiciones de color
const PRIMARY_COLOR = '#7B24F8'; // Morado BazarBEG
const SECONDARY_COLOR = '#9933FF'; 
const INPUT_BORDER_COLOR = '#ccc';

/**
 * Pantalla de inicio de sesión.
 * Permite al usuario ingresar credenciales y autenticarse.
 * @param {object} props - Propiedades de navegación y la función handleLogin de App.js.
 */
const LoginScreen = ({ handleLogin }) => {
    // Credenciales de prueba temporales para desarrollo
    const [email, setEmail] = useState('adminBEG@gmail.com');
    const [password, setPassword] = useState('admin123');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Intenta autenticar al usuario usando la API.
     */
    const loginUser = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Por favor, ingresa tu correo y contraseña.");
            return;
        }

        setIsLoading(true);
        try {
            // Llama a la función de API para login
            const response = await apiLogin(email, password);

            if (response && response.token) {
                // Éxito: Llamamos a la función de App.js y pasamos los datos.
                // Asumimos que la respuesta (response) contiene { token: '...', role: '...' }
                
                // --- AJUSTE CLAVE AQUÍ ---
                // Si tu API envuelve los datos del usuario, por ejemplo: { data: { token: ..., user: { role: ... } } }
                // Debes cambiar la línea de abajo para extraer el token y el rol
                
                // Ejemplo de extracción (si la API devuelve { token, role, email }):
                const userData = {
                    token: response.token,
                    email: response.email,
                    role: response.role // Aquí se extrae el rol
                };
                
                handleLogin(userData);
            } else {
                // Falla: Si no hay token en la respuesta, es una credencial inválida.
                Alert.alert("Error de Acceso", "Credenciales inválidas o el servidor no devolvió un token de sesión.");
            }
        } catch (error) {
            console.error("Error durante el login:", error);
            // Mensaje de error general para el usuario
            Alert.alert("Error al iniciar sesión", "Credenciales inválidas o error de servidor.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.content}>
                {/* Título y Logo */}
                <Image
                    
                    source={logoImage} 
                    style={styles.logo}
                />
                <Text style={styles.title}>Bazar BEG</Text>
                <Text style={styles.subtitle}>Portal de Administración</Text>

                {/* Campos de Entrada */}
                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#888"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#888"
                />

                {/* Botón de Login */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={loginUser}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Cargando...' : 'Iniciar Sesión'}
                    </Text>
                </TouchableOpacity>

                {/* Enlace o Texto Adicional (opcional) */}
                <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: width * 0.85, // 85% del ancho de la pantalla
        padding: 30,
        borderRadius: 15,
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 8,
        alignItems: 'center',
    },
    logo: {
       width: 120, // Aumentado ligeramente para mejor vista
        height: 120,
        borderRadius: 60, // Mantiene forma circular
        marginBottom: 10,
        borderWidth: 3,
        borderColor: PRIMARY_COLOR,
        // La imagen debe llenar el espacio.
        resizeMode: 'cover' 
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: PRIMARY_COLOR,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: INPUT_BORDER_COLOR,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: PRIMARY_COLOR,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    forgotPassword: {
        marginTop: 20,
    },
    forgotPasswordText: {
        color: SECONDARY_COLOR,
        fontSize: 14,
    }
});

export default LoginScreen;
