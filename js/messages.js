/* js/messages.js - Messaging System Logic */
document.addEventListener('DOMContentLoaded', () => {
    loadConversations();
    setupEventListeners();
});

let currentConversationId = null;

// Mock Data
const mockConversations = [
    {
        id: 1,
        userId: 'user2',
        name: 'María García',
        avatar: '../assets/default-avatar.png',
        lastMessage: '¡Hola! Me interesa tu perfil para un proyecto.',
        time: '10:30',
        unread: 2,
        messages: [
            { id: 1, text: 'Hola, he visto tu portfolio.', sender: 'them', time: '10:28' },
            { id: 2, text: '¡Hola! Me interesa tu perfil para un proyecto.', sender: 'them', time: '10:30' }
        ]
    },
    {
        id: 2,
        userId: 'tech_recruiter',
        name: 'Tech Recruiter',
        avatar: '../assets/default-avatar.png',
        lastMessage: 'Gracias por aplicar a la oferta.',
        time: 'Ayer',
        unread: 0,
        messages: [
            { id: 1, text: 'Gracias por aplicar a la oferta.', sender: 'them', time: 'Yesterday' },
            { id: 2, text: 'Quedamos a la espera de noticias.', sender: 'me', time: 'Yesterday' }
        ]
    }
];

function loadConversations() {
    const list = document.getElementById('conversations-list');
    // In production, load from localStorage/API
    const conversations = mockConversations; // Using mock for now

    list.innerHTML = conversations.map(conv => `
        <div class="conversation-item ${currentConversationId === conv.id ? 'active' : ''}" 
             onclick="openConversation(${conv.id})">
            <img src="${conv.avatar}" alt="${conv.name}" class="conv-avatar">
            <div class="conv-info">
                <div class="conv-top">
                    <span class="conv-name">${conv.name}</span>
                    <span class="conv-time">${conv.time}</span>
                </div>
                <div class="conv-bottom" style="display: flex; justify-content: space-between;">
                    <span class="conv-last-msg">${conv.lastMessage}</span>
                    ${conv.unread > 0 ? `<span class="conv-unread">${conv.unread}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

window.openConversation = (id) => {
    currentConversationId = id;
    const conv = mockConversations.find(c => c.id === id);

    if (!conv) return;

    // Update UI
    document.getElementById('chat-empty-state').style.display = 'none';
    document.getElementById('chat-content').style.display = 'flex';

    document.getElementById('current-chat-name').textContent = conv.name;
    document.getElementById('current-chat-avatar').src = conv.avatar;

    // Render messages
    renderMessages(conv.messages);

    // Update active state in sidebar
    loadConversations();

    // Mark as read
    conv.unread = 0;

    // Scroll to bottom
    scrollToBottom();
};

function renderMessages(messages) {
    const area = document.getElementById('messages-area');
    area.innerHTML = messages.map(msg => `
        <div class="message ${msg.sender === 'me' ? 'sent' : 'received'}">
            <div class="msg-text">${msg.text}</div>
            <span class="msg-time">${msg.time}</span>
        </div>
    `).join('');
}

function scrollToBottom() {
    const area = document.getElementById('messages-area');
    area.scrollTop = area.scrollHeight;
}

function setupEventListeners() {
    const input = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');

    const sendMessage = () => {
        const text = input.value.trim();
        if (!text || !currentConversationId) return;

        const conv = mockConversations.find(c => c.id === currentConversationId);

        // Add message
        const newMsg = {
            id: Date.now(),
            text: text,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        conv.messages.push(newMsg);
        conv.lastMessage = text;
        conv.time = 'Ahora';

        // Render
        renderMessages(conv.messages);
        loadConversations();
        input.value = '';
        scrollToBottom();

        // Simulate reply
        setTimeout(() => {
            const replyMsg = {
                id: Date.now() + 1,
                text: 'Gracias por tu mensaje. Te responderé pronto.',
                sender: 'them',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            conv.messages.push(replyMsg);
            conv.lastMessage = replyMsg.text;

            if (currentConversationId === conv.id) {
                renderMessages(conv.messages);
                scrollToBottom();
                // Play sound
                if (window.notificationSystem) {
                    window.notificationSystem.playNotificationSound();
                }
            } else {
                conv.unread++;
                loadConversations();
                if (window.addNotification) {
                    window.addNotification('message', `Nuevo mensaje de ${conv.name}`, { conversationId: conv.id });
                }
            }
        }, 2000);
    };

    sendBtn.addEventListener('click', sendMessage);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}
