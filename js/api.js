// js/api.js

// js/api.js

const API_BASE_URL = '../api';

/**
 * Realiza una petición a la API.
 * @param {string} endpoint - El endpoint de la API (ej. '/auth/login.php').
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE).
 * @param {object} data - Datos a enviar en el cuerpo (opcional).
 * @returns {Promise<object>} - Respuesta JSON de la API.
 */
export async function apiFetch(endpoint, method = 'GET', data = null) {
    const url = `${API_BASE_URL}${endpoint}`;

    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || `Error ${response.status}: ${response.statusText}`);
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}
