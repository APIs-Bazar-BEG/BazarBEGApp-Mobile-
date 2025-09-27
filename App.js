// App.js
import 'react-native-gesture-handler'; // Importación requerida para evitar errores
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

// Importar las pantallas
import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/HomeScreen';
import DetailScreen from './src/DetailScreen'; 
import CategoryDetailScreen from './src/CategoryDetailScreen'; // <--- NUEVA IMPORTACIÓN
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

// Definimos el color principal de BazarBEG (Morado)
const PRIMARY_COLOR = '#7B24F8';

/**
 * Componente principal que maneja la autenticación y la navegación.
 */
const App = () => {
    // user: { userData: { user: {...}, token: '...' } } o null si no está autenticado
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Función que se llama desde LoginScreen al iniciar sesión con éxito.
     * @param {object} userData - Datos del usuario y token recibidos de la API.
     */
    const handleLogin = (userData) => {
        setUser(userData);
    };

    /**
     * Función para cerrar sesión, restablece el estado del usuario a null.
     */
    const handleLogout = () => {
        setUser(null);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {/* Establece la barra de estado con un color oscuro para que contraste con el encabezado morado */}
            <StatusBar style="light" /> 
            <Stack.Navigator
                // Opciones comunes para el encabezado (Header)
                screenOptions={{
                    headerStyle: { backgroundColor: PRIMARY_COLOR }, // Aplicamos el color morado de BazarBEG
                    headerTintColor: '#fff', 
                    headerTitleStyle: { fontWeight: 'bold' }
                }}
            >
                {/* Si 'user' es nulo, mostramos la pantalla de Login. */}
                {!user ? (
                    <Stack.Screen
                        name="Login"
                        options={{ headerShown: false }} 
                    >
                        {/* Renderiza la pantalla y pasa handleLogin como prop */}
                        {(props) => <LoginScreen {...props} handleLogin={handleLogin} />}
                    </Stack.Screen>
                ) : (
                    // Si 'user' tiene datos (está logueado), mostramos las pantallas internas.
                    <>
                        <Stack.Screen
                            name="Home"
                            options={{ title: 'Bazar BEG - Admin' }}
                        >
                            {/* Renderiza la pantalla y pasa los datos esenciales como props */}
                            {(props) => (
                                <HomeScreen 
                                    {...props} 
                                    userData={user} 
                                    handleLogout={handleLogout} 
                                />
                            )}
                        </Stack.Screen>

                        {/* 1. RUTA: Pantalla de Detalle del Producto */}
                        <Stack.Screen
                            name="Detail"
                            component={DetailScreen}
                            options={({ route }) => ({
                                // Usamos el nombre del producto en el encabezado
                                title: route.params.product.nombre || 'Detalle del Producto', 
                                headerBackTitle: 'Volver'
                            })}
                        />
                        
                        {/* 2. NUEVA RUTA: Pantalla de Detalle de Categoría */}
                        <Stack.Screen
                            name="CategoryDetail" // Nombre de la nueva ruta
                            component={CategoryDetailScreen}
                            options={({ route }) => ({
                                // Usamos el nombre de la categoría en el encabezado
                                title: route.params.category.nombre || 'Detalle de Categoría', 
                                headerBackTitle: 'Catálogo'
                            })}
                        />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default App;
