/* js/messages.js */
document.addEventListener('DOMContentLoaded', () => {
    loadContacts();
    loadConversations();
    setupMessageSending();

    // Simulate real-time updates
    setInterval(checkForNewMessages, 5000);
});

function loadContacts() {
    // Mock contacts (people in your "circle")
    const contacts = [
        { id: 3, name: 'Elena Web', status: 'online' },
        { id: 4, name: 'David Tech', status: 'offline' }
    ];

    // Add contacts section to sidebar if not exists
    let contactsSection = document.getElementById('contacts-section');
    if (!contactsSection) {
        const sidebar = document.querySelector('.conversations-sidebar');
        contactsSection = document.createElement('div');
        contactsSection.id = 'contacts-section';
        contactsSection.style.padding = '1rem';
        contactsSection.style.borderTop = '1px solid var(--border-color)';
        contactsSection.innerHTML = '<h3 style="font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--text-muted);">Contactos</h3><div id="contacts-list"></div>';
        sidebar.appendChild(contactsSection);
    }

    const list = document.getElementById('contacts-list');
    list.innerHTML = contacts.map(c => `
        <div class="contact-item" onclick="startNewChat(${c.id}, '${c.name}')" style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0; cursor: pointer;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${c.status === 'online' ? 'var(--success-color)' : '#ccc'}"></div>
            <span style="font-size: 0.9rem;">${c.name}</span>
        </div>
    `).join('');
}

function loadConversations() {
    const list = document.getElementById('conversations-list');
    // Load messages from localStorage + mock data
    const localMessages = JSON.parse(localStorage.getItem('messages') || '[]');

    // Group messages by user
    const conversations = {};
    localMessages.forEach(msg => {
        const otherUser = msg.from === 'Yo' ? msg.to : msg.from;
        if (!conversations[otherUser]) {
            conversations[otherUser] = {
                user: otherUser,
                lastMsg: msg.text,
                time: msg.time,
                unread: false // Simplified logic
            };
        }
        // Update with latest message
        conversations[otherUser].lastMsg = msg.text;
        conversations[otherUser].time = msg.time;
    });

    // Add mock conversations if empty
    if (Object.keys(conversations).length === 0) {
        conversations['Ana García'] = { id: 1, user: 'Ana García', lastMsg: 'Hola, ¿cómo estás?', time: '10:30', unread: true };
        conversations['Carlos Ruiz'] = { id: 2, user: 'Carlos Ruiz', lastMsg: 'Gracias por la ayuda', time: 'Ayer', unread: false };
    }

    list.innerHTML = Object.values(conversations).map(c => `
        <div class="conversation-item ${c.unread ? 'active' : ''}" onclick="openChat('${c.user}')">
            <div class="conv-user">
                ${c.user}
                ${c.unread ? '<span class="unread-badge"></span>' : ''}
            </div>
            <div class="conv-preview">${c.lastMsg}</div>
            <div class="conv-time">${c.time}</div>
        </div>
    `).join('');
}

window.openChat = (username) => {
    document.getElementById('chat-header').style.display = 'flex';
    document.getElementById('chat-input-area').style.display = 'block';
    document.getElementById('chat-username').textContent = username;
    document.getElementById('chat-avatar').src = generateAvatar(username);

    loadChatMessages(username);

    // On mobile, show chat area
    if (window.innerWidth <= 768) {
        document.querySelector('.chat-area').classList.add('active');
    }
};

window.startNewChat = (id, username) => {
    openChat(username);
};

function loadChatMessages(username) {
    const display = document.getElementById('messages-display');
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    const user = JSON.parse(localStorage.getItem('user'));

    // Filter messages for this conversation
    const chatMessages = allMessages.filter(m =>
        (m.from === user.nombre && m.to === username) ||
        (m.from === username && m.to === user.nombre) ||
        (m.from === username && !m.to) // Handle mock messages
    );

    if (chatMessages.length === 0) {
        display.innerHTML = '<div class="empty-state">Inicia la conversación...</div>';
    } else {
        display.innerHTML = chatMessages.map(m => `
            <div class="message ${m.from === user.nombre ? 'sent' : 'received'}">
                ${m.text}
                <div class="message-time">${m.time}</div>
            </div>
        `).join('');
    }
    display.scrollTop = display.scrollHeight;
}

function setupMessageSending() {
    document.getElementById('message-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('message-input');
        const text = input.value.trim();
        const toUser = document.getElementById('chat-username').textContent;
        const user = JSON.parse(localStorage.getItem('user'));

        if (text && toUser) {
            const newMessage = {
                id: Date.now(),
                from: user.nombre,
                to: toUser,
                text: text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };

            // Save to localStorage
            const messages = JSON.parse(localStorage.getItem('messages') || '[]');
            messages.push(newMessage);
            localStorage.setItem('messages', JSON.stringify(messages));

            loadChatMessages(toUser);
            loadConversations(); // Update sidebar
            input.value = '';
        }
    });
}

function checkForNewMessages() {
    // In a real app, this would fetch from API
    // Here we just refresh the conversation list to show updates
    loadConversations();

    // If a chat is open, refresh it too
    const currentChatUser = document.getElementById('chat-username').textContent;
    if (currentChatUser) {
        loadChatMessages(currentChatUser);
    }
}
