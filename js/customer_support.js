/* js/customer_support.js - Enhanced Help System */
document.addEventListener('DOMContentLoaded', () => {
    loadTickets();
    setupAccordion();
    setupModal();
    setupTutorialButton();
});

function loadTickets() {
    const list = document.getElementById('tickets-list');
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    const user = JSON.parse(localStorage.getItem('user'));

    const userTickets = user ? tickets.filter(t => t.user === user.email) : [];

    if (userTickets.length === 0) {
        list.innerHTML = '<p class="text-muted">No tienes tickets abiertos.</p>';
        return;
    }

    list.innerHTML = userTickets.map(t => `
        <div class="ticket-item" onclick="showTicketDetail(${t.id})" style="cursor: pointer;">
            <div class="ticket-header">
                <span class="ticket-subject">#${t.id} - ${t.subject}</span>
                <span class="ticket-status status-${t.status}">${getStatusLabel(t.status)}</span>
            </div>
            <div class="ticket-meta">
                <span>Fecha: ${new Date(t.created).toLocaleDateString()}</span>
                <span>Prioridad: ${getPriorityLabel(t.priority)}</span>
            </div>
        </div>
    `).join('');
}

window.showTicketDetail = (ticketId) => {
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);

    if (!ticket) return;

    const modal = document.getElementById('ticket-detail-modal');
    const closeBtn = document.getElementById('detail-close');
    const content = document.getElementById('ticket-detail-content');

    // Build ticket detail HTML
    content.innerHTML = `
        <div class="ticket-detail-info">
            <div class="detail-row">
                <strong>ID:</strong> <span>#${ticket.id}</span>
            </div>
            <div class="detail-row">
                <strong>Asunto:</strong> <span>${ticket.subject}</span>
            </div>
            <div class="detail-row">
                <strong>Categoría:</strong> <span>${getCategoryLabel(ticket.category)}</span>
            </div>
            <div class="detail-row">
                <strong>Prioridad:</strong> <span class="priority-${ticket.priority}">${getPriorityLabel(ticket.priority)}</span>
            </div>
            <div class="detail-row">
                <strong>Estado:</strong> <span class="ticket-status status-${ticket.status}">${getStatusLabel(ticket.status)}</span>
            </div>
            <div class="detail-row">
                <strong>Fecha:</strong> <span>${new Date(ticket.created).toLocaleString()}</span>
            </div>
            <div class="detail-section">
                <strong>Descripción:</strong>
                <p style="margin-top: 0.5rem; white-space: pre-wrap;">${ticket.description}</p>
            </div>
            ${ticket.response ? `
                <div class="detail-section admin-response">
                    <strong>Respuesta del Administrador:</strong>
                    <p style="margin-top: 0.5rem; white-space: pre-wrap; padding: 1rem; background: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 4px;">${ticket.response}</p>
                    ${ticket.respondedAt ? `<small style="color: #666;">Respondido el: ${new Date(ticket.respondedAt).toLocaleString()}</small>` : ''}
                </div>
            ` : '<p style="color: #999; margin-top: 1rem;">Aún no hay respuesta del equipo de soporte.</p>'}
        </div>
    `;

    // Show modal
    modal.classList.add('show');

    // Close handlers
    const closeModal = () => modal.classList.remove('show');
    closeBtn.onclick = closeModal;
    window.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
};

function getCategoryLabel(category) {
    const labels = {
        technical: 'Problema Técnico',
        account: 'Cuenta y Acceso',
        billing: 'Facturación',
        feature_request: 'Sugerencia',
        other: 'Otro'
    };
    return labels[category] || category;
}

function getStatusLabel(status) {
    const labels = {
        open: 'Abierto',
        in_progress: 'En Progreso',
        resolved: 'Resuelto',
        closed: 'Cerrado'
    };
    return labels[status] || status;
}

function getPriorityLabel(priority) {
    const labels = {
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
        urgent: 'Urgente'
    };
    return labels[priority] || priority;
}

function setupAccordion() {
    const items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            items.forEach(i => i.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });
}

function setupModal() {
    const modal = document.getElementById('ticket-modal');
    const btn = document.getElementById('new-ticket-btn');
    const close = document.querySelector('.close');

    btn.onclick = () => modal.classList.add('show');
    close.onclick = () => modal.classList.remove('show');
    window.onclick = (e) => {
        if (e.target == modal) modal.classList.remove('show');
    };

    document.getElementById('ticket-form').onsubmit = (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem('user'));
        const ticket = {
            id: Date.now(),
            subject: document.getElementById('ticket-subject').value,
            category: document.getElementById('ticket-category').value,
            priority: document.getElementById('ticket-priority').value,
            description: document.getElementById('ticket-desc').value,
            status: 'open',
            created: new Date().toISOString(),
            user: user ? user.email : 'anonymous',
            userName: user ? user.nombre : 'Usuario'
        };

        const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
        tickets.push(ticket);
        localStorage.setItem('support_tickets', JSON.stringify(tickets));

        modal.classList.remove('show');
        showToast('Ticket enviado correctamente. Te contactaremos pronto.', 'success');

        loadTickets();
        e.target.reset();
    };
}

function setupTutorialButton() {
    const tutorialBtn = document.getElementById('show-tutorial-btn');
    if (tutorialBtn) {
        tutorialBtn.addEventListener('click', () => {
            localStorage.removeItem('tutorial_completed');
            showToast('Redirigiendo al tutorial...', 'info');
            setTimeout(() => {
                window.location.href = 'dashboard.html?start_tutorial=true';
            }, 1000);
        });
    }
}

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
