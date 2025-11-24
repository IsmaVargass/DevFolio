// js/cv.js
import { apiFetch } from './api.js';
import { showAlert } from './utils.js';

// --- EXPERIENCE ---
export async function loadExperience() {
    const list = document.getElementById('experience-list');
    try {
        const items = await apiFetch('/experience/list.php');
        list.innerHTML = items.map(item => `
            <div class="cv-item">
                <h3>${item.position} en ${item.company}</h3>
                <p class="cv-date">${item.start_date} - ${item.end_date || 'Presente'}</p>
                <p>${item.description}</p>
                <button class="btn btn-sm btn-danger btn-delete-exp" data-id="${item.id}">Borrar</button>
            </div>
        `).join('');

        document.querySelectorAll('.btn-delete-exp').forEach(btn => {
            btn.addEventListener('click', () => deleteExperience(btn.dataset.id));
        });
    } catch (error) {
        console.error(error);
    }
}

export async function createExperience() {
    // Simplificado con prompts por rapidez, idealmente usar modal
    const company = prompt('Empresa:');
    const position = prompt('Cargo:');
    const start_date = prompt('Fecha Inicio (YYYY-MM-DD):');
    const description = prompt('Descripción:');

    if (!company || !position || !start_date) return;

    try {
        await apiFetch('/experience/create.php', 'POST', { company, position, start_date, description });
        loadExperience();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deleteExperience(id) {
    if (!confirm('¿Borrar experiencia?')) return;
    try {
        await apiFetch('/experience/delete.php', 'DELETE', { id });
        loadExperience();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

// --- EDUCATION ---
export async function loadEducation() {
    const list = document.getElementById('education-list');
    try {
        const items = await apiFetch('/education/list.php');
        list.innerHTML = items.map(item => `
            <div class="cv-item">
                <h3>${item.degree} en ${item.institution}</h3>
                <p class="cv-date">${item.start_date} - ${item.end_date || 'Presente'}</p>
                <p>${item.description}</p>
                <button class="btn btn-sm btn-danger btn-delete-edu" data-id="${item.id}">Borrar</button>
            </div>
        `).join('');

        document.querySelectorAll('.btn-delete-edu').forEach(btn => {
            btn.addEventListener('click', () => deleteEducation(btn.dataset.id));
        });
    } catch (error) {
        console.error(error);
    }
}

export async function createEducation() {
    const institution = prompt('Institución:');
    const degree = prompt('Título:');
    const start_date = prompt('Fecha Inicio (YYYY-MM-DD):');
    const description = prompt('Descripción:');

    if (!institution || !degree || !start_date) return;

    try {
        await apiFetch('/education/create.php', 'POST', { institution, degree, start_date, description });
        loadEducation();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deleteEducation(id) {
    if (!confirm('¿Borrar educación?')) return;
    try {
        await apiFetch('/education/delete.php', 'DELETE', { id });
        loadEducation();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}
