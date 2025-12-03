/* js/portfolio_builder.js */
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Load initial data
    loadInitialData(user);

    // Event Listeners for Inputs
    const inputs = [
        'input-name', 'input-title', 'input-email',
        'input-about', 'input-projects', 'input-color',
        'check-experience', 'check-education'
    ];

    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', updatePreview);
            el.addEventListener('change', updatePreview);
        }
    });

    // Action Buttons
    document.getElementById('btn-export').addEventListener('click', exportPDF);
    document.getElementById('btn-publish').addEventListener('click', publishPortfolio);

    // Initial Preview
    updatePreview();
});

function toggleAccordion(header) {
    const item = header.parentElement;
    const isActive = item.classList.contains('active');

    // Close all items
    document.querySelectorAll('.accordion-item').forEach(i => {
        i.classList.remove('active');
    });

    // Open clicked item if it wasn't active
    if (!isActive) {
        item.classList.add('active');
    }
}

function loadInitialData(user) {
    // Basic Info
    document.getElementById('input-name').value = user.nombre || '';
    document.getElementById('input-email').value = user.email || '';

    // Try to derive title from experience
    const experience = JSON.parse(localStorage.getItem('experience') || '[]');
    const currentJob = experience.find(exp => !exp.endDate || exp.endDate.toLowerCase() === 'presente' || exp.endDate.toLowerCase() === 'actualidad');

    if (currentJob) {
        document.getElementById('input-title').value = `${currentJob.title} en ${currentJob.company}`;
    } else if (experience.length > 0) {
        document.getElementById('input-title').value = experience[0].title;
    }
}

function updatePreview() {
    const data = {
        name: document.getElementById('input-name').value || 'Tu Nombre',
        title: document.getElementById('input-title').value || 'Tu Título Profesional',
        email: document.getElementById('input-email').value || 'tu@email.com',
        about: document.getElementById('input-about').value,
        projects: document.getElementById('input-projects').value,
        color: document.getElementById('input-color').value,
        showExp: document.getElementById('check-experience').checked,
        showEdu: document.getElementById('check-education').checked
    };

    const experience = JSON.parse(localStorage.getItem('experience') || '[]');
    const education = JSON.parse(localStorage.getItem('education') || '[]');

    const preview = document.getElementById('preview-paper');

    preview.innerHTML = `
        <div class="preview-header" style="border-color: ${data.color}">
            <h1 class="preview-name">${data.name}</h1>
            <h2 class="preview-title" style="color: ${data.color}">${data.title}</h2>
            <p style="margin-top: 0.5rem; color: #666;">${data.email}</p>
        </div>

        ${data.about ? `
        <div class="preview-section">
            <h3 class="preview-section-title">Sobre Mí</h3>
            <p style="line-height: 1.6; color: #4b5563;">${data.about.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}

        ${data.showExp && experience.length > 0 ? `
        <div class="preview-section">
            <h3 class="preview-section-title">Experiencia Laboral</h3>
            ${experience.map(exp => `
                <div class="preview-item">
                    <div class="preview-item-title">${exp.title}</div>
                    <div class="preview-item-subtitle">${exp.company} • ${exp.startDate} - ${exp.endDate}</div>
                    <p style="margin-top: 0.25rem; font-size: 0.9rem; color: #4b5563;">${exp.description || ''}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${data.showEdu && education.length > 0 ? `
        <div class="preview-section">
            <h3 class="preview-section-title">Formación Académica</h3>
            ${education.map(edu => `
                <div class="preview-item">
                    <div class="preview-item-title">${edu.degree}</div>
                    <div class="preview-item-subtitle">${edu.school} • ${edu.year}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${data.projects ? `
        <div class="preview-section">
            <h3 class="preview-section-title">Proyectos Destacados</h3>
            <p style="line-height: 1.6; color: #4b5563;">${data.projects.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}
    `;
}

function exportPDF() {
    window.print();
}

function publishPortfolio() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!confirm('¿Estás seguro de que quieres publicar tu portfolio?')) return;

    // Get all portfolio data
    const experience = JSON.parse(localStorage.getItem('experience') || '[]');
    const education = JSON.parse(localStorage.getItem('education') || '[]');

    const data = {
        id: Date.now(),
        userId: user.id || user.email,
        title: `Portfolio de ${document.getElementById('input-name').value}`,
        author: document.getElementById('input-name').value,
        professionalTitle: document.getElementById('input-title').value,
        email: document.getElementById('input-email').value,
        about: document.getElementById('input-about').value,
        projects: document.getElementById('input-projects').value,
        color: document.getElementById('input-color').value,
        showExperience: document.getElementById('check-experience').checked,
        showEducation: document.getElementById('check-education').checked,
        experience: experience,
        education: education,
        tags: [document.getElementById('input-title').value.split(' ')[0] || 'Dev', 'Profesional'],
        photo: getUserAvatar(user),
        publishedDate: new Date().toISOString(),
        views: 0
    };

    const published = JSON.parse(localStorage.getItem('published_portfolios') || '[]');
    const filtered = published.filter(p => p.userId !== data.userId);
    filtered.unshift(data);
    localStorage.setItem('published_portfolios', JSON.stringify(filtered));

    showToast('Portfolio publicado con éxito', 'success');
    setTimeout(() => window.location.href = 'communities.html', 1500);
}
