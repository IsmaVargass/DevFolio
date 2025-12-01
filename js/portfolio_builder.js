/* js/portfolio_builder.js */
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Load initial data
    loadUserData();
    loadExperience();
    loadEducation();
    loadSkills();

    // Event Listeners
    document.getElementById('preview-btn').addEventListener('click', updatePreview);
    document.getElementById('export-pdf-btn').addEventListener('click', exportPDF);
    document.getElementById('publish-btn').addEventListener('click', publishPortfolio);
    
    // Live preview updates
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Photo upload preview
    document.getElementById('profile-photo').addEventListener('change', handlePhotoUpload);
});

function loadUserData() {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('full-name').value = user.nombre || '';
    // Load other user data if available in localStorage or fetch from API
}

function loadExperience() {
    // Mock data for now - replace with API call
    const experienceList = document.getElementById('experience-list');
    // In a real implementation, fetch from /api/experience/get.php
    experienceList.innerHTML = '<p class="text-muted">No hay experiencia registrada. <a href="experience.html">Añadir</a></p>';
}

function loadEducation() {
    const educationList = document.getElementById('education-list');
    educationList.innerHTML = '<p class="text-muted">No hay educación registrada. <a href="experience.html">Añadir</a></p>';
}

function loadSkills() {
    const skillsSelector = document.getElementById('skills-selector');
    // Mock skills
    const skills = [
        { id: 1, name: 'HTML5', type: 'technical' },
        { id: 2, name: 'CSS3', type: 'technical' },
        { id: 3, name: 'JavaScript', type: 'technical' },
        { id: 4, name: 'Liderazgo', type: 'soft' }
    ];

    skillsSelector.innerHTML = skills.map(skill => `
        <div>
            <input type="checkbox" id="skill-${skill.id}" class="skill-checkbox" value="${skill.name}" checked>
            <label for="skill-${skill.id}" class="skill-label">${skill.name}</label>
        </div>
    `).join('');
    
    // Add event listeners to new checkboxes
    document.querySelectorAll('.skill-checkbox').forEach(cb => {
        cb.addEventListener('change', updatePreview);
    });
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            // Store image data for preview
            sessionStorage.setItem('portfolio_photo', e.target.result);
            updatePreview();
        };
        reader.readAsDataURL(file);
    }
}

function updatePreview() {
    const preview = document.getElementById('portfolio-preview');
    const data = {
        name: document.getElementById('full-name').value,
        title: document.getElementById('professional-title').value,
        summary: document.getElementById('professional-summary').value,
        photo: sessionStorage.getItem('portfolio_photo'),
        skills: Array.from(document.querySelectorAll('.skill-checkbox:checked')).map(cb => cb.value)
    };

    preview.innerHTML = `
        <div class="preview-content" style="padding: 2rem; background: white; max-width: 800px; margin: 0 auto;">
            <div style="text-align: center; margin-bottom: 2rem;">
                ${data.photo ? `<img src="${data.photo}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1rem;">` : ''}
                <h1 style="margin: 0; color: #333;">${data.name || 'Tu Nombre'}</h1>
                <p style="color: #666; font-size: 1.1rem; margin-top: 0.5rem;">${data.title || 'Título Profesional'}</p>
            </div>

            ${data.summary ? `
            <div style="margin-bottom: 2rem;">
                <h3 style="border-bottom: 2px solid #eee; padding-bottom: 0.5rem; margin-bottom: 1rem;">Perfil Profesional</h3>
                <p>${data.summary}</p>
            </div>
            ` : ''}

            ${data.skills.length > 0 ? `
            <div style="margin-bottom: 2rem;">
                <h3 style="border-bottom: 2px solid #eee; padding-bottom: 0.5rem; margin-bottom: 1rem;">Habilidades</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${data.skills.map(skill => `<span style="background: #f0f0f0; padding: 0.3rem 0.8rem; border-radius: 4px; font-size: 0.9rem;">${skill}</span>`).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    `;
}

function exportPDF() {
    window.print();
}

function publishPortfolio() {
    if (!confirm('¿Estás seguro de que quieres publicar tu portfolio en la comunidad?')) return;
    
    // API call to publish
    alert('¡Portfolio publicado con éxito! Ahora es visible en la comunidad.');
}
