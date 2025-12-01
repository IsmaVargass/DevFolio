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
    loadApplications();
    loadUsers();
    setupTabs();
    setupFilters();
    setupModal();

    // Check for URL params (e.g., ?tab=tickets)
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
        switchTab(tab);
    }
});

function loadStatistics() {
    // Load from localStorage
    const users = JSON.parse(localStorage.getItem('all_users') || '[]');
    const portfolios = JSON.parse(localStorage.getItem('published_portfolios') || '[]');
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');

    document.getElementById('total-users').textContent = users.length || 1; // At least current user
    document.getElementById('total-portfolios').textContent = portfolios.length;
    document.getElementById('open-tickets').textContent = tickets.filter(t => t.status !== 'closed').length;
    document.getElementById('total-jobs').textContent = jobs.length || 2; // Mock data

    // Reports
    document.getElementById('active-today').textContent = Math.floor(users.length * 0.3) || 1;
    document.getElementById('new-users-week').textContent = Math.floor(users.length * 0.1) || 0;
    document.getElementById('portfolios-today').textContent = Math.floor(portfolios.length * 0.2) || 0;

    const totalViews = portfolios.reduce((sum, p) => sum + (p.views || 0), 0);
    document.getElementById('total-views').textContent = totalViews;
}

function loadTickets() {
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');

    // Add some mock tickets if none exist
    if (tickets.length === 0) {
        // No mock tickets for now, let's rely on real data or empty state
    }

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

    // Sort by date, most recent first
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
    return date.toLocaleDateString();
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
            <p><strong>Estado:</strong> <span class="ticket-status status-${ticket.status}">${getStatusLabel(ticket.status)}</span></p>
            <p><strong>Prioridad:</strong> <span class="priority-${ticket.priority}">${getPriorityLabel(ticket.priority)}</span></p>
            <p><strong>Categoría:</strong> ${ticket.category}</p>
            <p><strong>Creado:</strong> ${new Date(ticket.created || ticket.createdAt).toLocaleString()}</p>
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

        localStorage.setItem('support_tickets', JSON.stringify(tickets));

        document.getElementById('ticket-modal').classList.remove('show');
        loadTickets();
        loadStatistics();

        showToast('Respuesta enviada correctamente', 'success');
    }
};

function loadApplications() {
    const applications = JSON.parse(localStorage.getItem('job_applications') || '[]');
    const list = document.getElementById('applications-list');

    if (applications.length === 0) {
        list.innerHTML = '<p class="text-muted">No hay aplicaciones pendientes.</p>';
        return;
    }

    list.innerHTML = applications.map(app => `
        <div class="application-item">
            <img src="${app.userAvatar || '../assets/default-avatar.png'}" alt="${app.userName}" class="application-avatar">
            <div class="application-info">
                <div class="application-name">${app.userName}</div>
                <div class="application-job">Aplicó a: ${app.jobTitle}</div>
                <div class="application-date">${formatDate(app.appliedDate)}</div>
            </div>
            <div class="application-actions">
                <button class="btn btn-outline btn-sm" onclick="viewProfile('${app.userId}')">Ver Perfil</button>
                <button class="btn btn-primary btn-sm" onclick="contactApplicant('${app.userId}')">Contactar</button>
            </div>
        </div>
    `).join('');
}

window.viewProfile = (userId) => {
    window.location.href = `profile.html?user=${userId}`;
};

window.contactApplicant = (userId) => {
    window.location.href = `messages.html?user=${userId}`;
};

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('all_users') || '[]');
    const table = document.getElementById('users-table');

    const currentUser = JSON.parse(localStorage.getItem('user'));
    // If no users in all_users, at least show current user
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
                <div>${u.role || 'user'}</div>
                <div>${u.registeredDate ? formatDate(u.registeredDate) : 'N/A'}</div>
                <div>
                    <button class="btn btn-outline btn-sm" onclick="editUser('${u.email}')">Editar</button>
                </div>
            </div>
        `).join('')}
    `;
}

window.editUser = (email) => {
    showToast(`Editar usuario: ${email} (funcionalidad en desarrollo)`, 'info');
};

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

    // Trigger reflow
    toast.offsetHeight;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
