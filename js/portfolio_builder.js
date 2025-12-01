/* js/portfolio_builder.js */
document.addEventListener('DOMContentLoaded', () => {
    /* js/portfolio_builder.js */
    document.addEventListener('DOMContentLoaded', () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            window.location.href = 'login.html';
            return;
        }

        // Initialize
        loadDefaultData();

        // Event Listeners
        document.getElementById('preview-btn').addEventListener('click', updatePreview);
        document.getElementById('export-pdf-btn').addEventListener('click', exportPDF);
        document.getElementById('publish-btn').addEventListener('click', publishPortfolio);

        const themeInput = document.getElementById('theme-color');
        if (themeInput) {
            themeInput.addEventListener('input', updatePreview);
        }

        document.getElementById('about-me').addEventListener('input', updatePreview);
        document.getElementById('projects-text').addEventListener('input', updatePreview);

        // Initial preview
        setTimeout(updatePreview, 500);
    });

    function loadDefaultData() {
        const user = JSON.parse(localStorage.getItem('user'));

        // 1. Name
        document.getElementById('default-name').textContent = user.nombre || 'Usuario';

        // 2. Sector (Derived from Experience)
        const experience = JSON.parse(localStorage.getItem('experience') || '[]');
        const currentJob = experience.find(exp => !exp.endDate || exp.endDate.toLowerCase() === 'presente' || exp.endDate.toLowerCase() === 'actualidad');

        let sector = 'Sin experiencia registrada';
        if (currentJob) {
            sector = currentJob.title + ' en ' + currentJob.company;
        } else if (experience.length > 0) {
            // Use most recent if not current
            const lastJob = experience[0]; // Assuming sorted or just taking first
            sector = lastJob.title + ' (Ex-' + lastJob.company + ')';
        }
        document.getElementById('default-sector').textContent = sector;
        document.getElementById('default-sector').dataset.value = sector; // Store for preview

        // 3. Studies
        const education = JSON.parse(localStorage.getItem('education') || '[]');
        let educationText = 'Sin estudios registrados';
        if (education.length > 0) {
            educationText = education.map(edu => `${edu.degree} en ${edu.school}`).join(', ');
        }
        document.getElementById('default-education').textContent = educationText;
        document.getElementById('default-education').dataset.value = JSON.stringify(education); // Store for preview
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
        window.print();
    }

    function publishPortfolio() {
        if (!confirm('¿Estás seguro de que quieres publicar tu portfolio?')) return;

        const user = JSON.parse(localStorage.getItem('user'));
        const sector = document.getElementById('default-sector').dataset.value;

        const data = {
            id: Date.now(),
            title: `Portfolio de ${user.nombre}`,
            author: user.nombre,
            tags: [sector.split(' ')[0], 'Profesional'], // Simple tag generation
            photo: getUserAvatar(user),
            publishedDate: new Date().toISOString()
        };

        const published = JSON.parse(localStorage.getItem('published_portfolios') || '[]');
        published.unshift(data);
        localStorage.setItem('published_portfolios', JSON.stringify(published));

        showToast('Portfolio publicado con éxito', 'success');
        setTimeout(() => window.location.href = 'communities.html', 1500);
    }
