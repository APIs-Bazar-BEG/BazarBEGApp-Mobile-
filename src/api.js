// src/api.js

// URLs Base de tus servicios alojados en Render
const API_LOGIN_URL = 'https://apiloginregistro-1.onrender.com';
const API_ADMIN_URL = 'https://apiadministrador.onrender.com';

/**
 * 1. Simulación de manejo de errores y respuesta HTTP
 */
const handleResponse = async (response) => {
    // Si la respuesta no es OK (ej: 401, 500), lanzamos un error con el mensaje de la API
    if (!response.ok) {
        let errorData;
        try {
            // Intentar leer el JSON de error que viene de tu backend
            errorData = await response.json();
        } catch (e) {
            // Si no se puede leer el JSON, usar el estado HTTP
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        // Usar el mensaje de error que viene en el cuerpo del JSON (si existe)
        throw new Error(errorData.message || `Error ${response.status}: Credenciales inválidas o error de servidor.`);
    }
    // Si la respuesta es OK, retornar el JSON
    return response.json();
};

/**
 * 2. API de Login
 * Se comunica con https://apiloginregistro-1.onrender.com/auth/login
 * @param {string} email - Email del usuario.
 * @param {string} password - Contraseña del usuario.
 * @returns {Promise<{token: string, userId: number, role: string, user: object}>}
 */
export const apiLogin = async (email, password) => {
    const endpoint = `${API_LOGIN_URL}/auth/Login`; // Asegúrate que el casing sea correcto (Login)

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await handleResponse(response);
        
        // Asumimos que la API retorna un objeto con el token y quizás otros datos del usuario
        // Ejemplo de lo que se espera: { token: '...', user: { id: 1, rol_id: 1, ... } }
        if (!data.token) {
             throw new Error("El servidor no proporcionó un token de autenticación.");
        }

        // Retornamos los datos clave para la sesión
        return {
            token: data.token,
            userId: data.user.id, // Suponiendo que el ID viene dentro de 'user'
            role: data.user.rol_id === 1 ? 'ADMIN' : 'CLIENTE', // Ejemplo de mapeo de rol
            user: data.user // Todos los datos del usuario logueado
        };
        
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        // Relanzar el error para que LoginScreen lo maneje
        throw error; 
    }
};

/**
 * 3. Funciones para obtener datos públicos (no requieren token)
 */

// Función para obtener Productos
export const fetchProducts = async () => {
    const endpoint = `${API_ADMIN_URL}/productos`;
    try {
        const response = await fetch(endpoint);
        const data = await handleResponse(response);
        // Asumimos que la API retorna un array de productos directamente
        return data;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw new Error('No se pudo cargar la lista de productos.');
    }
};

// Función para obtener Categorías
export const fetchCategories = async () => {
    const endpoint = `${API_ADMIN_URL}/categorias`;
    try {
        const response = await fetch(endpoint);
        const data = await handleResponse(response);
        // Asumimos que la API retorna un array de categorías directamente
        return data;
    } catch (error) {
        console.error('Error al obtener categorías:', error);
        throw new Error('No se pudo cargar la lista de categorías.');
    }
};


/**
 * 4. Función principal para la Home Screen
 * Llama a ambas funciones públicas.
 * @returns {Promise<{productos: Array, categorias: Array}>}
 */
export const apiFetchAdminData = async () => {
    // Utilizamos Promise.all para hacer ambas peticiones GET simultáneamente
    const [productos, categorias] = await Promise.all([
        fetchProducts(),
        fetchCategories()
    ]);

    // Retornamos un objeto con ambos arrays
    return { productos, categorias };
};
