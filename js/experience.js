/* js/experience.js */
document.addEventListener('DOMContentLoaded', () => {
    loadExperience();
    loadEducation();
    setupModal();
});

// Initial Data (if localStorage is empty)
const initialWork = [
    {
        id: 1,
        company: 'Tech Solutions Inc.',
        role: 'Senior Developer',
        start: '2022-01-15',
        end: null,
        description: 'Liderando el equipo de desarrollo frontend y arquitecturando soluciones escalables.'
    },
    {
        id: 2,
        company: 'WebAgency',
        role: 'Junior Developer',
        start: '2020-03-01',
        end: '2021-12-31',
        description: 'Desarrollo de sitios web corporativos y e-commerce.'
    }
];

const initialEdu = [
    {
        id: 1,
        institution: 'Universidad Tecnológica',
        degree: 'Ingeniería de Software',
        start: '2016-09-01',
        end: '2020-06-30',
        description: 'Graduado con honores. Especialización en desarrollo web.'
    }
];

function loadExperience() {
    const timeline = document.getElementById('work-timeline');
    let work = JSON.parse(localStorage.getItem('experience'));

    if (!work) {
        work = initialWork;
        localStorage.setItem('experience', JSON.stringify(work));
    }

    if (work.length === 0) {
        timeline.innerHTML = '<p class="text-muted">No hay experiencia laboral registrada.</p>';
    } else {
        timeline.innerHTML = work.map(item => createTimelineItem(item, 'work')).join('');
    }
}

function loadEducation() {
    const timeline = document.getElementById('education-timeline');
    let edu = JSON.parse(localStorage.getItem('education'));

    if (!edu) {
        edu = initialEdu;
        localStorage.setItem('education', JSON.stringify(edu));
    }

    if (edu.length === 0) {
        timeline.innerHTML = '<p class="text-muted">No hay educación registrada.</p>';
    } else {
        timeline.innerHTML = edu.map(item => createTimelineItem(item, 'education')).join('');
    }
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
                </div>
                <div class="timeline-date">${date}</div>
                <p class="timeline-desc">${item.description}</p>
                <div class="timeline-actions">
                    <button class="btn-action btn-edit" onclick="editEntry(${item.id}, '${type}')">Editar</button>
                    <button class="btn-action btn-delete" onclick="deleteEntry(${item.id}, '${type}')">Eliminar</button>
                </div>
            </div>
        </div>
    `;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
}

function setupModal() {
    const modal = document.getElementById('experience-modal');
    const close = document.querySelector('.close');
    const form = document.getElementById('experience-form');

    document.getElementById('add-experience-btn').onclick = () => openModal('work');
    document.getElementById('add-education-btn').onclick = () => openModal('education');

    close.onclick = () => modal.classList.remove('show');
    window.onclick = (e) => {
        if (e.target == modal) modal.classList.remove('show');
    };

    // Handle "Currently working" checkbox
    const currentCheck = document.getElementById('exp-current');
    const endDateInput = document.getElementById('exp-end');

    currentCheck.addEventListener('change', (e) => {
        if (e.target.checked) {
            endDateInput.value = '';
            endDateInput.disabled = true;
        } else {
            endDateInput.disabled = false;
        }
    });

    form.onsubmit = (e) => {
        e.preventDefault();
        saveEntry();
    };
}

function openModal(type, item = null) {
    const modal = document.getElementById('experience-modal');
    const title = document.getElementById('exp-modal-title');
    const orgLabel = document.getElementById('org-label');
    const roleLabel = document.getElementById('role-label');
    const typeInput = document.getElementById('exp-type');
    const form = document.getElementById('experience-form');

    // Reset form
    form.reset();
    document.getElementById('exp-id').value = '';
    document.getElementById('exp-end').disabled = false;

    typeInput.value = type;

    if (type === 'work') {
        title.textContent = item ? 'Editar Experiencia' : 'Añadir Experiencia Laboral';
        orgLabel.textContent = 'Empresa';
        roleLabel.textContent = 'Cargo';
    } else {
        title.textContent = item ? 'Editar Educación' : 'Añadir Educación';
        orgLabel.textContent = 'Institución';
        roleLabel.textContent = 'Título/Grado';
    }

    if (item) {
        document.getElementById('exp-id').value = item.id;
        document.getElementById('exp-org').value = type === 'work' ? item.company : item.institution;
        document.getElementById('exp-role').value = type === 'work' ? item.role : item.degree;
        document.getElementById('exp-start').value = item.start;
        document.getElementById('exp-desc').value = item.description;

        if (!item.end) {
            document.getElementById('exp-current').checked = true;
            document.getElementById('exp-end').disabled = true;
        } else {
            document.getElementById('exp-end').value = item.end;
        }
    }

    modal.classList.add('show');
}

function saveEntry() {
    const type = document.getElementById('exp-type').value;
    const id = document.getElementById('exp-id').value;

    const org = document.getElementById('exp-org').value;
    const role = document.getElementById('exp-role').value;
    const start = document.getElementById('exp-start').value;
    const end = document.getElementById('exp-current').checked ? null : document.getElementById('exp-end').value;
    const desc = document.getElementById('exp-desc').value;

    const key = type === 'work' ? 'experience' : 'education';
    let items = JSON.parse(localStorage.getItem(key) || '[]');

    if (id) {
        // Edit existing
        const index = items.findIndex(i => i.id == id);
        if (index !== -1) {
            items[index] = {
                ...items[index],
                [type === 'work' ? 'company' : 'institution']: org,
                [type === 'work' ? 'role' : 'degree']: role,
                start,
                end,
                description: desc
            };
        }
    } else {
        // Add new
        const newItem = {
            id: Date.now(),
            [type === 'work' ? 'company' : 'institution']: org,
            [type === 'work' ? 'role' : 'degree']: role,
            start,
            end,
            description: desc
        };
        items.push(newItem);
    }

    // Sort by date (newest first)
    items.sort((a, b) => new Date(b.start) - new Date(a.start));

    localStorage.setItem(key, JSON.stringify(items));

    document.getElementById('experience-modal').classList.remove('show');

    if (type === 'work') loadExperience();
    else loadEducation();

    showToast('Guardado correctamente', 'success');
}

window.editEntry = (id, type) => {
    const key = type === 'work' ? 'experience' : 'education';
    const items = JSON.parse(localStorage.getItem(key) || '[]');
    const item = items.find(i => i.id == id);

    if (item) {
        openModal(type, item);
    }
};

window.deleteEntry = (id, type) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta entrada?')) return;

    const key = type === 'work' ? 'experience' : 'education';
    let items = JSON.parse(localStorage.getItem(key) || '[]');

    items = items.filter(i => i.id != id);
    localStorage.setItem(key, JSON.stringify(items));

    if (type === 'work') loadExperience();
    else loadEducation();

    showToast('Eliminado correctamente', 'success');
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
