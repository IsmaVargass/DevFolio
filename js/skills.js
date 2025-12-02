/* js/skills.js - Enhanced Dynamic Skills System with Green Circles */

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Skills page loaded, initializing...');
    initializeSkills();
});

// Default skills data
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

/* ============================================
   INITIALIZATION
   ============================================ */
function initializeSkills() {
    loadSkills();
    setupTabs();
    setupModal();
    updateOverview();
}

function loadSkills() {
    console.log('Loading skills from localStorage...');
    const stored = localStorage.getItem('skills');

    if (stored) {
        try {
            const allSkills = JSON.parse(stored);
            skillsData = {
                technical: allSkills.filter(s => s.type === 'technical'),
                soft: allSkills.filter(s => s.type === 'soft'),
                hard: allSkills.filter(s => s.type === 'hard')
            };
            console.log('Skills loaded from localStorage');
        } catch (e) {
            console.error('Error parsing skills from localStorage:', e);
            saveDefaultSkills();
        }
    } else {
        console.log('No skills in localStorage, using defaults');
        saveDefaultSkills();
    }

    renderSkills('technical');
    renderSkills('soft');
    renderSkills('hard');
    updateOverview();
}

function saveDefaultSkills() {
    const allSkills = [...skillsData.technical, ...skillsData.soft, ...skillsData.hard];
    localStorage.setItem('skills', JSON.stringify(allSkills));
    console.log('Default skills saved to localStorage');
}

/* ============================================
   RENDERING
   ============================================ */
function renderSkills(type) {
    const grid = document.getElementById(`${type}-grid`);
    if (!grid) {
        console.error(`Grid not found for type: ${type}`);
        return;
    }

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
    const strokeColor = getLevelColor(skill.level);

    const circumference = 2 * Math.PI * 54;
    const offset = circumference - (skill.level / 100) * circumference;

    return `
        <div class="skill-card" id="skill-card-${skill.id}" data-skill-id="${skill.id}">
            <div class="skill-progress-circle">
                <svg width="120" height="120">
                    <circle class="progress-bg" cx="60" cy="60" r="54"
                        fill="none" stroke="#e5e7eb" stroke-width="8"></circle>
                    <circle class="progress-bar" cx="60" cy="60" r="54"
                        fill="none" stroke="${strokeColor}" stroke-width="8"
                        stroke-dasharray="${circumference}"
                        stroke-dashoffset="${offset}"
                        transform="rotate(-90 60 60)"></circle>
                </svg>
                <div class="progress-text" style="color: ${strokeColor}">${skill.level}%</div>
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

/* ============================================
   HELPER FUNCTIONS
   ============================================ */
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

function getLevelColor(level) {
    if (level >= 80) return '#22c55e'; // Green
    if (level >= 60) return '#3b82f6'; // Blue
    if (level >= 40) return '#eab308'; // Yellow
    return '#9ca3af'; // Gray
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

/* ============================================
   TABS
   ============================================ */
function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.skills-view').forEach(v => v.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-skills`).classList.add('active');
        });
    });
}

/* ============================================
   MODAL
   ============================================ */
function setupModal() {
    const modal = document.getElementById('skill-modal');
    const addBtn = document.getElementById('add-skill-btn');
    const closeBtn = document.querySelector('.close');
    const form = document.getElementById('skill-form');
    const levelInput = document.getElementById('skill-level');
    const levelVal = document.getElementById('skill-level-val');
    const levelLabel = document.getElementById('skill-level-label');

    if (!modal || !addBtn || !closeBtn || !form) {
        console.error('Modal elements not found');
        return;
    }

    addBtn.addEventListener('click', () => {
        document.getElementById('modal-title').textContent = 'Añadir Habilidad';
        form.reset();
        document.getElementById('skill-id').value = '';
        modal.classList.add('show');
        // Reset range input visual
        levelInput.value = 50;
        levelInput.dispatchEvent(new Event('input'));
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
        // Edit existing skill
        const allSkills = [...skillsData.technical, ...skillsData.soft, ...skillsData.hard];
        const skill = allSkills.find(s => s.id == id);
        if (skill) {
            // Remove from old category
            for (let t in skillsData) {
                skillsData[t] = skillsData[t].filter(s => s.id != id);
            }
            // Update and add to new category
            skill.name = name;
            skill.type = type;
            skill.level = level;
            skillsData[type].push(skill);
        }
    } else {
        // Add new skill
        const newSkill = {
            id: Date.now(),
            name,
            type,
            level
        };
        skillsData[type].push(newSkill);
    }

    const allSkills = [...skillsData.technical, ...skillsData.soft, ...skillsData.hard];
    localStorage.setItem('skills', JSON.stringify(allSkills));

    loadSkills();
    document.getElementById('skill-modal').classList.remove('show');
    showToast('Skill guardada correctamente', 'success');
}

/* ============================================
   EDIT SKILL - GLOBAL FUNCTION
   ============================================ */
window.editSkill = function (id) {
    console.log('editSkill called for id:', id);
    const allSkills = [...skillsData.technical, ...skillsData.soft, ...skillsData.hard];
    const skill = allSkills.find(s => s.id === id);

    if (skill) {
        document.getElementById('modal-title').textContent = 'Editar Habilidad';
        document.getElementById('skill-id').value = skill.id;
        document.getElementById('skill-name').value = skill.name;
        document.getElementById('skill-type').value = skill.type;
        document.getElementById('skill-level').value = skill.level;

        document.getElementById('skill-level').dispatchEvent(new Event('input'));

        document.getElementById('skill-modal').classList.add('show');
    } else {
        console.error('Skill not found:', id);
    }
};

/* ============================================
   DELETE SKILL - GLOBAL FUNCTION WITH ANIMATION
   ============================================ */
window.deleteSkill = function (id) {
    console.log('deleteSkill called for id:', id);

    // Find the skill card element
    const skillCard = document.getElementById(`skill-card-${id}`);

    if (!skillCard) {
        console.error('Skill card not found for id:', id);
        return;
    }

    console.log('Hiding skill card with animation...');

    // Add fade-out and scale-down animation
    skillCard.style.transition = 'all 0.3s ease-out';
    skillCard.style.opacity = '0';
    skillCard.style.transform = 'scale(0.8)';
    skillCard.style.pointerEvents = 'none';

    // After animation completes, remove from data and DOM
    setTimeout(() => {
        console.log('Removing skill from data...');

        // Remove skill from all categories
        for (let type in skillsData) {
            const beforeLength = skillsData[type].length;
            skillsData[type] = skillsData[type].filter(s => s.id !== id);
            if (skillsData[type].length < beforeLength) {
                console.log(`Removed skill from ${type} category`);
            }
        }

        // Save to localStorage
        const allSkills = [...skillsData.technical, ...skillsData.soft, ...skillsData.hard];
        localStorage.setItem('skills', JSON.stringify(allSkills));

        console.log('Skill deleted successfully, reloading...');

        // Reload and update
        loadSkills();
        showToast('Skill eliminada correctamente', 'success');
    }, 300);
};

/* ============================================
   TOAST NOTIFICATIONS
   ============================================ */
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
