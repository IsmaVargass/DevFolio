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

    // Set avatar using utility function
    const avatar = document.getElementById('current-avatar');
    avatar.src = getUserAvatar(user);

    // Fill form fields
    const fields = ['nombre', 'bio', 'location', 'phone', 'github', 'linkedin', 'twitter', 'website'];
    fields.forEach(field => {
        const el = document.getElementById(field);
        if (el) el.value = user[field] || '';
    });
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

    // Update avatar if it was auto-generated (to reflect new name)
    if (!updatedUser.profile_photo) {
        document.getElementById('current-avatar').src = getUserAvatar(updatedUser);
    }

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
    if (!confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')) return;

    const user = JSON.parse(localStorage.getItem('user'));
    delete user.profile_photo;
    localStorage.setItem('user', JSON.stringify(user));

    document.getElementById('current-avatar').src = getUserAvatar(user);

    showToast('Foto de perfil eliminada correctamente', 'success');
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
