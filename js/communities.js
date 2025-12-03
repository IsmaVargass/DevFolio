/* js/communities.js */

// Adzuna API credentials
const ADZUNA_APP_ID = '3fc224ea';
const ADZUNA_APP_KEY = '4c352b45d620647c60abf49c26aa0381';
const ADZUNA_API_BASE = 'https://api.adzuna.com/v1/api/jobs/es/search';

// Global variable for message recipient
let messageRecipient = null;
let currentPortfolioId = null;

// Use window.onload to ensure all resources are loaded
window.onload = () => {
    console.log('Communities page loaded');
    try { loadRecentPortfolios(); } catch (e) { console.error('Error loading recent:', e); }
    try { loadFeaturedPortfolios(); } catch (e) { console.error('Error loading featured:', e); }
    try { loadJobs(); } catch (e) { console.error('Error loading jobs:', e); }
    try { loadGroups(); } catch (e) { console.error('Error loading groups:', e); }

    // Setup tabs with logging
    try {
        setupTabs();
        console.log('Tabs setup complete');
    } catch (e) {
        console.error('Error setting up tabs:', e);
    }

    try { setupButtons(); } catch (e) { console.error('Error setting up buttons:', e); }
    try { checkNotifications(); } catch (e) { console.error('Error checking notifications:', e); }
    try { setupJobFilters(); } catch (e) { console.error('Error setting up filters:', e); }
};

// Global function for direct onclick access
window.switchTab = (tabName) => {
    console.log('Switching to tab:', tabName);
    document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.content-view').forEach(v => v.classList.remove('active'));

    const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabName}"]`);
    if (tabBtn) tabBtn.classList.add('active');

    const view = document.getElementById(`${tabName}-view`);
    if (view) view.classList.add('active');
};

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            window.switchTab(tabName);
        });
    });

    // Check URL params for tab
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
        window.switchTab(tabParam);
    }
}

function setupButtons() {
    const createBtn = document.getElementById('create-community-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            showToast('Función de crear comunidad próximamente', 'info');
        });
    }
}

function loadRecentPortfolios() {
    const grid = document.getElementById('recent-portfolios-grid');
    if (!grid) return;

    const portfolios = JSON.parse(localStorage.getItem('published_portfolios') || '[]');

    if (portfolios.length > 0) {
        portfolios.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));
        grid.innerHTML = renderPortfolioCards(portfolios);
    } else {
        grid.innerHTML = '<p class="text-muted">Aún no hay portfolios recientes. ¡Sé el primero en publicar!</p>';
    }
}

function loadFeaturedPortfolios() {
    const grid = document.getElementById('featured-portfolios-grid');
    if (!grid) return;

    const portfolios = JSON.parse(localStorage.getItem('published_portfolios') || '[]');

    if (portfolios.length > 0) {
        const featured = portfolios
            .filter(p => p.views > 0)
            .sort((a, b) => b.views - a.views)
            .slice(0, 10);

        if (featured.length > 0) {
            grid.innerHTML = renderPortfolioCards(featured, true);
        } else {
            grid.innerHTML = '<p class="text-muted">Aún no hay portfolios destacados. Los portfolios con más vistas aparecerán aquí.</p>';
        }
    } else {
        grid.innerHTML = '<p class="text-muted">Aún no hay portfolios publicados.</p>';
    }
}

function renderPortfolioCards(portfolios, showViews = false) {
    return portfolios.map(p => `
        <div class="portfolio-card" onclick="viewPortfolio(${p.id})">
            <div class="portfolio-preview" style="background-image: url('${p.photo || ''}'); background-size: cover; background-position: center; background-color: #f5f5f5;">
                ${!p.photo ? '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">Vista Previa</div>' : ''}
            </div>
            <div class="portfolio-info">
                <div class="portfolio-title">${p.title}</div>
                <div class="portfolio-author">por ${p.author}</div>
                ${showViews ? `<div class="portfolio-views" style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">👁️ ${p.views} vistas</div>` : ''}
                <div class="portfolio-tags">
                    ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

window.viewPortfolio = (portfolioId) => {
    const portfolios = JSON.parse(localStorage.getItem('published_portfolios') || '[]');
    const portfolio = portfolios.find(p => p.id === portfolioId);

    if (portfolio) {
        // Increment views
        portfolio.views = (portfolio.views || 0) + 1;
        localStorage.setItem('published_portfolios', JSON.stringify(portfolios));

        // Store for messaging
        messageRecipient = portfolio.author;
        currentPortfolioId = portfolioId;

        // Show modal with complete portfolio
        showPortfolioModal(portfolio);

        // Reload featured to update view counts
        loadFeaturedPortfolios();
    }
};

function showPortfolioModal(portfolio) {
    const modal = document.getElementById('portfolio-modal');
    const content = document.getElementById('portfolio-modal-content');

    const color = portfolio.color || '#2563eb';

    content.innerHTML = `
        <div class="portfolio-modal-header" style="border-color: ${color}">
            <h1 class="portfolio-modal-name">${portfolio.author}</h1>
            <h2 class="portfolio-modal-title" style="color: ${color}">${portfolio.professionalTitle || portfolio.title}</h2>
            <p style="margin-top: 0.5rem; color: #666;">${portfolio.email || ''}</p>
            <p style="font-size: 0.85rem; color: #999; margin-top: 1rem;">Vistas: ${portfolio.views} | Publicado: ${formatDate(portfolio.publishedDate)}</p>
        </div>

        ${portfolio.about ? `
        <div class="portfolio-modal-section">
            <h3>Sobre Mí</h3>
            <p style="line-height: 1.6; color: #4b5563;">${portfolio.about.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}

        ${portfolio.showExperience && portfolio.experience && portfolio.experience.length > 0 ? `
        <div class="portfolio-modal-section">
            <h3>Experiencia Laboral</h3>
            ${portfolio.experience.map(exp => `
                <div class="portfolio-modal-item">
                    <div class="portfolio-modal-item-title">${exp.title}</div>
                    <div class="portfolio-modal-item-subtitle">${exp.company} • ${exp.startDate} - ${exp.endDate}</div>
                    <p style="margin-top: 0.25rem; font-size: 0.9rem; color: #4b5563;">${exp.description || ''}</p>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${portfolio.showEducation && portfolio.education && portfolio.education.length > 0 ? `
        <div class="portfolio-modal-section">
            <h3>Formación Académica</h3>
            ${portfolio.education.map(edu => `
                <div class="portfolio-modal-item">
                    <div class="portfolio-modal-item-title">${edu.degree}</div>
                    <div class="portfolio-modal-item-subtitle">${edu.school} • ${edu.year}</div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${portfolio.projects ? `
        <div class="portfolio-modal-section">
            <h3>Proyectos Destacados</h3>
            <p style="line-height: 1.6; color: #4b5563;">${portfolio.projects.replace(/\n/g, '<br>')}</p>
        </div>
        ` : ''}

        <div class="portfolio-modal-actions">
            <button class="btn btn-secondary" onclick="closePortfolioModal()">Cerrar</button>
            <button class="btn btn-primary" onclick="openMessageModal('${portfolio.author}')">Enviar Mensaje</button>
        </div>
    `;

    modal.classList.add('active');
}

window.closePortfolioModal = () => {
    const modal = document.getElementById('portfolio-modal');
    modal.classList.remove('active');
};

window.openMessageModal = (recipient) => {
    messageRecipient = recipient;
    const modal = document.getElementById('message-modal');
    document.getElementById('message-recipient').textContent = recipient;
    document.getElementById('message-text').value = '';
    modal.classList.add('active');

    // Close portfolio modal if open
    closePortfolioModal();
};

window.closeMessageModal = () => {
    const modal = document.getElementById('message-modal');
    modal.classList.remove('active');
};

window.sendMessageToOwner = () => {
    const messageText = document.getElementById('message-text').value.trim();

    if (!messageText) {
        showToast('Por favor escribe un mensaje', 'error');
        return;
    }

    if (!messageRecipient) {
        showToast('No se pudo identificar al destinatario', 'error');
        return;
    }

    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const user = JSON.parse(localStorage.getItem('user'));

    messages.push({
        id: Date.now(),
        from: user.nombre || user.email,
        to: messageRecipient,
        text: messageText,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
        type: 'portfolio_inquiry'
    });

    localStorage.setItem('messages', JSON.stringify(messages));

    showToast(`Mensaje enviado a ${messageRecipient}`, 'success');
    closeMessageModal();
};

// Adzuna Jobs Integration
async function loadJobs(keyword = '', location = '') {
    const list = document.getElementById('jobs-list');
    if (!list) return;

    list.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div><p>Cargando ofertas de trabajo...</p></div>';

    try {
        const jobs = await fetchAdzunaJobs(keyword, location);

        if (jobs.length > 0) {
            list.innerHTML = jobs.map(j => `
                <div class="job-card external" onclick="window.open('${j.redirect_url}', '_blank')">
                    <div class="job-header">
                        <div class="job-title">${j.title}</div>
                        <div class="job-type">${j.contract_time || 'N/A'}</div>
                    </div>
                    <div class="job-company">${j.company.display_name} - ${j.location.display_name}</div>
                    <div class="job-desc">${j.description.replace(/<[^>]*>/g, '').substring(0, 200)}...</div>
                    <div class="job-footer">
                        <span>Publicado: ${formatJobDate(j.created)}</span>
                        <span class="job-source">Fuente: Adzuna</span>
                        <div class="job-actions">
                            ${j.salary_min && j.salary_max ? `<span style="color: #10b981; font-weight: 600;">€${Math.round(j.salary_min)} - €${Math.round(j.salary_max)}</span>` : ''}
                        </div>
                    </div>
                </div>
            `).join('');
        } else {
            list.innerHTML = '<p class="text-muted">No se encontraron ofertas de trabajo. Intenta con otros filtros.</p>';
        }
    } catch (error) {
        console.error('Error loading jobs:', error);
        list.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <p style="color: #ef4444; margin-bottom: 1rem;">❌ Error al cargar ofertas de trabajo</p>
                <p style="color: #666; font-size: 0.9rem;">${error.message}</p>
                <p style="color: #999; font-size: 0.85rem; margin-top: 1rem;">Verifica tu conexión a internet o intenta de nuevo más tarde.</p>
            </div>
        `;
    }
}

async function fetchAdzunaJobs(keyword = '', location = '') {
    const page = 1;
    const resultsPerPage = 20;

    // Category filter for IT/Programming jobs only
    // Adzuna category: it-jobs
    const category = 'it-jobs';

    let url = `${ADZUNA_API_BASE}/${page}?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=${resultsPerPage}&content-type=application/json&category=${category}`;

    if (keyword) {
        url += `&what=${encodeURIComponent(keyword)}`;
    }

    if (location) {
        url += `&where=${encodeURIComponent(location)}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
}

function setupJobFilters() {
    const searchBtn = document.getElementById('search-jobs-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            const keyword = document.getElementById('job-keyword').value;
            const location = document.getElementById('job-location').value;
            loadJobs(keyword, location);
        });
    }

    // Allow Enter key in keyword field
    const keywordInput = document.getElementById('job-keyword');
    if (keywordInput) {
        keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const keyword = document.getElementById('job-keyword').value;
                const location = document.getElementById('job-location').value;
                loadJobs(keyword, location);
            }
        });
    }
}

function formatJobDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return formatDate(dateString);
}

function loadGroups() {
    const grid = document.getElementById('groups-grid');
    if (!grid) return;

    const groups = [
        { id: 1, name: 'React Developers', members: 120, desc: 'Comunidad para compartir conocimientos sobre React.' },
        { id: 2, name: 'Freelancers España', members: 85, desc: 'Grupo de apoyo para freelancers en España.' },
        { id: 3, name: 'Diseño UX/UI', members: 240, desc: 'Comparte tus diseños y recibe feedback.' }
    ];

    const joinedGroups = JSON.parse(localStorage.getItem('joined_groups') || '[]');

    grid.innerHTML = groups.map(g => {
        const isJoined = joinedGroups.includes(g.id);
        return `
        <div class="group-card" onclick="window.location.href='group_view.html?id=${g.id}'" style="cursor: pointer;">
            <div class="group-icon">${getGroupIcon(g.name)}</div>
            <div class="group-name">${g.name}</div>
            <div class="group-desc">${g.desc}</div>
            <div class="group-stats">
                <span id="members-${g.id}">${g.members + (isJoined ? 1 : 0)} miembros</span>
            </div>
            <button 
                class="btn ${isJoined ? 'btn-outline' : 'btn-primary'} btn-full-width"
                onclick="event.stopPropagation(); toggleGroupJoin(${g.id}, '${g.name}', ${g.members})"
            >
                ${isJoined ? 'Salir del Grupo' : 'Unirse'}
            </button>
            ${isJoined ? '<div style="margin-top: 1rem; font-size: 0.85rem; color: var(--success-color);">✓ Eres miembro</div>' : ''}
        </div>
    `}).join('');
}

function getGroupIcon(name) {
    // Removed emojis, using SVG-like initials with colors
    const colors = ['#e0e7ff', '#fce7f3', '#dbeafe', '#d1fae5', '#fee2e2'];
    const textColors = ['#4f46e5', '#ec4899', '#3b82f6', '#10b981', '#ef4444'];
    const index = name.length % colors.length;

    return `<div style="width: 40px; height: 40px; background: ${colors[index]}; color: ${textColors[index]}; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1rem;">${name.substring(0, 2).toUpperCase()}</div>`;
}

window.toggleGroupJoin = (groupId, groupName, baseMembers) => {
    const joinedGroups = JSON.parse(localStorage.getItem('joined_groups') || '[]');
    const index = joinedGroups.indexOf(groupId);

    if (index === -1) {
        joinedGroups.push(groupId);
        showToast(`Te has unido a ${groupName}`, 'success');
    } else {
        joinedGroups.splice(index, 1);
        showToast(`Has salido de ${groupName}`, 'info');
    }

    localStorage.setItem('joined_groups', JSON.stringify(joinedGroups));
    loadGroups();
};

function checkNotifications() {
    // Simple mock notification check
    const lastVisit = localStorage.getItem('last_visit_communities');
    const now = new Date().toISOString();

    if (lastVisit) {
        const portfolios = JSON.parse(localStorage.getItem('published_portfolios') || '[]');
        const newPortfolios = portfolios.filter(p => p.publishedDate > lastVisit);

        if (newPortfolios.length > 0) {
            showToast(`Hay ${newPortfolios.length} nuevos portfolios publicados`, 'info');
        }
    }

    localStorage.setItem('last_visit_communities', now);
}
