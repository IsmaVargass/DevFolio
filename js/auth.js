// js/auth.js
// Authentication handling with toast notifications

document.addEventListener('DOMContentLoaded', () => {
    // Register
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('register-nombre').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;

            // Validación con Expresiones Regulares (Regex)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            // Contraseña: Mínimo 6 caracteres, al menos una letra y un número (acepta símbolos)
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

            if (!emailRegex.test(email)) {
                showToast('Por favor, introduce un email válido', 'error');
                return;
            }

            if (!passwordRegex.test(password)) {
                showToast('La contraseña debe tener al menos 6 caracteres, una letra y un número', 'error');
                return;
            }

            try {
                const response = await fetch('../api/auth/register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(result.user));

                    // Set flag for tutorial
                    localStorage.setItem('show_tutorial', 'true');

                    showToast('¡Registro exitoso! Redirigiendo...', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    showToast(result.error || 'Error al registrarse', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Error de conexión. Verifica que el servidor esté corriendo.', 'error');
            }
        });
    }

    // Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch('../api/auth/login.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(result.user));
                    showToast('¡Bienvenido! Redirigiendo...', 'success');
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 1000);
                } else {
                    showToast(result.error || 'Credenciales incorrectas', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                showToast('Error de conexión. Verifica que el servidor esté corriendo.', 'error');
            }
        });
    }
});
