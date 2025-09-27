// src/DetailScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
// *** CAMBIO CLAVE: Reemplazamos Feather por Ionicons para compatibilidad con Expo ***
import { Ionicons } from '@expo/vector-icons'; 

/**
 * Pantalla de Detalle de Producto
 * Muestra toda la información de un producto seleccionado.
 */
export default function DetailScreen({ route, navigation }) {
    // 1. Obtener el objeto del producto pasado por la navegación
    const { product } = route.params;

    // Aseguramos que el producto exista para evitar errores
    if (!product) {
        Alert.alert("Error", "No se encontró el producto.");
        navigation.goBack();
        return null;
    }

    // Construcción de la URL de la imagen. El placeholder ahora usa el color morado.
    const imageUrl = product.id 
                     ? `https://apiadministrador.onrender.com/productos/${product.id}/imagen`
                     : `https://placehold.co/400x300/7B24F8/FFFFFF?text=Imagen+No+Disponible`;
    

    // Función para manejar la edición o eliminación (funcionalidad futura)
    const handleAction = (action) => {
        Alert.alert(`${action} Producto`, `Funcionalidad para ${action} aún no implementada.`);
        // Aquí se navegaría a la pantalla de edición o se llamaría a la API de eliminación
    };

    return (
        <ScrollView style={styles.container}>
            <Image 
                style={styles.productImage} 
                source={{ uri: imageUrl }}
                onError={(e) => console.log('Error loading image:', e.nativeEvent.error)}
                resizeMode="cover"
            />
            
            <View style={styles.detailsCard}>
                
                {/* Nombre y Precio */}
                <Text style={styles.productName}>{product.nombre || 'Nombre Desconocido'}</Text>
                <Text style={styles.productPrice}>
                    $ {(parseFloat(product.precio) || 0).toFixed(2)}
                </Text>

                {/* Acciones (Botones de Administración) */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                        // Color: Lila más claro para Editar (#9F5FFD)
                        style={[styles.actionButton, { backgroundColor: '#9F5FFD' }]} 
                        onPress={() => handleAction('Editar')}
                    >
                        {/* Ícono de edición actualizado */}
                        <Ionicons name="create-outline" size={18} color="#fff" />
                        <Text style={styles.actionButtonText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        // Color: Rojo fuerte para Eliminar (mantiene la alerta)
                        style={[styles.actionButton, { backgroundColor: '#D90429' }]} 
                        onPress={() => handleAction('Eliminar')}
                    >
                        {/* Ícono de eliminación actualizado */}
                        <Ionicons name="trash-outline" size={18} color="#fff" />
                        <Text style={styles.actionButtonText}>Eliminar</Text>
                    </TouchableOpacity>
                </View>

                {/* Descripción */}
                <Text style={styles.sectionTitle}>Descripción</Text>
                <Text style={styles.descriptionText}>
                    {product.descripcion || 'No hay descripción detallada para este producto.'}
                </Text>

                {/* Detalles Adicionales */}
                <Text style={styles.sectionTitle}>Detalles</Text>
                <View style={styles.detailItem}>
                    {/* Ícono de stock actualizado y coloreado */}
                    <Ionicons name="cube-outline" size={16} color="#7B24F8" style={styles.detailIcon} />
                    <Text style={styles.detailText}>Stock: {product.stock || 0}</Text>
                </View>
                <View style={styles.detailItem}>
                    {/* Ícono de ID actualizado y coloreado */}
                    <Ionicons name="key-outline" size={16} color="#7B24F8" style={styles.detailIcon} />
                    <Text style={styles.detailText}>ID: {product.id || 'N/A'}</Text>
                </View>
                {product.categoria && (
                    <View style={styles.detailItem}>
                        {/* Ícono de categoría actualizado y coloreado */}
                        <Ionicons name="pricetag-outline" size={16} color="#7B24F8" style={styles.detailIcon} />
                        <Text style={styles.detailText}>Categoría: {product.categoria.nombre || product.categoria}</Text>
                    </View>
                )}

            </View>
        </ScrollView>
    );
}

// *** Estilos con Paleta Morada/Lila ***
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    productImage: {
        width: '100%',
        height: 300, 
        backgroundColor: '#E5E7EB', 
    },
    detailsCard: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -20, // Superpone ligeramente la imagen para un efecto moderno
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    productName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
    },
    productPrice: {
        fontSize: 22,
        fontWeight: '600',
        color: '#7B24F8', // Morado principal
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1F2937',
        marginTop: 20,
        marginBottom: 10,
    },
    descriptionText: {
        fontSize: 16,
        color: '#4B5563',
        lineHeight: 24,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
    },
    detailIcon: {
        marginRight: 10,
    },
    detailText: {
        fontSize: 15,
        color: '#4B5563',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    actionButton: {
        flexDirection: 'row',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%', 
        elevation: 3,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 16,
    }
});
