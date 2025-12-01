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

            try {
                const response = await fetch('../api/auth/register.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ nombre, email, password })
                });

                const result = await response.json();

                if (response.ok) {
                    localStorage.setItem('user', JSON.stringify(result.user));
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
