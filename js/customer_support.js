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

    list.innerHTML = userTickets.map(t => {
        const hasResponses = t.responses && t.responses.length > 0;
        const hasNewResponse = t.hasNewResponse === true;

        return `
        <div class="ticket-item ${hasNewResponse ? 'has-new-response' : ''}" onclick="showTicketDetail(${t.id})" style="cursor: pointer; position: relative;">
            ${hasNewResponse ? '<span class="new-response-badge">Nueva respuesta</span>' : ''}
            <div class="ticket-header">
                <span class="ticket-subject">#${t.id} - ${t.subject}</span>
                <span class="ticket-status status-${t.status}">${getStatusLabel(t.status)}</span>
            </div>
            <div class="ticket-meta">
                <span>Fecha: ${new Date(t.created || t.createdAt).toLocaleDateString('es-ES')}</span>
                <span>Prioridad: ${getPriorityLabel(t.priority)}</span>
                ${hasResponses ? `<span style="color: #4caf50; font-weight: 600;">✓ ${t.responses.length} respuesta(s)</span>` : ''}
            </div>
        </div>
    `}).join('');
}

window.showTicketDetail = (ticketId) => {
    const tickets = JSON.parse(localStorage.getItem('support_tickets') || '[]');
    const ticket = tickets.find(t => t.id === ticketId);

    if (!ticket) return;

    const modal = document.getElementById('ticket-detail-modal');
    const closeBtn = document.getElementById('detail-close');
    const content = document.getElementById('ticket-detail-content');

    // Mark ticket as read
    if (ticket.hasNewResponse) {
        ticket.hasNewResponse = false;
        localStorage.setItem('support_tickets', JSON.stringify(tickets));
        loadTickets(); // Refresh the list to remove badge
    }

    // Build responses HTML
    let responsesHTML = '';
    if (ticket.responses && ticket.responses.length > 0) {
        responsesHTML = `
            <div class="detail-section">
                <strong>Respuestas del Equipo:</strong>
                <div class="responses-container" style="margin-top: 1rem;">
                    ${ticket.responses.map((r, index) => `
                        <div class="response-item" style="margin-bottom: 1rem; padding: 1rem; background: ${index % 2 === 0 ? '#e8f5e9' : '#e3f2fd'}; border-left: 4px solid ${index % 2 === 0 ? '#4caf50' : '#2196f3'}; border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                <strong style="color: #333;">${r.author}</strong>
                                <small style="color: #666;">${new Date(r.date).toLocaleString('es-ES')}</small>
                            </div>
                            <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${r.text}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        responsesHTML = '<p style="color: #999; margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 4px; text-align: center;">⏳ Aún no hay respuesta del equipo de soporte. Te contactaremos pronto.</p>';
    }

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
                <strong>Fecha de creación:</strong> <span>${new Date(ticket.created || ticket.createdAt).toLocaleString('es-ES')}</span>
            </div>
            <div class="detail-section">
                <strong>Tu consulta:</strong>
                <p style="margin-top: 0.5rem; white-space: pre-wrap; padding: 1rem; background: #f9f9f9; border-radius: 4px; line-height: 1.6;">${ticket.description}</p>
            </div>
            ${responsesHTML}
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
            userName: user ? user.nombre : 'Usuario',
            userEmail: user ? user.email : '',
            responses: []
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
            localStorage.setItem('show_tutorial', 'true');
            showToast('Redirigiendo al tutorial...', 'info');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
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
