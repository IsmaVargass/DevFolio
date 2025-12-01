/* js/experience.js */
document.addEventListener('DOMContentLoaded', () => {
    loadExperience();
    loadEducation();
    setupModal();
});

function loadExperience() {
    const timeline = document.getElementById('work-timeline');
    // Mock data
    const work = [
        {
            id: 1,
            company: 'Tech Solutions Inc.',
            role: 'Senior Developer',
            start: '2022-01',
            end: null, // Current
            description: 'Liderando el equipo de desarrollo frontend y arquitecturando soluciones escalables.'
        },
        {
            id: 2,
            company: 'WebAgency',
            role: 'Junior Developer',
            start: '2020-03',
            end: '2021-12',
            description: 'Desarrollo de sitios web corporativos y e-commerce.'
        }
    ];

    timeline.innerHTML = work.map(item => createTimelineItem(item, 'work')).join('');
}

function loadEducation() {
    const timeline = document.getElementById('education-timeline');
    // Mock data
    const edu = [
        {
            id: 1,
            institution: 'Universidad Tecnológica',
            degree: 'Ingeniería de Software',
            start: '2016',
            end: '2020',
            description: 'Graduado con honores. Especialización en desarrollo web.'
        }
    ];

    timeline.innerHTML = edu.map(item => createTimelineItem(item, 'education')).join('');
}

function createTimelineItem(item, type) {
    const title = type === 'work' ? item.role : item.degree;
    const subtitle = type === 'work' ? item.company : item.institution;
    const date = `${formatDate(item.start)} - ${item.end ? formatDate(item.end) : 'Actualidad'}`;

    return `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <div class="timeline-title">
                        <h3>${title}</h3>
                        <div class="timeline-subtitle">${subtitle}</div>
                    </div>
                    <div class="timeline-date">${date}</div>
                </div>
                <p class="timeline-desc">${item.description}</p>
                <div class="timeline-actions">
                    <button onclick="editEntry(${item.id}, '${type}')">✏️</button>
                    <button class="delete-btn" onclick="deleteEntry(${item.id}, '${type}')">🗑️</button>
                </div>
            </div>
        </div>
    `;
}

function formatDate(dateStr) {
    // Simple formatter, can be improved
    return dateStr;
}

function setupModal() {
    const modal = document.getElementById('experience-modal');
    const close = document.querySelector('.close');

    document.getElementById('add-experience-btn').onclick = () => openModal('work');
    document.getElementById('add-education-btn').onclick = () => openModal('education');

    close.onclick = () => modal.classList.remove('show');
    window.onclick = (e) => {
        if (e.target == modal) modal.classList.remove('show');
    };

    document.getElementById('experience-form').onsubmit = (e) => {
        e.preventDefault();
        modal.classList.remove('show');
        alert('Guardado (simulación)');
    };
}

function openModal(type) {
    const modal = document.getElementById('experience-modal');
    const title = document.getElementById('exp-modal-title');
    const orgLabel = document.getElementById('org-label');
    const roleLabel = document.getElementById('role-label');
    const typeInput = document.getElementById('exp-type');

    typeInput.value = type;
    if (type === 'work') {
        title.textContent = 'Añadir Experiencia Laboral';
        orgLabel.textContent = 'Empresa';
        roleLabel.textContent = 'Cargo';
    } else {
        title.textContent = 'Añadir Educación';
        orgLabel.textContent = 'Institución';
        roleLabel.textContent = 'Título/Grado';
    }

    modal.classList.add('show');
}

window.editEntry = (id, type) => {
    console.log('Edit', id, type);
    openModal(type);
};

window.deleteEntry = (id, type) => {
    if (confirm('¿Eliminar esta entrada?')) {
        console.log('Delete', id, type);
    }
};
