/* js/group_view.js */

let currentGroup = null;

// Ensure window functions are defined immediately
window.closeDiscussionModal = () => {
    const modal = document.getElementById('discussion-modal');
    if (modal) modal.classList.remove('active');
};

window.openDiscussionModal = () => {
    const modal = document.getElementById('discussion-modal');
    if (modal) {
        document.getElementById('discussion-title').value = '';
        document.getElementById('discussion-content').value = '';
        modal.classList.add('active');
    } else {
        console.error('Discussion modal not found');
        alert('Error: Modal de discusión no encontrado');
    }
};

window.submitDiscussion = () => {
    const title = document.getElementById('discussion-title').value;
    const content = document.getElementById('discussion-content').value;

    if (!title || !title.trim()) {
        showToast('El título es obligatorio', 'error');
        return;
    }

    if (!currentGroup) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const discussions = JSON.parse(localStorage.getItem(`group_${currentGroup.id}_discussions`) || '[]');

    discussions.unshift({
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        author: user.nombre || user.email,
        date: new Date().toISOString(),
        replies: 0
    });

    localStorage.setItem(`group_${currentGroup.id}_discussions`, JSON.stringify(discussions));
    showToast('Discusión creada correctamente', 'success');

    window.closeDiscussionModal();

    // Refresh discussions view
    const discussionsTab = document.getElementById('discussions-tab');
    if (discussionsTab) {
        discussionsTab.innerHTML = renderDiscussions(currentGroup.id);
    }
};

window.joinGroupFromPage = (groupId) => {
    const joinedGroups = JSON.parse(localStorage.getItem('joined_groups') || '[]');

    if (!joinedGroups.includes(groupId)) {
        joinedGroups.push(groupId);
        localStorage.setItem('joined_groups', JSON.stringify(joinedGroups));
        showToast('Te has unido al grupo correctamente', 'success');

        // Reload page to update UI
        setTimeout(() => location.reload(), 500);
    }
};

window.leaveGroupFromPage = (groupId, groupName) => {
    // Removed confirm dialog to avoid blocking issues
    const joinedGroups = JSON.parse(localStorage.getItem('joined_groups') || '[]');
    const index = joinedGroups.indexOf(groupId);

    if (index > -1) {
        joinedGroups.splice(index, 1);
        localStorage.setItem('joined_groups', JSON.stringify(joinedGroups));
        showToast(`Has salido de ${groupName}`, 'info');

        // Redirect back to communities
        setTimeout(() => window.location.href = 'communities.html?tab=groups', 500);
    } else {
        console.error('Group not found in joined groups', groupId, joinedGroups);
        // Force reload anyway
        location.reload();
    }
};

window.openAnnouncePortfolioModal = () => {
    const portfolios = JSON.parse(localStorage.getItem('published_portfolios') || '[]');
    const user = JSON.parse(localStorage.getItem('user'));

    const userPortfolio = portfolios.find(p => p.userId === (user.id || user.email));

    if (!userPortfolio) {
        showToast('No tienes un portfolio publicado para anunciar.', 'error');
        return;
    }

    const message = prompt('Escribe un mensaje para acompañar tu portfolio (opcional):');
    if (message !== null) {
        announcePortfolio(currentGroup.id, userPortfolio, message);
    }
};

window.viewAnnouncedPortfolio = (portfolioId) => {
    window.location.href = `communities.html?tab=recent&portfolio=${portfolioId}`;
};

window.contactPortfolioOwner = (authorName) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');

    const messageText = prompt(`Escribe un mensaje para ${authorName}:`);

    if (messageText && messageText.trim()) {
        messages.push({
            id: Date.now(),
            from: user.nombre || user.email,
            to: authorName,
            text: messageText,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
            type: 'group_contact'
        });

        localStorage.setItem('messages', JSON.stringify(messages));
        showToast(`Mensaje enviado a ${authorName}`, 'success');
    }
};

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const groupId = urlParams.get('id');

    if (!groupId) {
        window.location.href = 'communities.html';
        return;
    }

    loadGroupDetails(groupId);
});

function loadGroupDetails(id) {
    // Load from custom groups first
    const customGroups = JSON.parse(localStorage.getItem('custom_groups') || '[]');
    let group = customGroups.find(g => g.id == id);

    // If not found in custom, check default groups
    if (!group) {
        const defaultGroups = [
            { id: 1, name: 'React Developers', members: 120, desc: 'Comunidad para compartir conocimientos sobre React.' },
            { id: 2, name: 'Freelancers España', members: 85, desc: 'Grupo de apoyo para freelancers en España.' },
            { id: 3, name: 'Diseño UX/UI', members: 240, desc: 'Comparte tus diseños y recibe feedback.' }
        ];
        group = defaultGroups.find(g => g.id == id);
    }

    if (!group) {
        document.getElementById('group-content').innerHTML = '<div style="text-align: center; padding: 2rem;">Comunidad no encontrada</div>';
        return;
    }

    currentGroup = group;
    renderGroupPage(group);
}

function renderGroupPage(group) {
    const joinedGroups = JSON.parse(localStorage.getItem('joined_groups') || '[]');
    const isJoined = joinedGroups.includes(group.id);

    const container = document.getElementById('group-content');
    container.innerHTML = `
        <div class="group-header">
            <div class="group-info">
                <h1>${group.name}</h1>
                <div class="group-meta">${group.desc} • ${group.members} miembros</div>
            </div>
            <div style="display: flex; gap: 1rem;">
                ${isJoined ? `
                    <button class="btn btn-outline" onclick="leaveGroupFromPage(${group.id}, '${group.name}')">Salir del grupo</button>
                    <button class="btn btn-primary" onclick="openAnnouncePortfolioModal()">Anunciar Portfolio</button>
                ` : `
                    <button class="btn btn-primary" onclick="joinGroupFromPage(${group.id})">Unirse al Grupo</button>
                `}
            </div>
        </div>
        
        <div class="group-tabs">
            <button class="group-tab-btn active" data-tab="discussions">Discusiones</button>
            <button class="group-tab-btn" data-tab="portfolios">Portfolios Anunciados</button>
            <button class="group-tab-btn" data-tab="members">Miembros</button>
        </div>

        <div id="discussions-tab" class="group-tab-content active">
            ${renderDiscussions(group.id)}
        </div>

        <div id="portfolios-tab" class="group-tab-content">
            ${renderPortfolioAnnouncements(group.id)}
        </div>

        <div id="members-tab" class="group-tab-content">
            ${renderMembers(group.id, group.members)}
        </div>
    `;

    setupTabNavigation();
}

function setupTabNavigation() {
    const tabs = document.querySelectorAll('.group-tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.group-tab-btn').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.group-tab-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(`${tab.dataset.tab}-tab`).classList.add('active');
        });
    });
}

function renderDiscussions(groupId) {
    const discussions = JSON.parse(localStorage.getItem(`group_${groupId}_discussions`) || '[]');
    const user = JSON.parse(localStorage.getItem('user'));
    const currentUserName = user ? (user.nombre || user.email) : '';

    if (discussions.length === 0) {
        return `
            <div class="empty-state">
                <p>No hay discusiones aún.</p>
                <button class="btn btn-primary" onclick="openDiscussionModal()">Crear Primera Discusión</button>
            </div>
        `;
    }

    return `
        <div style="margin-bottom: 1.5rem;">
            <button class="btn btn-primary" onclick="openDiscussionModal()">Nueva Discusión</button>
        </div>
        <ul class="topic-list">
            ${discussions.map(d => `
                <li class="topic-item" style="cursor: pointer; position: relative;" onclick="viewDiscussionMessages(${groupId}, ${d.id})">
                    <div class="topic-icon">💬</div>
                    <div class="topic-content">
                        <div class="topic-title">${d.title}</div>
                        <div class="topic-meta">Publicado por ${d.author} • ${formatDate(d.date)} • ${(d.messages || []).length} mensajes</div>
                        ${d.content ? `<div style="font-size: 0.9rem; color: #666; margin-top: 0.25rem;">${d.content}</div>` : ''}
                    </div>
                    ${d.author === currentUserName ? `
                        <button class="btn-delete-discussion" onclick="event.stopPropagation(); deleteDiscussion(${groupId}, ${d.id})" style="position: absolute; right: 1rem; top: 1rem; background: #dc2626; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">
                            Eliminar
                        </button>
                    ` : ''}
                </li>
            `).join('')}
        </ul>
    `;
}

function renderPortfolioAnnouncements(groupId) {
    const announcements = JSON.parse(localStorage.getItem(`group_${groupId}_announcements`) || '[]');
    const joinedGroups = JSON.parse(localStorage.getItem('joined_groups') || '[]');
    const isJoined = joinedGroups.includes(groupId);

    if (announcements.length === 0) {
        return `
            <div class="empty-state">
                <p>No hay portfolios anunciados aún.</p>
                ${isJoined ? '<button class="btn btn-primary" onclick="openAnnouncePortfolioModal()">Anunciar tu Portfolio</button>' : '<p style="color: #999; font-size: 0.9rem;">Únete al grupo para anunciar tu portfolio</p>'}
            </div>
        `;
    }

    return `
        ${isJoined ? '<div style="margin-bottom: 1.5rem;"><button class="btn btn-primary" onclick="openAnnouncePortfolioModal()">Anunciar Portfolio</button></div>' : ''}
        ${announcements.map(a => `
            <div class="portfolio-announcement-card">
                <div class="announcement-header">
                    <div class="announcement-author">
                        <div class="announcement-author-avatar">${getInitials(a.author)}</div>
                        <div class="announcement-author-info">
                            <div class="announcement-author-name">${a.author}</div>
                            <div class="announcement-date">${formatDate(a.date)}</div>
                        </div>
                    </div>
                </div>
                <div class="announcement-portfolio-title">${a.portfolioTitle}</div>
                <div class="announcement-portfolio-desc">${a.description || 'Portfolio compartido en el grupo'}</div>
                <div class="announcement-actions">
                    <button class="btn btn-outline btn-sm" onclick="viewAnnouncedPortfolio(${a.portfolioId})">Ver Portfolio</button>
                    <button class="btn btn-outline btn-sm" onclick="contactPortfolioOwner('${a.author}')">Contactar</button>
                </div>
            </div>
        `).join('')}
    `;
}

function renderMembers(groupId, baseMemberCount) {
    const joinedGroups = JSON.parse(localStorage.getItem('joined_groups') || '[]');
    const isJoined = joinedGroups.includes(groupId);
    const user = JSON.parse(localStorage.getItem('user'));

    const members = [];

    // Only add current user if they've joined
    if (isJoined && user) {
        members.push({
            name: user.nombre || user.email,
            role: 'Miembro (Tú)',
            color: '#e0e7ff',
            textColor: '#4f46e5'
        });
    }

    if (members.length === 0) {
        return `
            <div class="empty-state">
                <p>Únete al grupo para ver miembros</p>
            </div>
        `;
    }

    return `
        <div class="member-grid">
            ${members.map(m => `
                <div class="member-card">
                    <div class="member-avatar" style="background: ${m.color}; color: ${m.textColor};">
                        ${getInitials(m.name)}
                    </div>
                    <div class="member-info">
                        <div class="member-name">${m.name}</div>
                        <div class="member-role">${m.role}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        <p style="text-align: center; color: #999; margin-top: 2rem; font-size: 0.9rem;">
            ${baseMemberCount} miembros en total
        </p>
    `;
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

function announcePortfolio(groupId, portfolio, message = '') {
    const announcements = JSON.parse(localStorage.getItem(`group_${groupId}_announcements`) || '[]');

    const announcement = {
        id: Date.now(),
        portfolioId: portfolio.id,
        portfolioTitle: portfolio.title,
        author: portfolio.author,
        description: message || `${portfolio.author} ha compartido su portfolio`,
        date: new Date().toISOString()
    };

    announcements.unshift(announcement);
    localStorage.setItem(`group_${groupId}_announcements`, JSON.stringify(announcements));

    showToast('Portfolio anunciado correctamente en el grupo', 'success');

    // Reload to show the announcement
    setTimeout(() => {
        loadGroupDetails(groupId);
        // Switch to portfolios tab
        const portfoliosTab = document.querySelector('[data-tab="portfolios"]');
        if (portfoliosTab) portfoliosTab.click();
    }, 500);
}

// Delete discussion function
window.deleteDiscussion = (groupId, discussionId) => {
    const modal = document.getElementById('delete-discussion-modal');
    if (!modal) {
        // Fallback if modal doesn't exist
        const discussions = JSON.parse(localStorage.getItem(`group_${groupId}_discussions`) || '[]');
        const filtered = discussions.filter(d => d.id !== discussionId);
        localStorage.setItem(`group_${groupId}_discussions`, JSON.stringify(filtered));
        showToast('Discusión eliminada', 'success');
        const discussionsTab = document.getElementById('discussions-tab');
        if (discussionsTab && currentGroup) {
            discussionsTab.innerHTML = renderDiscussions(currentGroup.id);
        }
        return;
    }

    // Show delete confirmation modal
    modal.classList.add('show');

    const closeBtn = modal.querySelector('.close');
    const cancelBtn = document.getElementById('cancelDeleteDiscussion');
    const confirmBtn = document.getElementById('confirmDeleteDiscussion');

    const closeModal = () => modal.classList.remove('show');

    closeBtn.onclick = closeModal;
    cancelBtn.onclick = closeModal;

    confirmBtn.onclick = () => {
        const discussions = JSON.parse(localStorage.getItem(`group_${groupId}_discussions`) || '[]');
        const filtered = discussions.filter(d => d.id !== discussionId);
        localStorage.setItem(`group_${groupId}_discussions`, JSON.stringify(filtered));

        modal.classList.remove('show');
        showToast('Discusión eliminada correctamente', 'success');

        const discussionsTab = document.getElementById('discussions-tab');
        if (discussionsTab && currentGroup) {
            discussionsTab.innerHTML = renderDiscussions(currentGroup.id);
        }
    };
};

// View discussion messages
window.viewDiscussionMessages = (groupId, discussionId) => {
    const discussions = JSON.parse(localStorage.getItem(`group_${groupId}_discussions`) || '[]');
    const discussion = discussions.find(d => d.id === discussionId);

    if (!discussion) return;

    const modal = document.getElementById('discussion-messages-modal');
    const content = document.getElementById('discussion-messages-content');

    if (!modal || !content) return;

    // Build messages HTML
    const messages = discussion.messages || [];

    content.innerHTML = `
        <h3 style="margin-top: 0;">${discussion.title}</h3>
        <p style="color: #666; font-size: 0.9rem; margin-bottom: 1.5rem;">
            Por ${discussion.author} • ${formatDate(discussion.date)}
        </p>
        ${discussion.content ? `<p style="padding: 1rem; background: #f9f9f9; border-radius: 4px; margin-bottom: 1.5rem;">${discussion.content}</p>` : ''}
        
        <h4 style="margin-bottom: 1rem; color: #333;">Mensajes (${messages.length})</h4>
        
        ${messages.length > 0 ? `
            <div class="messages-list" style="max-height: 400px; overflow-y: auto; margin-bottom: 1.5rem;">
                ${messages.map(m => `
                    <div class="message-item" style="padding: 1rem; border-left: 3px solid #2563eb; background: #f8f9fa; margin-bottom: 0.75rem; border-radius: 4px;">
                        <div style="font-weight: 600; color: #2563eb; margin-bottom: 0.25rem;">${m.author}</div>
                        <div style="font-size: 0.85rem; color: #999; margin-bottom: 0.5rem;">${formatDate(m.date)}</div>
                        <div style="color: #333;">${m.content}</div>
                    </div>
                `).join('')}
            </div>
        ` : '<p style="color: #999; text-align: center; padding: 2rem;">No hay mensajes aún. Sé el primero en comentar.</p>'}
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 1rem;">
            <textarea id="new-message-content" rows="3" placeholder="Escribe tu mensaje..." style="width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 4px; resize: vertical; font-family: inherit;"></textarea>
            <div style="display: flex; gap: 1rem; margin-top: 1rem; justify-content: flex-end;">
                <button class="btn btn-secondary" onclick="closeDiscussionMessagesModal()">Cerrar</button>
                <button class="btn btn-primary" onclick="addDiscussionMessage(${groupId}, ${discussionId})">Enviar Mensaje</button>
            </div>
        </div>
    `;

    modal.classList.add('show');
};

window.closeDiscussionMessagesModal = () => {
    const modal = document.getElementById('discussion-messages-modal');
    if (modal) modal.classList.remove('show');
};

window.addDiscussionMessage = (groupId, discussionId) => {
    const content = document.getElementById('new-message-content').value;

    if (!content || !content.trim()) {
        showToast('Por favor escribe un mensaje', 'error');
        return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    const discussions = JSON.parse(localStorage.getItem(`group_${groupId}_discussions`) || '[]');
    const discussion = discussions.find(d => d.id === discussionId);

    if (!discussion) return;

    if (!discussion.messages) discussion.messages = [];

    discussion.messages.push({
        id: Date.now(),
        author: user.nombre || user.email,
        content: content.trim(),
        date: new Date().toISOString()
    });

    localStorage.setItem(`group_${groupId}_discussions`, JSON.stringify(discussions));
    showToast('Mensaje enviado', 'success');

    // Refresh the modal
    viewDiscussionMessages(groupId, discussionId);
};

function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}
