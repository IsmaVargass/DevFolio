/* Portfolio Builder - Final Fixed Version */

document.addEventListener('DOMContentLoaded', init);

let portfolioData = {
    colors: { primary: '#2563eb', secondary: '#1e40af', bg: '#ffffff', text: '#1f2937' },
    fonts: { heading: 'Inter', body: 'Inter', size: '16' },
    content: { about: '', projects: '', objective: '' },
    languages: [],
    dataSource: { about: 'custom', projects: 'custom' },
    visibility: { exp: true, edu: true, skills: true, projects: true, objective: false, languages: false },
    user: {},
    experience: [],
    education: [],
    skills: []
};

const availableLanguages = [
    'Español', 'Inglés', 'Francés', 'Alemán', 'Italiano', 'Portugués',
    'Chino', 'Japonés', 'Coreano', 'Árabe', 'Ruso', 'Holandés'
];

function init() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    portfolioData.user = user;
    portfolioData.experience = JSON.parse(localStorage.getItem('experience') || '[]');
    portfolioData.education = JSON.parse(localStorage.getItem('education') || '[]');
    portfolioData.skills = JSON.parse(localStorage.getItem('skills') || '[]');

    // Load profile data if exists
    if (user.bio) {
        portfolioData.content.about = user.bio;
    }

    setupTabs();
    setupControls();
    renderLanguageCheckboxes();
    updatePreview();
}

function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(`tab-${btn.dataset.tab}`).classList.add('active');
        });
    });
}

function setupControls() {
    // Colors
    setupColorControl('primaryColor', 'primary');
    setupColorControl('secondaryColor', 'secondary');
    setupColorControl('bgColor', 'bg');
    setupColorControl('textColor', 'text');

    // Typography
    setupSelectControl('headingFont', (value) => {
        portfolioData.fonts.heading = value;
        updatePreview();
    });

    setupSelectControl('bodyFont', (value) => {
        portfolioData.fonts.body = value;
        updatePreview();
    });

    const fontSize = document.getElementById('fontSize');
    if (fontSize) {
        fontSize.addEventListener('input', e => {
            portfolioData.fonts.size = e.target.value;
            document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
            updatePreview();
        });
    }

    // Data source switches (only for About and Projects)
    setupDataSourceSwitch('aboutSource', 'about');
    setupDataSourceSwitch('projectsSource', 'projects');

    // Content textareas
    setupTextarea('aboutText', 'about');
    setupTextarea('projectsText', 'projects');
    setupTextarea('objectiveText', 'objective');

    // Toggle buttons
    setupToggle('toggleObjective', 'objective');
    setupToggle('toggleExp', 'exp');
    setupToggle('toggleEdu', 'edu');
    setupToggle('toggleSkills', 'skills');
    setupToggle('toggleProjects', 'projects');
    setupToggle('toggleLanguages', 'languages');

    // Action buttons
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) downloadBtn.addEventListener('click', downloadPDF);

    const publishBtn = document.getElementById('publishBtn');
    if (publishBtn) publishBtn.addEventListener('click', publishPortfolio);
}

function renderLanguageCheckboxes() {
    const container = document.getElementById('languagesCheckboxes');
    if (!container) return;

    container.innerHTML = availableLanguages.map(lang => `
        <label class="language-checkbox">
            <input type="checkbox" value="${lang}" ${portfolioData.languages.includes(lang) ? 'checked' : ''}>
            <span>${lang}</span>
        </label>
    `).join('');

    // Add event listeners
    container.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', e => {
            if (e.target.checked) {
                if (!portfolioData.languages.includes(e.target.value)) {
                    portfolioData.languages.push(e.target.value);
                }
            } else {
                portfolioData.languages = portfolioData.languages.filter(lang => lang !== e.target.value);
            }
            updatePreview();
        });
    });
}

function setupColorControl(elementId, colorKey) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener('input', e => {
            portfolioData.colors[colorKey] = e.target.value;
            updatePreview();
        });
    }
}

function setupSelectControl(elementId, callback) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener('change', e => callback(e.target.value));
    }
}

function setupDataSourceSwitch(elementId, contentKey) {
    const switches = document.querySelectorAll(`input[name="${elementId}"]`);
    switches.forEach(sw => {
        sw.addEventListener('change', e => {
            if (e.target.checked) {
                portfolioData.dataSource[contentKey] = e.target.value;

                if (e.target.value === 'profile') {
                    loadProfileData(contentKey);
                }

                const textarea = document.getElementById(`${contentKey}Text`);
                if (textarea) {
                    textarea.disabled = (e.target.value === 'profile');
                }

                updatePreview();
            }
        });
    });
}

function loadProfileData(key) {
    const user = portfolioData.user;

    switch (key) {
        case 'about':
            portfolioData.content.about = user.bio || user.description || '';
            const aboutTextarea = document.getElementById('aboutText');
            if (aboutTextarea) aboutTextarea.value = portfolioData.content.about;
            break;

        case 'projects':
            portfolioData.content.projects = user.projects || '';
            const projectsTextarea = document.getElementById('projectsText');
            if (projectsTextarea) projectsTextarea.value = portfolioData.content.projects;
            break;
    }
}

function setupTextarea(elementId, contentKey) {
    const element = document.getElementById(elementId);
    if (element) {
        element.addEventListener('input', e => {
            portfolioData.content[contentKey] = e.target.value;
            updatePreview();
        });
    }
}

function setupToggle(elementId, visibilityKey) {
    const element = document.getElementById(elementId);
    if (element) {
        if (portfolioData.visibility[visibilityKey]) {
            element.classList.add('active');
        }

        element.addEventListener('click', () => {
            element.classList.toggle('active');
            portfolioData.visibility[visibilityKey] = element.classList.contains('active');
            updatePreview();
        });
    }
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short' });
}

function updatePreview() {
    const preview = document.getElementById('portfolioPreview');
    if (!preview) return;

    const { colors, fonts, content, visibility, user, experience, education, skills, languages } = portfolioData;

    let html = `
        <div class="portfolio-header" style="border-bottom: 3px solid ${colors.primary}; padding-bottom: 2rem; margin-bottom: 2rem; font-family: '${fonts.heading}', sans-serif;">
            <h1 style="color: ${colors.primary}; margin: 0; font-size: 2.5rem; font-family: '${fonts.heading}', sans-serif;">${user.nombre || 'Tu Nombre'}</h1>
            <p style="color: ${colors.secondary}; font-size: 1.125rem; margin-top: 0.5rem;">${user.email || 'email@ejemplo.com'}</p>
            ${user.telefono ? `<p style="color: ${colors.text}; margin-top: 0.25rem;">${user.telefono}</p>` : ''}
        </div>
    `;

    if (visibility.objective && content.objective) {
        html += `
            <div class="portfolio-section" style="margin-bottom: 2rem; font-family: '${fonts.body}', sans-serif; font-size: ${fonts.size}px;">
                <h2 style="color: ${colors.primary}; font-size: 1.5rem; margin-bottom: 1rem; border-bottom: 2px solid ${colors.secondary}; padding-bottom: 0.5rem; font-family: '${fonts.heading}', sans-serif;">Objetivo Profesional</h2>
                <p style="line-height: 1.6; color: ${colors.text};">${content.objective.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    }

    if (content.about) {
        html += `
            <div class="portfolio-section" style="margin-bottom: 2rem; font-family: '${fonts.body}', sans-serif; font-size: ${fonts.size}px;">
                <h2 style="color: ${colors.primary}; font-size: 1.5rem; margin-bottom: 1rem; border-bottom: 2px solid ${colors.secondary}; padding-bottom: 0.5rem; font-family: '${fonts.heading}', sans-serif;">Sobre Mí</h2>
                <p style="line-height: 1.6; color: ${colors.text};">${content.about.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    }

    if (visibility.exp && experience.length > 0) {
        html += `
            <div class="portfolio-section" style="margin-bottom: 2rem; font-family: '${fonts.body}', sans-serif; font-size: ${fonts.size}px;">
                <h2 style="color: ${colors.primary}; font-size: 1.5rem; margin-bottom: 1rem; border-bottom: 2px solid ${colors.secondary}; padding-bottom: 0.5rem; font-family: '${fonts.heading}', sans-serif;">Experiencia Laboral</h2>
                ${experience.map(exp => `
                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="margin: 0; font-size: 1.125rem; color: ${colors.primary}; font-family: '${fonts.heading}', sans-serif;">${exp.role || exp.title || 'Puesto'}</h3>
                        <p style="margin: 0.25rem 0; color: ${colors.secondary}; font-weight: 500;">${exp.company || 'Empresa'} | ${formatDate(exp.start)} - ${exp.end ? formatDate(exp.end) : 'Actualidad'}</p>
                        ${exp.description ? `<p style="margin-top: 0.5rem; line-height: 1.6; color: ${colors.text};">${exp.description}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    if (visibility.edu && education.length > 0) {
        html += `
            <div class="portfolio-section" style="margin-bottom: 2rem; font-family: '${fonts.body}', sans-serif; font-size: ${fonts.size}px;">
                <h2 style="color: ${colors.primary}; font-size: 1.5rem; margin-bottom: 1rem; border-bottom: 2px solid ${colors.secondary}; padding-bottom: 0.5rem; font-family: '${fonts.heading}', sans-serif;">Educación</h2>
                ${education.map(edu => `
                    <div style="margin-bottom: 1.5rem;">
                        <h3 style="margin: 0; font-size: 1.125rem; color: ${colors.primary}; font-family: '${fonts.heading}', sans-serif;">${edu.degree || edu.title || 'Título'}</h3>
                        <p style="margin: 0.25rem 0; color: ${colors.secondary}; font-weight: 500;">${edu.institution || edu.school || 'Institución'} | ${formatDate(edu.start)} - ${edu.end ? formatDate(edu.end) : 'Actualidad'}</p>
                        ${edu.description ? `<p style="margin-top: 0.5rem; line-height: 1.6; color: ${colors.text};">${edu.description}</p>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    if (visibility.skills && skills.length > 0) {
        html += `
            <div class="portfolio-section" style="margin-bottom: 2rem; font-family: '${fonts.body}', sans-serif; font-size: ${fonts.size}px;">
                <h2 style="color: ${colors.primary}; font-size: 1.5rem; margin-bottom: 1rem; border-bottom: 2px solid ${colors.secondary}; padding-bottom: 0.5rem; font-family: '${fonts.heading}', sans-serif;">Habilidades</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem;">
                    ${skills.map(skill => {
            const skillName = typeof skill === 'string' ? skill : (skill.name || skill);
            const skillLevel = typeof skill === 'object' && skill.level ? skill.level : 75;
            return `
                            <div style="background: ${colors.primary}15; padding: 1rem; border-radius: 8px; border-left: 4px solid ${colors.primary};">
                                <div style="font-weight: 600; color: ${colors.text}; margin-bottom: 0.5rem;">${skillName}</div>
                                <div style="background: #e5e7eb; height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: ${colors.primary}; height: 100%; width: ${skillLevel}%; transition: width 0.3s;"></div>
                                </div>
                                <div style="font-size: 0.75rem; color: ${colors.text}; margin-top: 0.25rem; text-align: right;">${skillLevel}%</div>
                            </div>
                        `;
        }).join('')}
                </div>
            </div>
        `;
    }

    if (visibility.projects && content.projects) {
        html += `
            <div class="portfolio-section" style="margin-bottom: 2rem; font-family: '${fonts.body}', sans-serif; font-size: ${fonts.size}px;">
                <h2 style="color: ${colors.primary}; font-size: 1.5rem; margin-bottom: 1rem; border-bottom: 2px solid ${colors.secondary}; padding-bottom: 0.5rem; font-family: '${fonts.heading}', sans-serif;">Proyectos</h2>
                <p style="line-height: 1.6; color: ${colors.text};">${content.projects.replace(/\n/g, '<br>')}</p>
            </div>
        `;
    }

    if (visibility.languages && languages.length > 0) {
        html += `
            <div class="portfolio-section" style="margin-bottom: 2rem; font-family: '${fonts.body}', sans-serif; font-size: ${fonts.size}px;">
                <h2 style="color: ${colors.primary}; font-size: 1.5rem; margin-bottom: 1rem; border-bottom: 2px solid ${colors.secondary}; padding-bottom: 0.5rem; font-family: '${fonts.heading}', sans-serif;">Idiomas</h2>
                <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
                    ${languages.map(lang => `
                        <span style="background: ${colors.primary}; color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9375rem;">${lang}</span>
                    `).join('')}
                </div>
            </div>
        `;
    }

    preview.innerHTML = html;
    preview.style.backgroundColor = colors.bg;
}

function downloadPDF() {
    const preview = document.getElementById('portfolioPreview');
    if (!preview) {
        showToast('Error al generar PDF', 'error');
        return;
    }

    showToast('Generando PDF...', 'info');

    // Force the filename with .pdf extension
    const options = {
        margin: 10,
        filename: 'DevFolio_Portfolio.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
        .set(options)
        .from(preview)
        .save()
        .then(() => {
            showToast('PDF descargado: DevFolio_Portfolio.pdf', 'success');
        })
        .catch(err => {
            console.error('Error PDF:', err);
            showToast('Error al generar PDF', 'error');
        });
}

function publishPortfolio() {
    if (!confirm('¿Publicar tu portfolio en la sección de Comunidades?')) return;

    try {
        const publishData = {
            id: Date.now(),
            userId: portfolioData.user.id || portfolioData.user.email,
            title: `Portfolio de ${portfolioData.user.nombre}`,
            author: portfolioData.user.nombre,
            professionalTitle: portfolioData.experience[0]?.role || 'Profesional',
            email: portfolioData.user.email,
            phone: portfolioData.user.telefono || '',
            photo: portfolioData.user.avatar || '',
            colors: portfolioData.colors,
            fonts: portfolioData.fonts,
            about: portfolioData.content.about,
            objective: portfolioData.content.objective,
            projects: portfolioData.content.projects,
            languages: portfolioData.languages,
            experience: portfolioData.experience,
            education: portfolioData.education,
            skills: portfolioData.skills,
            visibility: portfolioData.visibility,
            publishedDate: new Date().toISOString(),
            views: 0,
            tags: ['Portfolio', 'Profesional']
        };

        const published = JSON.parse(localStorage.getItem('published_portfolios') || '[]');
        const filtered = published.filter(p => p.userId !== publishData.userId);
        filtered.unshift(publishData);
        localStorage.setItem('published_portfolios', JSON.stringify(filtered));

        showToast('Portfolio publicado correctamente', 'success');
        setTimeout(() => {
            window.location.href = 'communities.html?tab=recent';
        }, 1500);
    } catch (err) {
        console.error('Error al publicar:', err);
        showToast('Error al publicar portfolio', 'error');
    }
}
