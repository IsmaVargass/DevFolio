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

    if (isProtected && !user) {
        window.location.href = '../index.html';
    }
})();
