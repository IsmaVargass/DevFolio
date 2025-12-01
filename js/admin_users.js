/* js/admin_users.js */
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser || currentUser.role !== 'admin') {
        alert('Acceso denegado. Se requieren permisos de administrador.');
        window.location.href = 'dashboard.html';
        return;
    }

    loadUsers();
});

function loadUsers() {
    const tbody = document.getElementById('users-table-body');

    // Mock Users Data (since we don't have a real backend with all users yet)
    // In a real app, this would fetch from /api/users
    const mockUsers = [
        { id: 1, name: 'Admin User', email: 'admin@devfolio.com', role: 'admin', joined: '2025-01-01', photo: null },
        { id: 2, name: 'Ana García', email: 'ana@example.com', role: 'user', joined: '2025-11-15', photo: null },
        { id: 3, name: 'Carlos Ruiz', email: 'carlos@example.com', role: 'user', joined: '2025-11-20', photo: null },
        { id: 4, name: 'Elena Web', email: 'elena@example.com', role: 'user', joined: '2025-11-25', photo: null }
    ];

    // Add current user if not in mock
    const currentUser = JSON.parse(localStorage.getItem('user'));
    if (!mockUsers.find(u => u.email === currentUser.email)) {
        mockUsers.unshift({
            id: Date.now(),
            name: currentUser.nombre,
            email: currentUser.email,
            role: currentUser.role || 'user',
            joined: new Date().toISOString().split('T')[0],
            photo: null
        });
    }

    tbody.innerHTML = mockUsers.map(user => `
        <tr>
            <td>
                <img src="${getUserAvatar(user)}" class="user-avatar-small" alt="${user.name}">
                ${user.name}
            </td>
            <td>${user.email}</td>
            <td><span class="role-badge ${user.role === 'admin' ? 'role-admin' : 'role-user'}">${user.role}</span></td>
            <td>${user.joined}</td>
            <td>
                <button class="action-btn" title="Editar" onclick="alert('Editar usuario: ${user.name}')">✏️</button>
                <button class="action-btn" title="Eliminar" onclick="alert('Eliminar usuario: ${user.name}')">🗑️</button>
            </td>
        </tr>
    `).join('');
}
