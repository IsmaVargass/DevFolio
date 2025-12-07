/* js/admin_panel.js - Admin Panel Logic */
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || (user.role !== 'admin' && user.role !== 'tecnico')) {
        window.location.href = 'dashboard.html';
        return;
    }

    document.getElementById('user-greeting').textContent = user.nombre;
    document.getElementById('role-badge').textContent = user.role === 'admin' ? 'Admin' : 'Técnico';

    loadStatistics();
    loadTickets();
    loadUsers();
    loadReports();
    setupTabs();
    setupFilters();
    setupModal();
    setupUserSearch();

    // Check for URL params
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
        switchTab(tab);
    }
});

function loadStatistics() {
    const users = JSON.parse(localStorage.getItem('all_users') || '[]');
    const portfolios = JSON.parse(localStorage.getItem('published_portfolios') || '[]');
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');

    const now = new Date();
    const activeUsers = users.filter(u => {
        if (u.lastActive) {
            const lastActive = new Date(u.lastActive);
            const diffDays = (now - lastActive) / (1000 * 60 * 60 * 24);
            return diffDays <= 7;
        }
        return false;
    }).length;

    document.getElementById('total-users').textContent = users.length || 1;
    document.getElementById('total-portfolios').textContent = portfolios.length;
    document.getElementById('open-tickets').textContent = tickets.filter(t => t.status !== 'closed').length;
    document.getElementById('active-users').textContent = activeUsers || 1;
}

function loadTickets() {
    renderTickets();
}

function renderTickets(filter = 'all') {
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    const list = document.getElementById('tickets-list');

    let filtered = tickets;
    if (filter !== 'all') {
        filtered = tickets.filter(t => t.status === filter);
    }

    if (filtered.length === 0) {
        list.innerHTML = '<p class="text-muted">No hay tickets en esta categoría.</p>';
        return;
    }

    filtered.sort((a, b) => new Date(b.created || b.createdAt) - new Date(a.created || a.createdAt));

    list.innerHTML = filtered.map(ticket => `
        <div class="ticket-item" onclick="viewTicket(${ticket.id})">
            <div class="ticket-header">
                <span class="ticket-id">Ticket #${ticket.id}</span>
                <span class="ticket-status status-${ticket.status}">${getStatusLabel(ticket.status)}</span>
            </div>
            <div class="ticket-title">${ticket.subject || ticket.title}</div>
            <div class="ticket-description">${ticket.description}</div>
            <div class="ticket-meta">
                <span>Usuario: <strong>${ticket.userName}</strong></span>
                <span class="ticket-priority priority-${ticket.priority}">Prioridad: ${getPriorityLabel(ticket.priority)}</span>
                <span>${formatDate(ticket.created || ticket.createdAt)}</span>
            </div>
        </div>
    `).join('');
}

function getStatusLabel(status) {
    const labels = {
        'open': 'Abierto',
        'in_progress': 'En Progreso',
        'closed': 'Cerrado',
        'resolved': 'Resuelto'
    };
    return labels[status] || status;
}

function getPriorityLabel(priority) {
    const labels = {
        'high': 'Alta',
        'medium': 'Media',
        'low': 'Baja',
        'urgent': 'Urgente'
    };
    return labels[priority] || priority;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Hace menos de 1 hora';
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString('es-ES');
}

window.viewTicket = (ticketId) => {
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);

    if (!ticket) return;

    const modal = document.getElementById('ticket-modal');
    const title = document.getElementById('ticket-modal-title');
    const content = document.getElementById('ticket-detail-content');

    title.textContent = `Ticket #${ticket.id} - ${ticket.subject || ticket.title}`;

    content.innerHTML = `
        <div class="ticket-detail-section">
            <h3>Información del Ticket</h3>
            <p><strong>Usuario:</strong> ${ticket.userName}</p>
            <p><strong>Email:</strong> ${ticket.userEmail || 'No disponible'}</p>
            <p><strong>Estado:</strong> <span class="ticket-status status-${ticket.status}">${getStatusLabel(ticket.status)}</span></p>
            <p><strong>Prioridad:</strong> <span class="priority-${ticket.priority}">${getPriorityLabel(ticket.priority)}</span></p>
            <p><strong>Categoría:</strong> ${ticket.category}</p>
            <p><strong>Creado:</strong> ${new Date(ticket.created || ticket.createdAt).toLocaleString('es-ES')}</p>
        </div>

        <div class="ticket-detail-section">
            <h3>Descripción</h3>
            <p>${ticket.description}</p>
        </div>

        <div class="ticket-detail-section">
            <h3>Respuestas (${(ticket.responses || []).length})</h3>
            <div class="ticket-responses">
                ${(ticket.responses || []).map(r => `
                    <div class="response-item">
                        <div class="response-header">
                            <span class="response-author">${r.author}</span>
                            <span class="response-date">${formatDate(r.date)}</span>
                        </div>
                        <div class="response-text">${r.text}</div>
                    </div>
                `).join('') || '<p class="text-muted">No hay respuestas aún.</p>'}
            </div>
        </div>

        <div class="ticket-response-form">
            <h3>Responder</h3>
            <form onsubmit="respondTicket(event, ${ticket.id})">
                <div class="form-group">
                    <textarea id="response-text" rows="4" placeholder="Escribe tu respuesta..." required></textarea>
                </div>
                <div class="form-group">
                    <label>Cambiar estado:</label>
                    <select id="ticket-status-update">
                        <option value="open" ${ticket.status === 'open' ? 'selected' : ''}>Abierto</option>
                        <option value="in_progress" ${ticket.status === 'in_progress' ? 'selected' : ''}>En Progreso</option>
                        <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>Cerrado</option>
                        <option value="resolved" ${ticket.status === 'resolved' ? 'selected' : ''}>Resuelto</option>
                    </select>
                </div>
                <button type="submit" class="btn btn-primary">Enviar Respuesta</button>
            </form>
        </div>
    `;

    modal.classList.add('show');
};

window.respondTicket = (e, ticketId) => {
    e.preventDefault();

    const responseText = document.getElementById('response-text').value;
    const newStatus = document.getElementById('ticket-status-update').value;
    const user = JSON.parse(localStorage.getItem('user'));

    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);

    if (ticket) {
        if (!ticket.responses) ticket.responses = [];

        ticket.responses.push({
            author: user.nombre,
            text: responseText,
            date: new Date().toISOString()
        });
        ticket.status = newStatus;
        ticket.hasNewResponse = true;

        localStorage.setItem('support_tickets', JSON.stringify(tickets));

        document.getElementById('ticket-modal').classList.remove('show');
        loadTickets();
        loadStatistics();
        loadReports();

        showToast('Respuesta enviada correctamente', 'success');
    }
};

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('all_users') || '[]');
    const table = document.getElementById('users-table');
    const currentUser = JSON.parse(localStorage.getItem('user'));

    let allUsers = users;
    if (allUsers.length === 0 && currentUser) {
        allUsers = [currentUser];
    }

    table.innerHTML = `
        <div class="user-row header">
            <div>Nombre</div>
            <div>Email</div>
            <div>Rol</div>
            <div>Registrado</div>
            <div>Acciones</div>
        </div>
        ${allUsers.map(u => `
            <div class="user-row">
                <div>${u.nombre || 'Usuario'}</div>
                <div>${u.email}</div>
                <div>
                    <select class="role-select" onchange="changeUserRole('${u.email}', this.value)" ${u.email === currentUser.email ? 'disabled' : ''}>
                        <option value="user" ${(u.role || 'user') === 'user' ? 'selected' : ''}>User</option>
                        <option value="tecnico" ${u.role === 'tecnico' ? 'selected' : ''}>Técnico</option>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <div>${u.registeredDate ? formatDate(u.registeredDate) : 'N/A'}</div>
                <div>
                    <button class="btn btn-outline btn-sm" onclick="openPasswordResetModal('${u.email}', '${(u.nombre || 'Usuario').replace(/'/g, "\\'")}')">
                        Restablecer Contraseña
                    </button>
                </div>
            </div>
        `).join('')}
    `;
}

let resetUserData = { email: '', nombre: '' };

window.openPasswordResetModal = (email, nombre) => {
    resetUserData = { email, nombre };
    const modal = document.getElementById('password-reset-modal');
    document.getElementById('reset-user-email').textContent = email;
    document.getElementById('reset-custom-message').value = '';
    modal.classList.add('show');

    const closeBtn = document.getElementById('reset-modal-close');
    closeBtn.onclick = closePasswordResetModal;
};

window.closePasswordResetModal = () => {
    const modal = document.getElementById('password-reset-modal');
    modal.classList.remove('show');
    resetUserData = { email: '', nombre: '' };
};

window.confirmPasswordReset = () => {
    const customMessage = document.getElementById('reset-custom-message').value;
    const currentUser = JSON.parse(localStorage.getItem('user'));

    showToast(`Correo de restablecimiento enviado a ${resetUserData.email}`, 'success');

    const adminLogs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
    adminLogs.push({
        action: 'password_reset_email',
        targetUser: resetUserData.email,
        adminUser: currentUser.email,
        customMessage: customMessage || '',
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('admin_logs', JSON.stringify(adminLogs));

    closePasswordResetModal();
};

window.changeUserRole = (email, newRole) => {
    const users = JSON.parse(localStorage.getItem('all_users') || '[]');
    const user = users.find(u => u.email === email);
    const currentUser = JSON.parse(localStorage.getItem('user'));

    if (user) {
        const oldRole = user.role || 'user';
        user.role = newRole;
        localStorage.setItem('all_users', JSON.stringify(users));

        if (currentUser.email === email) {
            currentUser.role = newRole;
            localStorage.setItem('user', JSON.stringify(currentUser));
        }

        const adminLogs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
        adminLogs.push({
            action: 'role_change',
            targetUser: email,
            oldRole: oldRole,
            newRole: newRole,
            adminUser: currentUser.email,
            timestamp: new Date().toISOString()
        });
        localStorage.setItem('admin_logs', JSON.stringify(adminLogs));

        showToast(`Rol de ${email} actualizado a ${newRole}`, 'success');
        loadUsers();
    }
};

function setupUserSearch() {
    const searchInput = document.getElementById('user-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const users = JSON.parse(localStorage.getItem('all_users') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('user'));

            let allUsers = users.length > 0 ? users : [currentUser];

            const filtered = allUsers.filter(u =>
                (u.nombre && u.nombre.toLowerCase().includes(query)) ||
                (u.email && u.email.toLowerCase().includes(query))
            );

            renderFilteredUsers(filtered);
        });
    }
}

function renderFilteredUsers(users) {
    const table = document.getElementById('users-table');
    const currentUser = JSON.parse(localStorage.getItem('user'));

    table.innerHTML = `
        <div class="user-row header">
            <div>Nombre</div>
            <div>Email</div>
            <div>Rol</div>
            <div>Registrado</div>
            <div>Acciones</div>
        </div>
        ${users.map(u => `
            <div class="user-row">
                <div>${u.nombre || 'Usuario'}</div>
                <div>${u.email}</div>
                <div>
                    <select class="role-select" onchange="changeUserRole('${u.email}', this.value)" ${u.email === currentUser.email ? 'disabled' : ''}>
                        <option value="user" ${(u.role || 'user') === 'user' ? 'selected' : ''}>User</option>
                        <option value="tecnico" ${u.role === 'tecnico' ? 'selected' : ''}>Técnico</option>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                </div>
                <div>${u.registeredDate ? formatDate(u.registeredDate) : 'N/A'}</div>
                <div>
                    <button class="btn btn-outline btn-sm" onclick="openPasswordResetModal('${u.email}', '${(u.nombre || 'Usuario').replace(/'/g, "\\'")}')">
                        Restablecer Contraseña
                    </button>
                </div>
            </div>
        `).join('')}
    `;
}

function loadReports() {
    const users = JSON.parse(localStorage.getItem('all_users') || '[]');
    const portfolios = JSON.parse(localStorage.getItem('published_portfolios') || '[]');
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    const customGroups = JSON.parse(localStorage.getItem('custom_groups') || '[]');
    const joinedGroups = JSON.parse(localStorage.getItem('joined_groups') || '[]');

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    document.getElementById('report-total-users').textContent = users.length || 1;
    const activeToday = users.filter(u => {
        if (u.lastActive) {
            const lastActive = new Date(u.lastActive);
            return lastActive >= today;
        }
        return false;
    }).length;
    document.getElementById('active-today').textContent = activeToday || Math.floor(users.length * 0.3) || 1;

    const newUsersWeek = users.filter(u => {
        if (u.registeredDate) {
            const registered = new Date(u.registeredDate);
            return registered >= weekAgo;
        }
        return false;
    }).length;
    document.getElementById('new-users-week').textContent = newUsersWeek;

    const lastActivity = users.reduce((latest, u) => {
        if (u.lastActive) {
            const lastActive = new Date(u.lastActive);
            return !latest || lastActive > latest ? lastActive : latest;
        }
        return latest;
    }, null);
    document.getElementById('last-activity').textContent = lastActivity ? formatDate(lastActivity.toISOString()) : 'N/A';

    document.getElementById('report-total-portfolios').textContent = portfolios.length;
    const portfoliosToday = portfolios.filter(p => {
        const published = new Date(p.publishedDate);
        return published >= today;
    }).length;
    document.getElementById('portfolios-today').textContent = portfoliosToday;

    const portfoliosWeek = portfolios.filter(p => {
        const published = new Date(p.publishedDate);
        return published >= weekAgo;
    }).length;
    document.getElementById('portfolios-week').textContent = portfoliosWeek;

    const totalViews = portfolios.reduce((sum, p) => sum + (p.views || 0), 0);
    document.getElementById('total-views').textContent = totalViews;

    const topPortfolio = portfolios.reduce((top, p) => {
        return (!top || (p.views || 0) > (top.views || 0)) ? p : top;
    }, null);
    document.getElementById('top-portfolio').textContent = topPortfolio ? `${topPortfolio.title} (${topPortfolio.views} vistas)` : 'N/A';

    document.getElementById('report-total-tickets').textContent = tickets.length;
    document.getElementById('report-open-tickets').textContent = tickets.filter(t => t.status === 'open').length;
    document.getElementById('report-progress-tickets').textContent = tickets.filter(t => t.status === 'in_progress').length;
    document.getElementById('report-closed-tickets').textContent = tickets.filter(t => t.status === 'closed' || t.status === 'resolved').length;

    const resolutionRate = tickets.length > 0
        ? Math.round((tickets.filter(t => t.status === 'closed' || t.status === 'resolved').length / tickets.length) * 100)
        : 0;
    document.getElementById('ticket-resolution-rate').textContent = `${resolutionRate}%`;

    const totalGroups = customGroups.length + 3;
    document.getElementById('report-total-groups').textContent = totalGroups;

    const groupsToday = customGroups.filter(g => {
        const created = new Date(g.created);
        return created >= today;
    }).length;
    document.getElementById('groups-today').textContent = groupsToday;

    document.getElementById('total-group-members').textContent = joinedGroups.length;

    const topGroup = customGroups.reduce((top, g) => {
        return (!top || (g.members || 0) > (top.members || 0)) ? g : top;
    }, null);
    document.getElementById('top-group').textContent = topGroup ? `${topGroup.name} (${topGroup.members} miembros)` : 'React Developers (120 miembros)';
}

function setupTabs() {
    const tabs = document.querySelectorAll('.admin-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab.dataset.tab);
        });
    });
}

function switchTab(tabName) {
    document.querySelectorAll('.admin-tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));

    const btn = document.querySelector(`[data-tab="${tabName}"]`);
    const content = document.getElementById(`${tabName}-tab`);

    if (btn && content) {
        btn.classList.add('active');
        content.classList.add('active');
    }
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderTickets(btn.dataset.status);
        });
    });
}

function setupModal() {
    const modal = document.getElementById('ticket-modal');
    const close = modal.querySelector('.close');

    close.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    toast.offsetHeight;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
