/* js/profile.js - Dynamic Profile Management */
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '../index.html';
        return;
    }

    loadProfileData(user);
    setupEventListeners();
    addPreferencesSection();
});

function loadProfileData(user) {
    // Display user info
    document.getElementById('display-name').textContent = user.nombre || 'Usuario';
    document.getElementById('display-email').textContent = user.email || '';

    // Set avatar
    const avatar = document.getElementById('current-avatar');
    if (user.profile_photo) {
        avatar.src = user.profile_photo;
    } else {
        avatar.src = generateAvatar(user.nombre || user.email);
    }

    // Fill form fields
    if (document.getElementById('nombre')) document.getElementById('nombre').value = user.nombre || '';
    if (document.getElementById('bio')) document.getElementById('bio').value = user.bio || '';
    if (document.getElementById('location')) document.getElementById('location').value = user.location || '';
    if (document.getElementById('phone')) document.getElementById('phone').value = user.phone || '';
    if (document.getElementById('github')) document.getElementById('github').value = user.github || '';
    if (document.getElementById('linkedin')) document.getElementById('linkedin').value = user.linkedin || '';
    if (document.getElementById('twitter')) document.getElementById('twitter').value = user.twitter || '';
    if (document.getElementById('website')) document.getElementById('website').value = user.website || '';
}

function setupEventListeners() {
    // Profile form submit
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Avatar change
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const avatarUpload = document.getElementById('avatar-upload');
    if (changeAvatarBtn && avatarUpload) {
        changeAvatarBtn.addEventListener('click', () => avatarUpload.click());
        avatarUpload.addEventListener('change', handleAvatarUpload);
    }

    // Avatar delete
    const deleteAvatarBtn = document.getElementById('delete-avatar-btn');
    if (deleteAvatarBtn) {
        deleteAvatarBtn.addEventListener('click', handleAvatarDelete);
    }
}

function handleProfileUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const user = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...user, ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    document.getElementById('display-name').textContent = data.nombre;
    showToast('Perfil actualizado correctamente', 'success');
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showToast('Por favor selecciona un archivo de imagen válido', 'error');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        showToast('La imagen es demasiado grande. Máximo 5MB', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const imageData = event.target.result;
        document.getElementById('current-avatar').src = imageData;

        const user = JSON.parse(localStorage.getItem('user'));
        user.profile_photo = imageData;
        localStorage.setItem('user', JSON.stringify(user));

        showToast('Foto de perfil actualizada correctamente', 'success');
    };
    reader.readAsDataURL(file);
}

function handleAvatarDelete() {
    const user = JSON.parse(localStorage.getItem('user'));
    delete user.profile_photo;
    localStorage.setItem('user', JSON.stringify(user));

    const generatedAvatar = generateAvatar(user.nombre || user.email);
    document.getElementById('current-avatar').src = generatedAvatar;

    showToast('Foto de perfil eliminada correctamente', 'success');
}

function generateAvatar(name) {
    if (!name) name = 'U';
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const color = colors[name.length % colors.length];

    const svg = `
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="${color}"/>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="white" font-size="80" font-family="Arial, sans-serif" font-weight="bold">${initials}</text>
        </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(svg);
}

function addPreferencesSection() {
    const securitySection = document.querySelector('.security-section');
    if (securitySection && !document.getElementById('restart-tutorial-btn')) {
        const preferencesSection = document.createElement('div');
        preferencesSection.className = 'preferences-section';
        preferencesSection.style.cssText = 'margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--border-color);';
        preferencesSection.innerHTML = `
            <h3>Preferencias</h3>
            <button id="restart-tutorial-btn" class="btn btn-outline">Ver Tutorial de Nuevo</button>
        `;
        securitySection.parentNode.insertBefore(preferencesSection, securitySection);

        document.getElementById('restart-tutorial-btn').addEventListener('click', () => {
            localStorage.removeItem('tutorial_completed');
            showToast('Redirigiendo al tutorial...', 'info');
            setTimeout(() => {
                window.location.href = 'dashboard.html?start_tutorial=true';
            }, 1000);
        });
    }
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
