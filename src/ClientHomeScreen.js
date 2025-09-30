import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity, Alert } from 'react-native';
// Asumimos que la API también tiene una función para clientes (sin token de admin)
import { apiFetchAdminData } from './api'; 
import { Ionicons } from '@expo/vector-icons'; 

const PRIMARY_COLOR = '#8c00ffff'; 
const SECONDARY_COLOR = '#4A4A4A'; 

// Componente de tarjeta de producto simplificado para el cliente
const ClientProductCard = ({ product }) => (
    <View style={productStyles.card}>
        <Ionicons name="cart-outline" size={24} color={PRIMARY_COLOR} style={{marginRight: 10}} />
        <View style={productStyles.info}>
            <Text style={productStyles.name}>{product.nombre || 'Producto sin Nombre'}</Text>
            <Text style={productStyles.price}>Precio: ${(parseFloat(product.precio) || 0).toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={productStyles.addButton} disabled>
            <Text style={productStyles.addButtonText}>Ver</Text> 
        </TouchableOpacity>
    </View>
);

/**
 * Pantalla de inicio para el rol 'client'. Solo lectura del catálogo.
 */
export default function ClientHomeScreen({ navigation, userData, handleLogout }) {
    
    const [data, setData] = useState({ productos: [], categorias: [] });
    const [isLoading, setIsLoading] = useState(true);

    // Usa la misma API de datos, pero sin necesidad de pasar el token de administrador
    // Nota: En un sistema real, usarías una API separada: apiFetchClientData()
    const loadClientData = async () => {
        setIsLoading(true);
        try {
            // Utilizamos la API de administrador, pero solo para obtener los datos públicos (productos/categorías)
            const fetchedData = await apiFetchAdminData(userData.token); 
            setData(fetchedData);
        } catch (error) {
            console.error("Error al cargar datos del cliente:", error);
            Alert.alert("Error de Catálogo", "No se pudo cargar el catálogo de productos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadClientData(); 
    }, []);

    const onLogoutPress = () => {
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro que quieres salir?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Salir", onPress: handleLogout, style: "destructive" }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>BazarBEG - Tienda Online</Text>
                    <Text style={styles.headerSubtitle}>Bienvenido, {userData.email || 'Cliente'}</Text>
                </View>
                {/* Botón de Cerrar Sesión */}
                <TouchableOpacity onPress={onLogoutPress} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={PRIMARY_COLOR} />
                    <Text style={styles.loadingText}>Cargando catálogo...</Text>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={styles.listContent}
                    data={data.productos}
                    keyExtractor={(item, index) => (item.id || item.nombre || index).toString()}
                    renderItem={({ item }) => <ClientProductCard product={item} />}
                    ListHeaderComponent={() => (
                        <Text style={styles.sectionTitle}>Productos ({data.productos.length})</Text>
                    )}
                    ItemSeparatorComponent={() => <View style={{height: 10}} />}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#c5b5f0ff', 
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingTop: 50, 
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
    headerSubtitle: {
        fontSize: 14,
        color: SECONDARY_COLOR, 
    },
    logoutButton: {
        backgroundColor: '#d10000ff', 
        padding: 8,
        borderRadius: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: SECONDARY_COLOR,
    },
    listContent: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: SECONDARY_COLOR,
        marginBottom: 15,
    }
});

const productStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        borderLeftWidth: 4,
        borderLeftColor: PRIMARY_COLOR,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        color: PRIMARY_COLOR, 
    },
    addButton: {
        backgroundColor: PRIMARY_COLOR,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginLeft: 10,
    },
    addButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    }
});
