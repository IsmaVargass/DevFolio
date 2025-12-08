// js/auth-guard.js - Protección para páginas autenticadas
(function () {
    const user = JSON.parse(localStorage.getItem('user'));
    const currentPage = window.location.pathname;

    // Páginas que requieren autenticación
    const protectedPages = [
        '/html/dashboard.html',
        '/html/profile.html',
        '/html/skills.html',
        '/html/experience.html',
        '/html/messages.html',
        '/html/communities.html',
        '/html/portfolio_builder.html',
        '/html/customer_support.html',
        '/html/admin_panel.html'
    ];

    // Comprobar si la página actual está protegida
    const isProtected = protectedPages.some(page => currentPage.includes(page));

    if (isProtected) {
        if (!user) {
            window.location.href = '../index.html';
        } else {
            // Verificar sesión con el servidor para mantener sincronizado el rol
            fetch('../api/auth/session.php')
                .then(response => response.json())
                .then(data => {
                    if (!data.authenticated) {
                        // Si la sesión expiró en el servidor, limpiar y redirigir
                        localStorage.removeItem('user');
                        window.location.href = '../index.html';
                    } else if (data.user) {
                        // Verificar si hubo cambios en el usuario (ej. cambio de rol)
                        if (JSON.stringify(user) !== JSON.stringify(data.user)) {
                            console.log('Datos de usuario actualizados, recargando...');
                            localStorage.setItem('user', JSON.stringify(data.user));
                            window.location.reload();
                        }
                    }
                })
                .catch(err => console.error('Error verificando sesión:', err));
        }
    }
})();
