// js/skills.js
import { apiFetch } from './api.js';
import { showAlert } from './utils.js';

export async function loadSkills() {
    const grid = document.getElementById('skills-grid');
    try {
        const skills = await apiFetch('/skills/list.php');
        grid.innerHTML = skills.map(skill => `
            <div class="skill-tag">
                <span>${skill.name}</span>
                <span class="skill-level">${skill.level}%</span>
                <button class="btn-delete-skill" data-id="${skill.id}">&times;</button>
            </div>
        `).join('');

        document.querySelectorAll('.btn-delete-skill').forEach(btn => {
            btn.addEventListener('click', () => deleteSkill(btn.dataset.id));
        });
    } catch (error) {
        console.error(error);
    }
}

export async function createSkill() {
    const name = prompt('Nombre de la habilidad:');
    if (!name) return;
    const level = prompt('Nivel (1-100):');
    if (!level) return;

    try {
        await apiFetch('/skills/create.php', 'POST', { name, level });
        loadSkills();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deleteSkill(id) {
    if (!confirm('¿Borrar habilidad?')) return;
    try {
        await apiFetch('/skills/delete.php', 'DELETE', { id });
        loadSkills();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}
