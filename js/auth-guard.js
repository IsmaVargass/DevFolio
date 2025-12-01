// js/auth-guard.js - Protection for authenticated pages
(function () {
    const user = JSON.parse(localStorage.getItem('user'));
    const currentPage = window.location.pathname;

    // Pages that require authentication
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

    // Check if current page is protected
    const isProtected = protectedPages.some(page => currentPage.includes(page));

    if (isProtected && !user) {
        window.location.href = '../index.html';
    }
})();
