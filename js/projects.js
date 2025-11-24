// js/projects.js
import { apiFetch } from './api.js';
import { showAlert } from './utils.js';

export async function loadProjects() {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '<p class="loading-text">Cargando proyectos...</p>';

    try {
        const projects = await apiFetch('/projects/list.php');
        renderProjects(projects);
    } catch (error) {
        grid.innerHTML = '<p class="error-text">Error al cargar proyectos</p>';
        console.error(error);
    }
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    grid.innerHTML = '';

    if (projects.length === 0) {
        grid.innerHTML = '<p class="empty-text">No tienes proyectos aún. ¡Crea uno!</p>';
        return;
    }

    projects.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';

        // Imagen por defecto si no hay URL
        const imgUrl = project.imagen_url || 'assets/img/default-project.png'; // Asegúrate de tener esta imagen o manejar el error de carga

        card.innerHTML = `
            <img src="${imgUrl}" alt="${project.titulo}" class="project-image" onerror="this.src='https://via.placeholder.com/400x200?text=Sin+Imagen'">
            <div class="project-content">
                <h3 class="project-title">${project.titulo}</h3>
                <p class="project-desc">${project.descripcion || 'Sin descripción'}</p>
                <div class="project-tech">
                    ${project.tecnologias ? project.tecnologias.split(',').map(t => `<span class="tech-tag">${t.trim()}</span>`).join('') : ''}
                </div>
                <div class="project-actions">
                    <a href="${project.enlace_proyecto}" target="_blank" class="btn btn-sm btn-outline" ${!project.enlace_proyecto ? 'style="display:none"' : ''}>Ver</a>
                    <div>
                        <button class="btn btn-sm btn-primary btn-edit" data-id="${project.id}">Editar</button>
                        <button class="btn btn-sm btn-danger btn-delete" data-id="${project.id}">Borrar</button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Event Listeners para botones dinámicos
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => deleteProject(e.target.dataset.id));
    });

    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => openEditModal(e.target.dataset.id, projects));
    });
}

export async function createProject(data) {
    try {
        await apiFetch('/projects/create.php', 'POST', data);
        showAlert('Proyecto creado exitosamente');
        closeModal();
        loadProjects();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

export async function updateProject(data) {
    try {
        await apiFetch('/projects/update.php', 'PUT', data);
        showAlert('Proyecto actualizado exitosamente');
        closeModal();
        loadProjects();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

async function deleteProject(id) {
    if (!confirm('¿Estás seguro de eliminar este proyecto?')) return;

    try {
        await apiFetch('/projects/delete.php', 'DELETE', { id });
        showAlert('Proyecto eliminado');
        loadProjects();
    } catch (error) {
        showAlert(error.message, 'error');
    }
}

// Modal Logic
const modal = document.getElementById('project-modal');
const form = document.getElementById('project-form');
const modalTitle = document.getElementById('modal-title');

export function openCreateModal() {
    form.reset();
    document.getElementById('project-id').value = '';
    modalTitle.textContent = 'Nuevo Proyecto';
    modal.classList.add('active');
}

function openEditModal(id, projects) {
    const project = projects.find(p => p.id == id);
    if (!project) return;

    document.getElementById('project-id').value = project.id;
    document.getElementById('project-titulo').value = project.titulo;
    document.getElementById('project-descripcion').value = project.descripcion;
    document.getElementById('project-tecnologias').value = project.tecnologias;
    document.getElementById('project-imagen').value = project.imagen_url;
    document.getElementById('project-enlace').value = project.enlace_proyecto;

    modalTitle.textContent = 'Editar Proyecto';
    modal.classList.add('active');
}

export function closeModal() {
    modal.classList.remove('active');
}

// Cerrar modal al hacer clic fuera
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

document.querySelector('.close-modal').addEventListener('click', closeModal);
