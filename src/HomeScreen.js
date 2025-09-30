// src/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { apiFetchAdminData } from './api'; 
// Usamos Ionicons de @expo/vector-icons para asegurar que los íconos se vean
import { Ionicons } from '@expo/vector-icons'; 

// Componente para renderizar cada producto
const ProductCard = ({ product, onProductPress }) => (
    <TouchableOpacity 
        style={productStyles.card}
        onPress={() => onProductPress(product)} 
        activeOpacity={0.7} 
    >
        {/* Usamos un ícono de Ionicons */}
        <Ionicons name="bag-handle-outline" size={24} color="#7B24F8" />
        <View style={productStyles.info}>
            <Text style={productStyles.name}>{product.nombre || 'Producto sin Nombre'}</Text>
            <Text style={productStyles.price}>${(parseFloat(product.precio) || 0).toFixed(2)} | Stock: {product.stock || 0}</Text>
            <Text style={productStyles.description}>{product.descripcion || "Sin descripción."}</Text>
        </View>
    </TouchableOpacity>
);

/**
 * Pantalla principal que muestra productos y categorías.
 */
export default function HomeScreen({ navigation, userData, handleLogout }) {
    
    const [data, setData] = useState({ productos: [], categorias: [] });
    const [isLoading, setIsLoading] = useState(true);

    const loadAdminData = async () => {
        setIsLoading(true);
        try {
            const fetchedData = await apiFetchAdminData(userData.token); 
            setData(fetchedData);
        } catch (error) {
            console.error("Error al cargar datos del administrador:", error);
            Alert.alert("Error de Datos", `No se pudieron cargar los datos: ${error.message}.`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAdminData(); 
    }, []);
    
    const navigateToDetail = (product) => {
        navigation.navigate('Detail', { product: product });
    };

    // FUNCIÓN DE NAVEGACIÓN A DETALLE DE CATEGORÍA (NUEVA)
    const navigateToCategoryDetail = (category) => {
        navigation.navigate('CategoryDetail', { category: category });
    };

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
    
    // Función para navegar a la nueva pantalla de Creación de Producto (futuro paso)
    const navigateToCreateProduct = () => {
        // Asumiendo que crearás una pantalla llamada 'CreateProduct'
        // navigation.navigate('CreateProduct');
        Alert.alert("Añadir Producto", "Funcionalidad de creación de producto pendiente.");
    };


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>BazarBEG - Catálogo</Text>
                    <Text style={styles.headerSubtitle}>
                        Usuario: {userData.email || 'N/A'}
                    </Text>
                </View>
                {/* Botón de Añadir Producto (Administración) */}
                <TouchableOpacity onPress={navigateToCreateProduct} style={styles.addButton}>
                    <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                {/* Botón de Cerrar Sesión */}
                <TouchableOpacity onPress={onLogoutPress} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#7B24F8" />
                    <Text style={styles.loadingText}>Cargando datos del administrador...</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Sección de Categorías */}
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="list-outline" size={20} color="#7B24F8" /> Categorías ({data.categorias.length})
                    </Text>
                    <View style={styles.categoriesContainer}>
                        {data.categorias.map((c, index) => (
                            // HACEMOS LA PASTILLA CLICKABLE PARA NAVEGAR A DETALLE
                            <TouchableOpacity 
                                key={c.id || c.nombre || index} 
                                style={styles.categoryPill}
                                onPress={() => navigateToCategoryDetail(c)} // Llama a la nueva función de navegación
                                activeOpacity={0.8}
                            >
                                <Text style={styles.categoryText}>{c.nombre}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Sección de Productos */}
                    <Text style={styles.sectionTitle}>
                        <Ionicons name="cube-outline" size={20} color="#7B24F8" /> Productos ({data.productos.length})
                    </Text>
                    
                    <FlatList
                        data={data.productos}
                        keyExtractor={(item, index) => (item.id || item.nombre || index).toString()}
                        renderItem={({ item }) => (
                            <ProductCard 
                                product={item} 
                                onProductPress={navigateToDetail} 
                            />
                        )}
                        scrollEnabled={false}
                        ItemSeparatorComponent={() => <View style={{height: 10}} />}
                    />
                </ScrollView>
            )}
        </View>
    );
}

// *** Estilos con Paleta Morada/Lila ***

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#9e6ee2ff', // Morado principal
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        paddingTop: 50, // Espacio para la barra de estado
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#D1D5DB', // Lila claro
    },
    logoutButton: {
        backgroundColor: '#D90429', // Rojo para Logout
        padding: 10,
        borderRadius: 25,
        elevation: 5,
    },
    addButton: {
        backgroundColor: '#721bf5ff', // Lila más claro para Añadir
        padding: 10,
        borderRadius: 25,
        elevation: 5,
        marginRight: 10, // Espacio entre Añadir y Logout
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#6B7280',
    },
    scrollContent: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 15,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
        paddingBottom: 5,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    categoryPill: {
        backgroundColor: '#F3E5FF', // Lila muy claro
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        marginRight: 8,
        marginBottom: 8,
    },
    categoryText: {
        color: '#5A1A9A', // Morado oscuro
        fontWeight: '600',
        fontSize: 14,
    }
});

const productStyles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#F9FAFB',
        padding: 15,
        borderRadius: 12,
        borderLeftWidth: 5,
        borderLeftColor: '#7B24F8', // Morado principal en borde
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    },
    info: {
        marginLeft: 15,
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    price: {
        fontSize: 14,
        color: '#7B24F8', // Precio en morado
    },
    description: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 5,
    }
});
