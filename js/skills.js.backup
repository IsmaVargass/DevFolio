/* js/skills.js - Enhanced Dynamic Skills System */
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    setupTabs();
    setupModal();
    updateOverview();
});

// Mock data - In production, load from API/localStorage
let skillsData = {
    technical: [
        { id: 1, name: 'JavaScript', level: 90, type: 'technical' },
        { id: 2, name: 'React', level: 85, type: 'technical' },
        { id: 3, name: 'Node.js', level: 75, type: 'technical' },
        { id: 4, name: 'Python', level: 70, type: 'technical' }
    ],
    soft: [
        { id: 5, name: 'Comunicación', level: 88, type: 'soft' },
        { id: 6, name: 'Trabajo en Equipo', level: 92, type: 'soft' },
        { id: 7, name: 'Liderazgo', level: 78, type: 'soft' }
    ],
    hard: [
        { id: 8, name: 'Diseño UX/UI', level: 82, type: 'hard' },
        { id: 9, name: 'SQL', level: 76, type: 'hard' }
    ]
};

function loadSkills() {
    // Load from localStorage if exists
    const stored = localStorage.getItem('skills');
    if (stored) {
        const allSkills = JSON.parse(stored);
        skillsData = {
            technical: allSkills.filter(s => s.type === 'technical'),
            soft: allSkills.filter(s => s.type === 'soft'),
            hard: allSkills.filter(s => s.type === 'hard')
        };
    }

    renderSkills('technical');
    renderSkills('soft');
    renderSkills('hard');
    updateOverview();
}

function renderSkills(type) {
    const grid = document.getElementById(`${type}-grid`);
    const skills = skillsData[type];

    if (skills.length === 0) {
        grid.innerHTML = '<p class="text-muted">No hay skills en esta categoría. ¡Añade una!</p>';
        return;
    }

    grid.innerHTML = skills.map(skill => createSkillCard(skill)).join('');
}

function createSkillCard(skill) {
    const levelLabel = getLevelLabel(skill.level);
    const levelClass = getLevelClass(skill.level);
    const circumference = 2 * Math.PI * 54; // radius = 54
    const offset = circumference - (skill.level / 100) * circumference;

    return `
        <div class="skill-card">
            <div class="skill-progress-circle">
                <svg width="120" height="120">
                    <circle class="progress-bg" cx="60" cy="60" r="54"
                        fill="none" stroke="#e5e7eb" stroke-width="8"></circle>
                    <circle class="progress-bar" cx="60" cy="60" r="54"
                        fill="none" stroke="#10b981" stroke-width="8"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${offset}"
                        transform="rotate(-90 60 60)"></circle>
                </svg>
                <div class="progress-text">${skill.level}%</div>
            </div>
            <div class="skill-name">${skill.name}</div>
            <span class="skill-level-badge ${levelClass}">${levelLabel}</span>
            <div class="skill-actions">
                <button onclick="editSkill(${skill.id})">Editar</button>
                <button class="delete-btn" onclick="deleteSkill(${skill.id})">Eliminar</button>
            </div>
        </div>
    `;
}

function getLevelLabel(level) {
    if (level >= 80) return 'Experto';
    if (level >= 60) return 'Avanzado';
    if (level >= 40) return 'Intermedio';
    return 'Principiante';
}

function getLevelClass(level) {
    if (level >= 80) return 'level-expert';
    if (level >= 60) return 'level-advanced';
    if (level >= 40) return 'level-intermediate';
    return 'level-beginner';
}

function updateOverview() {
    const allSkills = [...skillsData.technical, ...skillsData.soft, ...skillsData.hard];
    const totalSkills = allSkills.length;
    const avgLevel = totalSkills > 0
        ? Math.round(allSkills.reduce((sum, s) => sum + s.level, 0) / totalSkills)
        : 0;
    const expertSkills = allSkills.filter(s => s.level >= 80).length;

    document.getElementById('total-skills').textContent = totalSkills;
    document.getElementById('avg-level').textContent = avgLevel + '%';
    document.getElementById('expert-skills').textContent = expertSkills;
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active from all
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.skills-view').forEach(v => v.classList.remove('active'));

            // Add active to clicked
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-skills`).classList.add('active');
        });
    });
}

function setupModal() {
    const modal = document.getElementById('skill-modal');
    const addBtn = document.getElementById('add-skill-btn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('skill-form');
    const levelInput = document.getElementById('skill-level');
    const levelVal = document.getElementById('skill-level-val');
    const levelLabel = document.getElementById('skill-level-label');

    addBtn.addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Añadir Habilidad';
        form.reset();
        document.getElementById('skill-id').value = '';
        modal.classList.add('show');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });

    levelInput.addEventListener('input', (e) => {
        const value = e.target.value;
        levelVal.textContent = value + '%';
        const label = getLevelLabel(parseInt(value));
        const className = getLevelClass(parseInt(value));
        levelLabel.textContent = label;
        levelLabel.className = 'level-badge ' + className;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        saveSkill();
    });
}

function saveSkill() {
    const id = document.getElementById('skill-id').value;
    const name = document.getElementById('skill-name').value;
    const type = document.getElementById('skill-type').value;
    const level = parseInt(document.getElementById('skill-level').value);

    if (id) {
        // Edit existing
        const allSkills = [...skillsData.technical, ...skillsData.soft, ...skillsData.hard];
        const skill = allSkills.find(s => s.id == id);
        if (skill) {
            skill.name = name;
            skill.type = type;
            skill.level = level;
        }
    } else {
        // Add new
        const newSkill = {
            id: Date.now(),
            name,
            type,
            level
        };
        skillsData[type].push(newSkill);
    }

    // Save to localStorage
    const allSkills = [...skillsData.technical, ...skillsData.soft, ...skillsData.hard];
    localStorage.setItem('skills', JSON.stringify(allSkills));

    // Reload and close
    loadSkills();
    document.getElementById('skill-modal').classList.remove('show');
    showToast('Skill guardada correctamente', 'success');
}

window.editSkill = (id) => {
    const allSkills = [...skillsData.technical, ...skillsData.soft, ...skillsData.hard];
    const skill = allSkills.find(s => s.id === id);

    if (skill) {
        document.getElementById('modal-title').textContent = 'Editar Habilidad';
        document.getElementById('skill-id').value = skill.id;
        document.getElementById('skill-name').value = skill.name;
        document.getElementById('skill-type').value = skill.type;
        document.getElementById('skill-level').value = skill.level;

        // Trigger input event to update display
        document.getElementById('skill-level').dispatchEvent(new Event('input'));

        document.getElementById('skill-modal').classList.add('show');
    }
};

window.deleteSkill = (id) => {
    if (!confirm('¿Eliminar esta habilidad?')) return;

    // Find and remove
    for (let type in skillsData) {
        skillsData[type] = skillsData[type].filter(s => s.id !== id);
    }

    // Save to localStorage
    const allSkills = [...skillsData.technical, ...skillsData.soft, ...skillsData.hard];
    localStorage.setItem('skills', JSON.stringify(allSkills));

    loadSkills();
    showToast('Skill eliminada', 'info');
};

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
