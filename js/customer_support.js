/* js/customer_support.js */
document.addEventListener('DOMContentLoaded', () => {
    loadTickets();
    setupAccordion();
    setupModal();
});

function loadTickets() {
    const list = document.getElementById('tickets-list');
    // Mock data
    const tickets = [
        { id: 101, subject: 'Problema con exportación PDF', status: 'open', date: '2025-12-01', priority: 'high' },
        { id: 98, subject: 'Cambio de correo electrónico', status: 'resolved', date: '2025-11-28', priority: 'medium' }
    ];

    if (tickets.length === 0) {
        list.innerHTML = '<p class="text-muted">No tienes tickets abiertos.</p>';
        return;
    }

    list.innerHTML = tickets.map(t => `
        <div class="ticket-item">
            <div class="ticket-header">
                <span class="ticket-subject">#${t.id} - ${t.subject}</span>
                <span class="ticket-status status-${t.status}">${getStatusLabel(t.status)}</span>
            </div>
            <div class="ticket-meta">
                <span>Fecha: ${t.date}</span>
                <span>Prioridad: ${getPriorityLabel(t.priority)}</span>
            </div>
        </div>
    `).join('');
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
            // Close all
            items.forEach(i => i.classList.remove('active'));
            // Toggle clicked
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
        modal.classList.remove('show');
        alert('Ticket enviado correctamente. Te contactaremos pronto.');
        // Reload tickets (mock)
        const list = document.getElementById('tickets-list');
        const newTicket = `
            <div class="ticket-item">
                <div class="ticket-header">
                    <span class="ticket-subject">#102 - ${document.getElementById('ticket-subject').value}</span>
                    <span class="ticket-status status-open">Abierto</span>
                </div>
                <div class="ticket-meta">
                    <span>Fecha: Hoy</span>
                    <span>Prioridad: ${getPriorityLabel(document.getElementById('ticket-priority').value)}</span>
                </div>
            </div>
        `;
        list.insertAdjacentHTML('afterbegin', newTicket);
    };
}
