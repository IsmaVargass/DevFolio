/* js/resources.js - Resources Page */

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
});

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            window.switchTab(tabName);
        });
    });
}

window.switchTab = (tabName) => {
    // Remove active class from all tabs and views
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content-view').forEach(v => v.classList.remove('active'));

    // Add active class to selected tab and view
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (tabBtn) tabBtn.classList.add('active');

    const view = document.getElementById(`${tabName}-view`);
    if (view) view.classList.add('active');
};

window.showComingSoon = () => {
    showToast('Contenido próximamente disponible', 'info');
};

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
