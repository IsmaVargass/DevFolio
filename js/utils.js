/* js/utils.js */

/**
 * Generates a default avatar with initials
 * @param {string} name - User's full name
 * @returns {string} - Data URI of the generated SVG
 */
function generateAvatar(name) {
    if (!name) return '../assets/default-avatar.png';

    const initials = name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    // Generate a consistent color based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    const color = '#' + '00000'.substring(0, 6 - c.length) + c;

    // Create SVG
    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="${color}"/>
        <text x="50" y="50" font-family="Arial, sans-serif" font-size="40" font-weight="bold" fill="white" text-anchor="middle" dy=".35em">${initials}</text>
    </svg>
    `;

    return 'data:image/svg+xml;base64,' + btoa(svg);
}

/**
 * Gets the user's avatar (uploaded or generated)
 * @param {object} user - User object
 * @returns {string} - Avatar URL
 */
function getUserAvatar(user) {
    if (user && user.profile_photo) {
        return user.profile_photo;
    }
    return generateAvatar(user ? user.nombre : '?');
}

/**
 * Formats a date string
 * @param {string} dateStr - Date string
 * @returns {string} - Formatted date
 */
function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
}

/**
 * Shows a toast notification
 * @param {string} message - Message to display
 * @param {string} type - 'success', 'error', 'info'
 */
function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger reflow
    toast.offsetHeight;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
