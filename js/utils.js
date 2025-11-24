// js/utils.js

/**
 * Valida un email usando Expresiones Regulares.
 * @param {string} email 
 * @returns {boolean}
 */
export function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return re.test(email);
}

/**
 * Valida una contraseña (mínimo 6 caracteres).
 * @param {string} password 
 * @returns {boolean}
 */
export function validatePassword(password) {
    return password.length >= 6;
}

/**
 * Muestra una alerta simple (podría mejorarse con un toast).
 * @param {string} message 
 * @param {string} type - 'success' | 'error'
 */
export function showAlert(message, type = 'success') {
    alert(message); // Por ahora usamos alert nativo para cumplir requisitos básicos
}
