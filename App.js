import 'react-native-gesture-handler'; 
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

// Importar las pantallas
import LoginScreen from './src/LoginScreen';
import HomeScreen from './src/HomeScreen';
import DetailScreen from './src/DetailScreen'; 
import CategoryDetailScreen from './src/CategoryDetailScreen'; 
import ClientHomeScreen from './src/ClientHomeScreen'; 
import { StatusBar } from 'expo-status-bar';

const Stack = createNativeStackNavigator();

// Definimos el color principal de BazarBEG (Morado)
const PRIMARY_COLOR = '#7B24F8';

/**
 * Componente principal que maneja la autenticación y la navegación.
 */
const App = () => {
    // userData: { token: '...', role: 'admin'/'client' } o null
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Función que se llama desde LoginScreen al iniciar sesión con éxito.
     */
    const handleLogin = (data) => {
        // data debe contener { token, email, role }
        setUserData(data);
    };

    /**
     * Función para cerrar sesión.
     */
    const handleLogout = () => {
        setUserData(null);
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                <Text style={styles.loadingText}>Cargando aplicación...</Text>
            </View>
        );
    }

    // Obtenemos el token y el rol
    const userToken = userData?.token;
    // Asumimos que si no hay rol, es el rol por defecto (admin)
    const userRole = userData?.role || 'ADMIN'; 

    return (
        <NavigationContainer>
            <StatusBar style="light" /> 
            <Stack.Navigator
                screenOptions={{
                    headerStyle: { backgroundColor: PRIMARY_COLOR }, 
                    headerTintColor: '#fff', 
                    headerTitleStyle: { fontWeight: 'bold' }
                }}
            >
                {/* --------------------- LÓGICA DE NAVEGACIÓN PRINCIPAL --------------------- */}
                {!userToken ? (
                    // 1. SIN AUTENTICAR: Mostrar solo Login
                    <Stack.Screen
                        name="Login"
                        options={{ headerShown: false }} 
                    >
                        {(props) => <LoginScreen {...props} handleLogin={handleLogin} />}
                    </Stack.Screen>
                ) : userRole === 'ADMIN' ? (
                    // 2. AUTENTICADO COMO ADMINISTRADOR: Mostrar Rutas de Gestión
                    <>
                        <Stack.Screen
                            name="Home"
                            options={{ title: 'Bazar BEG - Inventario', headerShown: false }}
                        >
                            {(props) => (
                                <HomeScreen 
                                    {...props} 
                                    userData={userData} 
                                    handleLogout={handleLogout} 
                                />
                            )}
                        </Stack.Screen>

                        <Stack.Screen
                            name="CreateProduct"
                            options={{ title: 'Añadir Nuevo Producto' }}
                        >
                            {(props) => <CreateProductScreen {...props} userData={userData} />}
                        </Stack.Screen>

                        <Stack.Screen
                            name="Detail"
                            component={DetailScreen}
                            options={({ route }) => ({
                                title: route.params.product.nombre || 'Detalle Producto', 
                                headerBackTitle: 'Volver'
                            })}
                        />

                        <Stack.Screen
                            name="CategoryDetail" 
                            component={CategoryDetailScreen}
                            options={({ route }) => ({
                                title: route.params.category.nombre || 'Detalle Categoría', 
                                headerBackTitle: 'Catálogo'
                            })}
                        />
                    </>
                ) : (
                    // 3. AUTENTICADO COMO CLIENTE (O CUALQUIER OTRO ROL): Mostrar Rutas de Tienda
                    <>
                        <Stack.Screen
                            name="ClientHome"
                            options={{ title: 'Bazar BEG - Tienda', headerShown: false }}
                        >
                            {(props) => (
                                <ClientHomeScreen 
                                    {...props} 
                                    userData={userData} 
                                    handleLogout={handleLogout} 
                                />
                            )}
                        </Stack.Screen>
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
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: PRIMARY_COLOR,
    }
});

export default App;
