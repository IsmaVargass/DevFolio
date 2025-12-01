/* js/portfolio_builder.js */
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Initialize
    const validationResult = loadDefaultData();
    
    // Event Listeners
    document.getElementById('preview-btn').addEventListener('click', updatePreview);
    document.getElementById('export-pdf-btn').addEventListener('click', exportPDF);
    document.getElementById('publish-btn').addEventListener('click', publishPortfolio);

    const goToProfileBtn = document.getElementById('go-to-profile-btn');
    if (goToProfileBtn) {
        goToProfileBtn.addEventListener('click', () => {
            // Determine where to send user based on what's missing
            const experience = JSON.parse(localStorage.getItem('experience') || '[]');
            const education = JSON.parse(localStorage.getItem('education') || '[]');
            
            if (!user.nombre || user.nombre === 'Usuario') {
                window.location.href = 'profile.html';
            } else if (experience.length === 0 || education.length === 0) {
                window.location.href = 'experience.html';
            } else {
                window.location.href = 'profile.html';
            }
        });
    }

    const themeInput = document.getElementById('theme-color');
    if (themeInput) {
        themeInput.addEventListener('input', updatePreview);
    }

    document.getElementById('about-me').addEventListener('input', updatePreview);
    document.getElementById('projects-text').addEventListener('input', updatePreview);

    // Initial preview
    setTimeout(updatePreview, 500);

    // Disable publish/export if validation fails
    if (!validationResult.isValid) {
        document.getElementById('publish-btn').disabled = true;
        document.getElementById('export-pdf-btn').disabled = true;
        document.getElementById('publish-btn').style.opacity = '0.5';
        document.getElementById('export-pdf-btn').style.opacity = '0.5';
        document.getElementById('publish-btn').title = 'Completa todos los datos requeridos primero';
        document.getElementById('export-pdf-btn').title = 'Completa todos los datos requeridos primero';
    }
});

function loadDefaultData() {
    const user = JSON.parse(localStorage.getItem('user'));
    let isValid = true;
    let missingFields = [];

    // 1. Name
    const nameElement = document.getElementById('default-name');
    const nameStatus = document.getElementById('name-status');
    if (user.nombre && user.nombre !== 'Usuario') {
        nameElement.textContent = user.nombre;
        nameStatus.textContent = '✓';
        nameStatus.style.color = '#10b981';
    } else {
        nameElement.textContent = 'Sin nombre';
        nameStatus.textContent = '✗';
        nameStatus.style.color = '#dc2626';
        isValid = false;
        missingFields.push('nombre');
    }

    // 2. Sector (Derived from Experience)
    const experience = JSON.parse(localStorage.getItem('experience') || '[]');
    const currentJob = experience.find(exp => !exp.endDate || exp.endDate.toLowerCase() === 'presente' || exp.endDate.toLowerCase() === 'actualidad');

    const sectorElement = document.getElementById('default-sector');
    const sectorStatus = document.getElementById('sector-status');
    let sector = '';
    
    if (currentJob) {
        sector = currentJob.title + ' en ' + currentJob.company;
        sectorElement.textContent = sector;
        sectorStatus.textContent = '✓';
        sectorStatus.style.color = '#10b981';
    } else if (experience.length > 0) {
        const lastJob = experience[0];
        sector = lastJob.title + ' (Ex-' + lastJob.company + ')';
        sectorElement.textContent = sector;
        sectorStatus.textContent = '✓';
        sectorStatus.style.color = '#10b981';
    } else {
        sectorElement.textContent = 'Sin experiencia registrada';
        sectorStatus.textContent = '✗';
        sectorStatus.style.color = '#dc2626';
        isValid = false;
        missingFields.push('experiencia');
    }
    sectorElement.dataset.value = sector;

    // 3. Studies
    const education = JSON.parse(localStorage.getItem('education') || '[]');
    const educationElement = document.getElementById('default-education');
    const educationStatus = document.getElementById('education-status');
    
    if (education.length > 0) {
        const educationText = education.map(edu => `${edu.degree} en ${edu.school}`).join(', ');
        educationElement.textContent = educationText;
        educationStatus.textContent = '✓';
        educationStatus.style.color = '#10b981';
    } else {
        educationElement.textContent = 'Sin estudios registrados';
        educationStatus.textContent = '✗';
        educationStatus.style.color = '#dc2626';
        isValid = false;
        missingFields.push('educación');
    }
    educationElement.dataset.value = JSON.stringify(education);

    // Show/hide warning
    const warningBox = document.getElementById('missing-data-warning');
    if (!isValid) {
        warningBox.style.display = 'block';
        const validationBox = document.getElementById('validation-box');
        validationBox.style.borderColor = '#dc2626';
        validationBox.style.backgroundColor = '#fef2f2';
    } else {
        warningBox.style.display = 'none';
    }

    return { isValid, missingFields };
}

function updatePreview() {
    const user = JSON.parse(localStorage.getItem('user'));
    const themeColor = document.getElementById('theme-color').value;
    const aboutMe = document.getElementById('about-me').value;
    const projects = document.getElementById('projects-text').value;

    const sector = document.getElementById('default-sector').dataset.value || 'Sector no definido';
    const education = JSON.parse(document.getElementById('default-education').dataset.value || '[]');

    const preview = document.getElementById('portfolio-preview');

    preview.innerHTML = `
        <div class="pdf-container" style="background: white; padding: 3rem; max-width: 800px; margin: 0 auto; font-family: 'Inter', sans-serif; color: #333;">
            <!-- Header / Default Section -->
            <div style="border-bottom: 4px solid ${themeColor}; padding-bottom: 2rem; margin-bottom: 2rem;">
                <h1 style="font-size: 2.5rem; margin: 0; color: #111;">${user.nombre}</h1>
                <h2 style="font-size: 1.2rem; color: ${themeColor}; margin: 0.5rem 0 0 0; font-weight: 600; text-transform: uppercase;">${sector}</h2>
                
                <div style="margin-top: 1.5rem;">
                    <h3 style="font-size: 1rem; color: #666; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 1px;">Formación Académica</h3>
                    ${education.length > 0 ?
                        `<ul style="margin: 0; padding-left: 1.2rem;">
                            ${education.map(edu => `<li style="margin-bottom: 0.3rem;"><strong>${edu.degree}</strong> - ${edu.school} <span style="color:#777; font-size:0.9em;">(${edu.year})</span></li>`).join('')}
                        </ul>`
                        : '<p style="font-style: italic; color: #888;">No hay estudios registrados.</p>'}
                </div>
            </div>

            <!-- User Added Content -->
            ${aboutMe ? `
            <div style="margin-bottom: 2rem;">
                <h3 style="color: ${themeColor}; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">Sobre Mí</h3>
                <p style="line-height: 1.6; white-space: pre-line;">${aboutMe}</p>
            </div>
            ` : ''}

            ${projects ? `
            <div style="margin-bottom: 2rem;">
                <h3 style="color: ${themeColor}; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;">Proyectos Destacados</h3>
                <p style="line-height: 1.6; white-space: pre-line;">${projects}</p>
            </div>
            ` : ''}
            
            <div style="margin-top: 4rem; text-align: center; font-size: 0.8rem; color: #aaa; border-top: 1px solid #eee; padding-top: 1rem;">
                Generado con DevFolio
            </div>
        </div>
    `;
}

function exportPDF() {
    // Use browser's print functionality
    window.print();
}

function publishPortfolio() {
    if (!confirm('¿Estás seguro de que quieres publicar tu portfolio?')) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const sector = document.getElementById('default-sector').dataset.value;

    const data = {
        id: Date.now(),
        userId: user.id || user.email,
        title: `Portfolio de ${user.nombre}`,
        author: user.nombre,
        tags: [sector.split(' ')[0], 'Profesional'],
        photo: getUserAvatar(user),
        publishedDate: new Date().toISOString(),
        views: 0
    };

    const published = JSON.parse(localStorage.getItem('published_portfolios') || '[]');
    
    // Remove previous portfolio from same user
    const filtered = published.filter(p => p.userId !== data.userId);
    filtered.unshift(data);
    
    localStorage.setItem('published_portfolios', JSON.stringify(filtered));

    showToast('Portfolio publicado con éxito', 'success');
    setTimeout(() => window.location.href = 'communities.html', 1500);
}
