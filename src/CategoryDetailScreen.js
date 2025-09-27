import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

/**
 * Pantalla de Detalle de Categoría
 * Muestra toda la información de una categoría seleccionada.
 */
export default function CategoryDetailScreen({ route, navigation }) {
    // Obtener el objeto de la categoría pasado por la navegación
    const { category } = route.params;

    // Aseguramos que la categoría exista para evitar errores
    if (!category || !category.id) {
        Alert.alert("Error", "No se encontró la categoría o le falta el ID.");
        navigation.goBack();
        return null;
    }

    // Construcción de la URL de la imagen de la categoría
    const imageUrl = `https://apiadministrador.onrender.com/categorias/${category.id}/imagen`;
    // Placeholder con fondo morado
    const placeholderUrl = `https://placehold.co/400x300/7B24F8/FFFFFF?text=Categoria+${category.id}`;
    
    // Usamos el placeholder como fallback
    const finalImageUrl = imageUrl || placeholderUrl;


    // Función para manejar las acciones de administración de categorías (futuro)
    const handleAction = (action) => {
        Alert.alert(`${action} Categoría`, `Funcionalidad para ${action} Categoría aún no implementada.`);
        // Aquí se navegaría a la pantalla de edición o se llamaría a la API de eliminación de Categoría
    };

    return (
        <ScrollView style={styles.container}>
            <Image 
                style={styles.categoryImage} 
                source={{ uri: finalImageUrl }}
                onError={(e) => {
                    console.log('Error loading category image:', e.nativeEvent.error);
                    // Si falla, intentamos usar un placeholder de respaldo.
                    // Si ya estamos usando el placeholder, simplemente ignoramos.
                    if (finalImageUrl !== placeholderUrl) {
                        // Podríamos actualizar el estado para mostrar el placeholder si la imagen real falla, 
                        // pero por simplicidad, lo manejaremos con el fallback de URL
                    }
                }}
                resizeMode="cover"
            />
            
            <View style={styles.detailsCard}>
                
                {/* Nombre de la Categoría */}
                <Text style={styles.categoryName}>{category.nombre || 'Nombre Desconocido'}</Text>

                {/* Acciones (Botones de Administración) */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                        // Lila más claro para Editar (#9F5FFD)
                        style={[styles.actionButton, { backgroundColor: '#9F5FFD' }]} 
                        onPress={() => handleAction('Editar')}
                    >
                        <Ionicons name="create-outline" size={18} color="#fff" />
                        <Text style={styles.actionButtonText}>Editar Categoría</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        // Rojo fuerte para Eliminar (#D90429)
                        style={[styles.actionButton, { backgroundColor: '#D90429' }]} 
                        onPress={() => handleAction('Eliminar')}
                    >
                        <Ionicons name="trash-outline" size={18} color="#fff" />
                        <Text style={styles.actionButtonText}>Eliminar Categoría</Text>
                    </TouchableOpacity>
                </View>


                {/* Detalles Adicionales */}
                <Text style={styles.sectionTitle}>Detalles de la Categoría</Text>
                <View style={styles.detailItem}>
                    <Ionicons name="key-outline" size={16} color="#7B24F8" style={styles.detailIcon} />
                    <Text style={styles.detailText}>ID: {category.id || 'N/A'}</Text>
                </View>

            </View>
        </ScrollView>
    );
}

// *** Estilos con Paleta Morada/Lila (similares a DetailScreen.js) ***
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    categoryImage: {
        width: '100%',
        height: 300, 
        backgroundColor: '#E5E7EB', 
    },
    detailsCard: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -20, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    categoryName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#7B24F8', // El nombre de la categoría en color principal
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
        paddingHorizontal: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        width: '48%', 
        elevation: 3,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 14,
    }
});
