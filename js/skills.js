/* js/skills.js */
document.addEventListener('DOMContentLoaded', () => {
    loadSkills();
    setupTabs();
    setupModal();
});

function loadSkills() {
    // Mock data - replace with API fetch
    const skills = [
        { id: 1, name: 'HTML5', type: 'technical', level: 90 },
        { id: 2, name: 'CSS3', type: 'technical', level: 85 },
        { id: 3, name: 'JavaScript', type: 'technical', level: 80 },
        { id: 4, name: 'Comunicación', type: 'soft', level: 95 },
        { id: 5, name: 'Trabajo en equipo', type: 'soft', level: 90 },
        { id: 6, name: 'Inglés C1', type: 'hard', level: 85 }
    ];

    renderSkills(skills);
}

function renderSkills(skills) {
    const containers = {
        technical: document.getElementById('technical-skills'),
        soft: document.getElementById('soft-skills'),
        hard: document.getElementById('hard-skills')
    };

    // Clear containers
    Object.values(containers).forEach(c => c.innerHTML = '');

    skills.forEach(skill => {
        const card = createSkillCard(skill);
        if (containers[skill.type]) {
            containers[skill.type].appendChild(card);
        }
    });
}

function createSkillCard(skill) {
    const div = document.createElement('div');
    div.className = 'skill-card';
    div.innerHTML = `
        <div class="skill-header">
            <span class="skill-name">${skill.name}</span>
            <div class="skill-actions">
                <button onclick="editSkill(${skill.id})">✏️</button>
                <button class="delete-btn" onclick="deleteSkill(${skill.id})">🗑️</button>
            </div>
        </div>
        <div class="skill-level-bar">
            <div class="skill-level-fill" style="width: ${skill.level}%"></div>
        </div>
    `;
    return div;
}

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and grids
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.skills-grid').forEach(g => g.classList.remove('active'));

            // Add active class to clicked tab and corresponding grid
            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-skills`).classList.add('active');
        });
    });
}

function setupModal() {
    const modal = document.getElementById('skill-modal');
    const btn = document.getElementById('add-skill-btn');
    const close = document.querySelector('.close');
    const range = document.getElementById('skill-level');
    const rangeVal = document.getElementById('skill-level-val');

    btn.onclick = () => modal.classList.add('show');
    close.onclick = () => modal.classList.remove('show');
    window.onclick = (e) => {
        if (e.target == modal) modal.classList.remove('show');
    };

    range.oninput = () => rangeVal.textContent = `${range.value}%`;

    document.getElementById('skill-form').onsubmit = (e) => {
        e.preventDefault();
        // Handle save logic here
        modal.classList.remove('show');
        alert('Habilidad guardada (simulación)');
    };
}

// Global functions for inline onclick handlers
window.editSkill = (id) => {
    console.log('Edit skill', id);
    document.getElementById('skill-modal').classList.add('show');
};

window.deleteSkill = (id) => {
    if (confirm('¿Estás seguro de eliminar esta habilidad?')) {
        console.log('Delete skill', id);
    }
};
