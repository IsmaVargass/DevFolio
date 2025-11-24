// js/profile.js
import { apiFetch } from './api.js';
import { showAlert } from './utils.js';

// --- TESTIMONIALS ---
export async function loadTestimonials() {
    const list = document.getElementById('testimonials-list');
    try {
        const items = await apiFetch('/testimonials/list.php');
        list.innerHTML = items.map(item => `
            <div class="cv-item">
                <h3>${item.author_name} <small>(${item.author_position})</small></h3>
                <p>"${item.content}"</p>
                <button class="btn btn-sm btn-danger btn-delete-test" data-id="${item.id}">Borrar</button>
            </div>
        `).join('');

        document.querySelectorAll('.btn-delete-test').forEach(btn => {
            btn.addEventListener('click', () => deleteTestimonial(btn.dataset.id));
        });
    } catch (error) {
        console.error(error);
    }
}

export async function createTestimonial() {
    const author_name = prompt('Nombre del Autor:');
    const author_position = prompt('Cargo del Autor:');
    const content = prompt('Testimonio:');

    if (!author_name || !content) return;

    try {
        await apiFetch('/testimonials/create.php', 'POST', { author_name, author_position, content });
        loadTestimonials();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deleteTestimonial(id) {
    if (!confirm('¿Borrar testimonio?')) return;
    try {
        await apiFetch('/testimonials/delete.php', 'DELETE', { id });
        loadTestimonials();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

// --- SOCIAL LINKS ---
export async function loadSocialLinks() {
    const list = document.getElementById('social-list');
    try {
        const items = await apiFetch('/social_links/list.php');
        list.innerHTML = items.map(item => `
            <div class="skill-tag">
                <a href="${item.url}" target="_blank">${item.platform}</a>
                <button class="btn-delete-social" data-id="${item.id}">&times;</button>
            </div>
        `).join('');

        document.querySelectorAll('.btn-delete-social').forEach(btn => {
            btn.addEventListener('click', () => deleteSocialLink(btn.dataset.id));
        });
    } catch (error) {
        console.error(error);
    }
}

export async function createSocialLink() {
    const platform = prompt('Plataforma (ej. LinkedIn):');
    const url = prompt('URL:');

    if (!platform || !url) return;

    try {
        await apiFetch('/social_links/create.php', 'POST', { platform, url });
        loadSocialLinks();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deleteSocialLink(id) {
    if (!confirm('¿Borrar red social?')) return;
    try {
        await apiFetch('/social_links/delete.php', 'DELETE', { id });
        loadSocialLinks();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}
