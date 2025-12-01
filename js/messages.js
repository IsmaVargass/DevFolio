/* js/messages.js - Messaging System with User Photos */
document.addEventListener('DOMContentLoaded', () => {
    loadConversations();
    setupEventListeners();
});

let currentConversationId = null;

const mockConversations = [
    {
        id: 1,
        userId: 'user2',
        name: 'María García',
        avatar: null,
        lastMessage: 'Hola! Me interesa tu perfil para un proyecto.',
        time: '10:30',
        unread: 2,
        messages: [
            { id: 1, text: 'Hola, he visto tu portfolio.', sender: 'them', time: '10:28' },
            { id: 2, text: 'Hola! Me interesa tu perfil para un proyecto.', sender: 'them', time: '10:30' }
        ]
    },
    {
        id: 2,
        userId: 'tech_recruiter',
        name: 'Tech Recruiter',
        avatar: null,
        lastMessage: 'Gracias por aplicar a la oferta.',
        time: 'Ayer',
        unread: 0,
        messages: [
            { id: 1, text: 'Gracias por aplicar a la oferta.', sender: 'them', time: 'Ayer' },
            { id: 2, text: 'Quedamos a la espera de noticias.', sender: 'me', time: 'Ayer' }
        ]
    }
];

function loadConversations() {
    const list = document.getElementById('conversations-list');
    const conversations = mockConversations;

    list.innerHTML = conversations.map(conv => {
        const avatar = conv.avatar || generateAvatar(conv.name);
        return `
            <div class="conversation-item ${currentConversationId === conv.id ? 'active' : ''}" 
                 onclick="openConversation(${conv.id})">
                <img src="${avatar}" alt="${conv.name}" class="conv-avatar">
                <div class="conv-info">
                    <div class="conv-top">
                        <span class="conv-name">${conv.name}</span>
                        <span class="conv-time">${conv.time}</span>
                    </div>
                    <div class="conv-bottom">
                        <span class="conv-last-msg">${conv.lastMessage}</span>
                        ${conv.unread > 0 ? `<span class="conv-unread">${conv.unread}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

window.openConversation = (id) => {
    currentConversationId = id;
    const conv = mockConversations.find(c => c.id === id);

    if (!conv) return;

    document.getElementById('chat-empty-state').style.display = 'none';
    document.getElementById('chat-content').style.display = 'flex';

    const avatar = conv.avatar || generateAvatar(conv.name);
    document.getElementById('current-chat-name').textContent = conv.name;
    document.getElementById('current-chat-avatar').src = avatar;

    renderMessages(conv.messages);
    loadConversations();

    conv.unread = 0;
};

function renderMessages(messages) {
    const area = document.getElementById('messages-area');
    const user = JSON.parse(localStorage.getItem('user'));
    const currentConv = mockConversations.find(c => c.id === currentConversationId);

    area.innerHTML = messages.map(msg => {
        const isMe = msg.sender === 'me';
        const userAvatar = user && user.profile_photo ? user.profile_photo : generateAvatar(user ? user.nombre : 'U');
        const otherAvatar = currentConv.avatar || generateAvatar(currentConv.name);
        const avatar = isMe ? userAvatar : otherAvatar;

        return `
            <div class="message ${isMe ? 'sent' : 'received'}">
                ${!isMe ? `<img src="${avatar}" class="msg-avatar" alt="Avatar">` : ''}
                <div class="msg-content">
                    <div class="msg-text">${msg.text}</div>
                    <span class="msg-time">${msg.time}</span>
                </div>
                ${isMe ? `<img src="${avatar}" class="msg-avatar" alt="Avatar">` : ''}
            </div>
        `;
    }).join('');

    area.scrollTop = area.scrollHeight;
}

function setupEventListeners() {
    const sendBtn = document.getElementById('send-message-btn');
    const messageInput = document.getElementById('message-input');
    const newConvBtn = document.getElementById('new-conversation-btn');

    if (sendBtn && messageInput) {
        sendBtn.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    if (newConvBtn) {
        newConvBtn.addEventListener('click', () => {
            showToast('Funcionalidad de nueva conversación próximamente', 'info');
        });
    }
}

function sendMessage() {
    const input = document.getElementById('message-input');
    const text = input.value.trim();

    if (!text || !currentConversationId) return;

    const conv = mockConversations.find(c => c.id === currentConversationId);
    if (!conv) return;

    const newMessage = {
        id: Date.now(),
        text: text,
        sender: 'me',
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    conv.messages.push(newMessage);
    conv.lastMessage = text;
    conv.time = newMessage.time;

    renderMessages(conv.messages);
    loadConversations();

    input.value = '';
}

function generateAvatar(name) {
    if (!name) name = 'U';
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const color = colors[name.length % colors.length];

    const svg = `
        <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
            <rect width="40" height="40" fill="${color}"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="16" font-family="Arial, sans-serif" font-weight="bold">${initials}</text>
        </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
