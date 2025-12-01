/* js/messages.js */
document.addEventListener('DOMContentLoaded', () => {
    loadConversations();
    setupMessageSending();
});

function loadConversations() {
    const list = document.getElementById('conversations-list');
    // Mock data
    const conversations = [
        { id: 1, user: 'Ana García', lastMsg: 'Hola, ¿cómo estás?', time: '10:30', unread: true },
        { id: 2, user: 'Carlos Ruiz', lastMsg: 'Gracias por la ayuda', time: 'Ayer', unread: false }
    ];

    list.innerHTML = conversations.map(c => `
        <div class="conversation-item ${c.unread ? 'active' : ''}" onclick="openChat(${c.id}, '${c.user}')">
            <div class="conv-user">
                ${c.user}
                ${c.unread ? '<span class="unread-badge"></span>' : ''}
            </div>
            <div class="conv-preview">${c.lastMsg}</div>
            <div class="conv-time">${c.time}</div>
        </div>
    `).join('');
}

window.openChat = (id, username) => {
    document.getElementById('chat-header').style.display = 'flex';
    document.getElementById('chat-input-area').style.display = 'block';
    document.getElementById('chat-username').textContent = username;

    // Load messages for this chat
    const display = document.getElementById('messages-display');
    display.innerHTML = `
        <div class="message received">
            Hola, ¿cómo estás?
            <div class="message-time">10:30</div>
        </div>
        <div class="message sent">
            ¡Hola! Todo bien, ¿y tú?
            <div class="message-time">10:32</div>
        </div>
    `;

    // On mobile, show chat area
    if (window.innerWidth <= 768) {
        document.querySelector('.chat-area').classList.add('active');
    }
};

function setupMessageSending() {
    document.getElementById('message-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('message-input');
        const text = input.value.trim();

        if (text) {
            const display = document.getElementById('messages-display');
            const msgDiv = document.createElement('div');
            msgDiv.className = 'message sent';
            msgDiv.innerHTML = `
                ${text}
                <div class="message-time">Ahora</div>
            `;
            display.appendChild(msgDiv);
            display.scrollTop = display.scrollHeight;
            input.value = '';
        }
    });
}
