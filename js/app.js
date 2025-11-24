// js/app.js
import { checkSession, logout } from './auth.js';
import { loadProjects, createProject, updateProject, openCreateModal, closeModal } from './projects.js';
import { loadSkills, createSkill } from './skills.js';
import { loadExperience, createExperience, loadEducation, createEducation } from './cv.js';
import { loadTestimonials, createTestimonial, loadSocialLinks, createSocialLink } from './profile.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Solo ejecutar lógica de dashboard si estamos en dashboard.html
    if (window.location.pathname.includes('dashboard.html')) {
        await checkSession(); // Redirige si no hay sesión

        // Cargar datos
        loadProjects();
        loadSkills();
        loadExperience();
        loadEducation();
        loadTestimonials();
        loadSocialLinks();

        // Listeners Dashboard
        setupDashboardListeners();
    }
});

function setupDashboardListeners() {
    // Logout
    document.getElementById('btn-logout')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });

    // Proyectos
    document.getElementById('btn-new-project')?.addEventListener('click', openCreateModal);

    // Formulario Proyecto
    document.getElementById('project-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = document.getElementById('project-id').value;
        const titulo = document.getElementById('project-titulo').value;
        const descripcion = document.getElementById('project-descripcion').value;
        const tecnologias = document.getElementById('project-tecnologias').value;
        const imagen_url = document.getElementById('project-imagen').value;
        const enlace_proyecto = document.getElementById('project-enlace').value;

        const data = { titulo, descripcion, tecnologias, imagen_url, enlace_proyecto };

        if (id) {
            data.id = id;
            updateProject(data);
        } else {
            createProject(data);
        }
    });

    // Expansión
    document.getElementById('btn-new-skill')?.addEventListener('click', createSkill);
    document.getElementById('btn-new-experience')?.addEventListener('click', createExperience);
    document.getElementById('btn-new-education')?.addEventListener('click', createEducation);
    document.getElementById('btn-new-testimonial')?.addEventListener('click', createTestimonial);
    document.getElementById('btn-new-social')?.addEventListener('click', createSocialLink);
}
