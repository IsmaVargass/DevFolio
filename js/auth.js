// js/auth.js
import { apiFetch } from './api.js';
import { showAlert } from './utils.js';

export async function checkSession() {
    try {
        const result = await apiFetch('/auth/session.php');
        if (!result.authenticated) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Error verificando sesión:', error);
        window.location.href = 'login.html';
    }
}

export async function login(email, password) {
    if (!email || !password) {
        showAlert('Rellena todos los campos', 'error');
        return;
    }

    try {
        await apiFetch('/auth/login.php', 'POST', { email, password });
        window.location.href = 'dashboard.html';
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

export async function register(nombre, email, password) {
    if (!nombre || !email || !password) {
        showAlert('Rellena todos los campos', 'error');
        return;
    }

    try {
        await apiFetch('/auth/register.php', 'POST', { nombre, email, password });
        alert('Registro exitoso. Inicia sesión.');
        window.location.href = 'login.html';
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

export async function logout() {
    try {
        await apiFetch('/auth/logout.php');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
    }
}
