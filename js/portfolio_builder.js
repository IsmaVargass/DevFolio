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

    // Theme color listener
    const themeInput = document.getElementById('theme-color');
    if (themeInput) {
        themeInput.addEventListener('input', updatePreview);
        themeInput.addEventListener('change', updatePreview);
    }

    // Live preview updates for other inputs
    const inputs = document.querySelectorAll('input:not(#theme-color), textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updatePreview);
    });

    // Initial preview
    setTimeout(updatePreview, 500);
});

function loadUserData() {
    // No longer loading into inputs, but we use this to verify user exists
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;
}

function loadExperience() {
    // In a real app, this would fetch from API/localStorage
    // For now, we just show a link if no experience is found
    const experienceList = document.getElementById('experience-list');
    if (experienceList) {
        experienceList.innerHTML = '<p class="text-muted">La experiencia se cargará automáticamente de tu perfil.</p>';
    }
}

function loadEducation() {
    const educationList = document.getElementById('education-list');
    if (educationList) {
        educationList.innerHTML = '<p class="text-muted">La educación se cargará automáticamente de tu perfil.</p>';
    }
}

function loadSkills() {
    const skillsSelector = document.getElementById('skills-selector');
    // Mock skills - in real app, fetch from user's skills
    const skills = [
        { id: 1, name: 'HTML5', type: 'technical' },
        { id: 2, name: 'CSS3', type: 'technical' },
        { id: 3, name: 'JavaScript', type: 'technical' },
        { id: 4, name: 'React', type: 'technical' },
        { id: 5, name: 'Liderazgo', type: 'soft' },
        { id: 6, name: 'Comunicación', type: 'soft' }
    ];

    if (skillsSelector) {
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
}

function updatePreview() {
    const user = JSON.parse(localStorage.getItem('user'));
    const preview = document.getElementById('portfolio-preview');
    const themeColor = document.getElementById('theme-color') ? document.getElementById('theme-color').value : '#000000';

    const data = {
        name: user.nombre,
        title: document.getElementById('professional-title').value,
        summary: document.getElementById('professional-summary').value,
        photo: getUserAvatar(user),
        skills: Array.from(document.querySelectorAll('.skill-checkbox:checked')).map(cb => cb.value)
    };

    preview.innerHTML = `
        <div class="preview-content" style="padding: 3rem; background: white; max-width: 800px; margin: 0 auto; font-family: 'Inter', sans-serif; color: #333;">
            <div style="text-align: center; margin-bottom: 3rem;">
                <img src="${data.photo}" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; margin-bottom: 1.5rem; border: 4px solid ${themeColor}; padding: 3px;">
                <h1 style="margin: 0; color: #111; font-size: 2.5rem; font-weight: 700; letter-spacing: -1px;">${data.name}</h1>
                <p style="color: ${themeColor}; font-size: 1.2rem; margin-top: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">${data.title || 'Título Profesional'}</p>
            </div>

            ${data.summary ? `
            <div style="margin-bottom: 3rem;">
                <h3 style="border-bottom: 2px solid ${themeColor}30; padding-bottom: 0.8rem; margin-bottom: 1.2rem; color: #111; font-size: 1.4rem;">Perfil Profesional</h3>
                <p style="line-height: 1.8; color: #555; font-size: 1.05rem;">${data.summary}</p>
            </div>
            ` : ''}

            ${data.skills.length > 0 ? `
            <div style="margin-bottom: 3rem;">
                <h3 style="border-bottom: 2px solid ${themeColor}30; padding-bottom: 0.8rem; margin-bottom: 1.2rem; color: #111; font-size: 1.4rem;">Habilidades</h3>
                <div style="display: flex; flex-wrap: wrap; gap: 0.8rem;">
                    ${data.skills.map(skill => `
                        <span style="background: ${themeColor}10; color: ${themeColor}; padding: 0.5rem 1.2rem; border-radius: 50px; font-size: 0.95rem; font-weight: 600; border: 1px solid ${themeColor}30;">
                            ${skill}
                        </span>
                    `).join('')}
                </div>
            </div>
            ` : ''}
            
            <div style="margin-top: 4rem; text-align: center; color: #888; font-size: 0.9rem;">
                <p>&copy; ${new Date().getFullYear()} ${data.name}. Creado con DevFolio.</p>
            </div>
        </div>
    `;
}

function exportPDF() {
    window.print();
}

function publishPortfolio() {
    if (!confirm('¿Estás seguro de que quieres publicar tu portfolio en la comunidad?')) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const themeColor = document.getElementById('theme-color') ? document.getElementById('theme-color').value : '#000000';

    const data = {
        id: Date.now(),
        title: document.getElementById('professional-title').value || 'Portfolio de ' + user.nombre,
        author: user.nombre,
        tags: Array.from(document.querySelectorAll('.skill-checkbox:checked')).map(cb => cb.value).slice(0, 3),
        photo: getUserAvatar(user), // Use the utility function
        publishedDate: new Date().toISOString(),
        themeColor: themeColor
    };

    const published = JSON.parse(localStorage.getItem('published_portfolios') || '[]');
    published.unshift(data);
    localStorage.setItem('published_portfolios', JSON.stringify(published));

    showToast('¡Portfolio publicado con éxito! Ahora es visible en la comunidad.', 'success');

    setTimeout(() => {
        window.location.href = 'communities.html';
    }, 1500);
}
