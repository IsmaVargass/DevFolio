/* js/communities.js */
document.addEventListener('DOMContentLoaded', () => {
    loadRecentPortfolios();
    loadFeaturedPortfolios();
    loadJobs();
    loadGroups();
    setupTabs();
    setupButtons();
    checkNotifications();
});

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
                ${showViews ? `<div class="portfolio-views" style="font-size: 0.85rem; color: #666; margin-top: 0.5rem;">${p.views} vistas</div>` : ''}
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
        portfolio.views = (portfolio.views || 0) + 1;
        localStorage.setItem('published_portfolios', JSON.stringify(portfolios));
        loadFeaturedPortfolios();
        showToast(`Viendo portfolio de ${portfolio.author} (${portfolio.views} vistas)`, 'info');
    }
};

function loadJobs() {
    const list = document.getElementById('jobs-list');
    if (!list) return;

    const localJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const mockJobs = [
        { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp', type: 'Full-time', desc: 'Buscamos un desarrollador con experiencia en React y TypeScript...', postedDate: '2025-11-29', location: 'Madrid', authorId: 'system' },
        { id: 2, title: 'UI Designer', company: 'CreativeStudio', type: 'Freelance', desc: 'Diseño de interfaces para aplicaciones móviles...', postedDate: '2025-11-30', location: 'Remoto', authorId: 'system' }
    ];

    // Merge local jobs and mock jobs, avoiding duplicates if mock jobs were saved previously (though here we just concat)
    // In a real app, we wouldn't mix like this.
    const jobs = [...localJobs, ...mockJobs];
    // Deduplicate by ID just in case
    const uniqueJobs = Array.from(new Map(jobs.map(item => [item.id, item])).values());

    // Sort by date
    uniqueJobs.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

    const appliedJobs = JSON.parse(localStorage.getItem('applied_jobs') || '[]');
    const user = JSON.parse(localStorage.getItem('user'));

    list.innerHTML = uniqueJobs.map(j => {
        const isApplied = appliedJobs.includes(j.id);
        const isAuthor = user && (j.authorId === user.id || j.authorId === user.email); // Handle both ID formats

        return `
        <div class="job-card">
            <div class="job-header">
                <div class="job-title">${j.title}</div>
                <div class="job-type">${j.type}</div>
            </div>
            <div class="job-company">${j.company} - ${j.location || 'Remoto'}</div>
            <div class="job-desc">${j.desc}</div>
            <div class="job-footer">
                <span>Publicado: ${formatDate(j.postedDate)}</span>
                <div class="job-actions">
                    ${isAuthor ? `
                        <button class="btn btn-danger btn-sm" onclick="deleteJob(${j.id})">Eliminar</button>
                    ` : `
                        <button 
                            class="btn ${isApplied ? 'btn-success' : 'btn-primary'} btn-sm" 
                            onclick="applyToJob(${j.id}, '${j.title}', '${j.company}')"
                            ${isApplied ? 'disabled' : ''}
                        >
                            ${isApplied ? 'Ya Aplicado' : 'Aplicar'}
                        </button>
                    `}
                </div>
            </div>
        </div>
    `}).join('');
}

window.deleteJob = (jobId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta oferta?')) return;

    let jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    jobs = jobs.filter(j => j.id !== jobId);
    localStorage.setItem('jobs', JSON.stringify(jobs));

    loadJobs();
    showToast('Oferta eliminada correctamente', 'success');
};

window.applyToJob = (jobId, jobTitle, company) => {
    if (!confirm(`¿Quieres aplicar a la oferta de ${jobTitle} en ${company}?`)) return;

    const appliedJobs = JSON.parse(localStorage.getItem('applied_jobs') || '[]');
    appliedJobs.push(jobId);
    localStorage.setItem('applied_jobs', JSON.stringify(appliedJobs));

    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const user = JSON.parse(localStorage.getItem('user'));

    messages.push({
        id: Date.now(),
        from: user.nombre,
        to: company,
        text: `Hola, he aplicado a tu oferta de ${jobTitle}. Aquí tienes mi portfolio.`,
        time: new Date().toLocaleTimeString(),
        type: 'application'
    });
    localStorage.setItem('messages', JSON.stringify(messages));

    showToast('Has aplicado correctamente. Se ha enviado tu portfolio al reclutador.', 'success');
    loadJobs();
};

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
    // Replaced emojis with simple text or could use SVGs. Using text for now as requested "remove emojis" usually implies replacing with icons, but text is safer if no icons available.
    // Actually, let's use simple generic icons if possible, or just the first letter.
    // But the user specifically asked to remove emojis.
    // I will use a simple div with a color and initial.
    return `<div style="width: 40px; height: 40px; background: #e0e7ff; color: #4f46e5; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${name.substring(0, 2).toUpperCase()}</div>`;
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

function setupTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.content-view').forEach(v => v.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-view`).classList.add('active');
        });
    });

    // Check URL params for tab
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam) {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabParam}"]`);
        if (tabBtn) tabBtn.click();
    }
}

function setupButtons() {
    const createBtn = document.getElementById('create-community-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            window.location.href = 'create_community.html';
        });
    }

    const postJobBtn = document.getElementById('post-job-btn');
    if (postJobBtn) {
        postJobBtn.addEventListener('click', () => {
            window.location.href = 'create_job.html';
        });
    }
}

function checkNotifications() {
    // Simple mock notification check
    const lastVisit = localStorage.getItem('last_visit_communities');
    const now = new Date().toISOString();

    if (lastVisit) {
        // Check if there are new jobs since last visit
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const newJobs = jobs.filter(j => j.postedDate > lastVisit);

        if (newJobs.length > 0) {
            showToast(`Hay ${newJobs.length} nuevas ofertas de trabajo`, 'info');
            // Add badge to jobs tab
            const jobsTab = document.querySelector('.tab-btn[data-tab="jobs"]');
            if (jobsTab) {
                jobsTab.innerHTML += ` <span class="badge-new" style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 10px; font-size: 0.7rem;">${newJobs.length}</span>`;
            }
        }
    }

    localStorage.setItem('last_visit_communities', now);
}
