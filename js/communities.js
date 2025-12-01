/* js/communities.js */
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolios();
    loadJobs();
    loadGroups();
    setupTabs();
});

function loadPortfolios() {
    const grid = document.getElementById('portfolios-grid');
    // Mock data
    const portfolios = [
        { id: 1, title: 'Full Stack Developer Portfolio', author: 'Ana García', tags: ['React', 'Node.js'] },
        { id: 2, title: 'UX/UI Design Showcase', author: 'Carlos Ruiz', tags: ['Figma', 'UI Design'] },
        { id: 3, title: 'Mobile App Projects', author: 'Elena Web', tags: ['Flutter', 'Dart'] }
    ];

    grid.innerHTML = portfolios.map(p => `
        <div class="portfolio-card">
            <div class="portfolio-preview">Vista Previa</div>
            <div class="portfolio-info">
                <div class="portfolio-title">${p.title}</div>
                <div class="portfolio-author">por ${p.author}</div>
                <div class="portfolio-tags">
                    ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function loadJobs() {
    const list = document.getElementById('jobs-list');
    // Mock data
    const jobs = [
        { id: 1, title: 'Senior Frontend Developer', company: 'TechCorp', type: 'Full-time', desc: 'Buscamos un desarrollador con experiencia en React y TypeScript...' },
        { id: 2, title: 'UI Designer', company: 'CreativeStudio', type: 'Freelance', desc: 'Diseño de interfaces para aplicaciones móviles...' }
    ];

    list.innerHTML = jobs.map(j => `
        <div class="job-card">
            <div class="job-header">
                <div class="job-title">${j.title}</div>
                <div class="job-type">${j.type}</div>
            </div>
            <div class="job-company">${j.company}</div>
            <div class="job-desc">${j.desc}</div>
            <div class="job-footer">
                <span>Hace 2 días</span>
                <button class="btn btn-primary btn-sm">Aplicar</button>
            </div>
        </div>
    `).join('');
}

function loadGroups() {
    const grid = document.getElementById('groups-grid');
    // Mock data
    const groups = [
        { id: 1, name: 'React Developers', members: 120, desc: 'Comunidad para compartir conocimientos sobre React.' },
        { id: 2, name: 'Freelancers España', members: 85, desc: 'Grupo de apoyo para freelancers en España.' }
    ];

    grid.innerHTML = groups.map(g => `
        <div class="group-card">
            <div class="group-icon">👥</div>
            <div class="group-name">${g.name}</div>
            <div class="group-desc">${g.desc}</div>
            <div class="group-stats">
                <span>${g.members} miembros</span>
            </div>
            <button class="btn btn-outline btn-full-width">Unirse</button>
        </div>
    `).join('');
}

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
}
