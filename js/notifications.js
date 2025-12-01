/* js/notifications.js - Comprehensive Notifications System */

class NotificationSystem {
    constructor() {
        this.notifications = this.loadNotifications();
        this.init();
    }

    init() {
        this.createNotificationBell();
        this.updateBadge();
        this.setupEventListeners();
    }

    loadNotifications() {
        const stored = localStorage.getItem('notifications');
        return stored ? JSON.parse(stored) : [];
    }

    saveNotifications() {
        localStorage.setItem('notifications', JSON.stringify(this.notifications));
        this.updateBadge();
    }

    createNotificationBell() {
        const navbar = document.querySelector('.nav-links');
        if (!navbar) return;

        const bellHTML = `
            <li class="notification-bell-container">
                <button id="notification-bell" class="notification-bell">
                    <span class="bell-icon">🔔</span>
                    <span id="notification-badge" class="notification-badge" style="display: none;">0</span>
                </button>
                <div id="notification-dropdown" class="notification-dropdown">
                    <div class="notification-header">
                        <h3>Notificaciones</h3>
                        <button id="mark-all-read" class="btn-text">Marcar todas como leídas</button>
                    </div>
                    <div id="notification-list" class="notification-list">
                        <!-- Notifications will be rendered here -->
                    </div>
                </div>
            </li>
        `;

        navbar.insertAdjacentHTML('beforeend', bellHTML);
    }

    setupEventListeners() {
        const bell = document.getElementById('notification-bell');
        const dropdown = document.getElementById('notification-dropdown');
        const markAllRead = document.getElementById('mark-all-read');

        if (bell) {
            bell.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('show');
                this.renderNotifications();
            });
        }

        if (markAllRead) {
            markAllRead.addEventListener('click', () => {
                this.markAllAsRead();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notification-bell-container')) {
                dropdown?.classList.remove('show');
            }
        });
    }

    updateBadge() {
        const badge = document.getElementById('notification-badge');
        if (!badge) return;

        const unreadCount = this.notifications.filter(n => !n.read).length;
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'block';
        } else {
            badge.style.display = 'none';
        }
    }

    renderNotifications() {
        const list = document.getElementById('notification-list');
        if (!list) return;

        if (this.notifications.length === 0) {
            list.innerHTML = '<div class="no-notifications">No tienes notificaciones</div>';
            return;
        }

        // Sort by date, most recent first
        const sorted = [...this.notifications].sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        list.innerHTML = sorted.map(notif => this.createNotificationHTML(notif)).join('');

        // Add click handlers
        list.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.markAsRead(id);
                this.handleNotificationClick(id);
            });
        });
    }

    createNotificationHTML(notif) {
        const timeAgo = this.getTimeAgo(notif.timestamp);
        const icon = this.getNotificationIcon(notif.type);
        const readClass = notif.read ? 'read' : 'unread';

        return `
            <div class="notification-item ${readClass}" data-id="${notif.id}">
                <div class="notif-icon">${icon}</div>
                <div class="notif-content">
                    <div class="notif-message">${notif.message}</div>
                    <div class="notif-time">${timeAgo}</div>
                </div>
                ${!notif.read ? '<div class="unread-dot"></div>' : ''}
            </div>
        `;
    }

    getNotificationIcon(type) {
        const icons = {
            'job_application': '💼',
            'message': '💬',
            'ticket': '🎫',
            'system': '⚙️',
            'portfolio_view': '👁️',
            'community': '👥'
        };
        return icons[type] || '📢';
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const then = new Date(timestamp);
        const diff = now - then;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora mismo';
        if (minutes < 60) return `Hace ${minutes} min`;
        if (hours < 24) return `Hace ${hours}h`;
        if (days < 7) return `Hace ${days}d`;
        return then.toLocaleDateString();
    }

    addNotification(type, message, data = {}) {
        const notification = {
            id: Date.now(),
            type,
            message,
            data,
            read: false,
            timestamp: new Date().toISOString()
        };

        this.notifications.unshift(notification);
        this.saveNotifications();
        this.playNotificationSound();
        return notification;
    }

    markAsRead(id) {
        const notif = this.notifications.find(n => n.id === id);
        if (notif && !notif.read) {
            notif.read = true;
            this.saveNotifications();
            this.renderNotifications();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.renderNotifications();
    }

    handleNotificationClick(id) {
        const notif = this.notifications.find(n => n.id === id);
        if (!notif) return;

        // Navigate based on notification type
        switch (notif.type) {
            case 'job_application':
                window.location.href = 'admin_panel.html?tab=applications';
                break;
            case 'message':
                window.location.href = 'messages.html';
                break;
            case 'ticket':
                window.location.href = 'admin_panel.html?tab=tickets';
                break;
            case 'portfolio_view':
                window.location.href = 'communities.html';
                break;
        }
    }

    playNotificationSound() {
        // Simple beep sound using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Silently fail if audio not supported
        }
    }

    clearAll() {
        if (confirm('¿Eliminar todas las notificaciones?')) {
            this.notifications = [];
            this.saveNotifications();
            this.renderNotifications();
        }
    }
}

// Initialize on page load
let notificationSystem;
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        notificationSystem = new NotificationSystem();
    }
});

// Export for use in other scripts
window.NotificationSystem = NotificationSystem;
window.addNotification = (type, message, data) => {
    if (window.notificationSystem) {
        return window.notificationSystem.addNotification(type, message, data);
    }
};
