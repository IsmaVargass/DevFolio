/* js/profile.js */
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    loadProfileData(user);

    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);
    document.getElementById('change-avatar-btn').addEventListener('click', () => {
        document.getElementById('avatar-upload').click();
    });

    // Add avatar upload handler
    document.getElementById('avatar-upload').addEventListener('change', handleAvatarUpload);

    // Add delete avatar handler
    document.getElementById('delete-avatar-btn').addEventListener('click', handleAvatarDelete);
});

function loadProfileData(user) {
    document.getElementById('display-name').textContent = user.nombre || 'Usuario';
    document.getElementById('display-email').textContent = user.email || 'usuario@example.com';
    document.getElementById('current-avatar').src = getUserAvatar(user);

    // Form fields
    document.getElementById('nombre').value = user.nombre || '';
    document.getElementById('bio').value = user.bio || '';
    document.getElementById('location').value = user.location || '';
    document.getElementById('phone').value = user.phone || '';

    // Social links
    document.getElementById('github').value = user.github || '';
    document.getElementById('linkedin').value = user.linkedin || '';
    document.getElementById('twitter').value = user.twitter || '';
    document.getElementById('website').value = user.website || '';
}

function handleProfileUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Update local storage
    const user = JSON.parse(localStorage.getItem('user'));
    const updatedUser = { ...user, ...data };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Update display
    document.getElementById('display-name').textContent = data.nombre;

    showToast('Perfil actualizado correctamente', 'success');
}

function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) {
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

            // Update display immediately
            document.getElementById('current-avatar').src = imageData;

            // Save to user profile in localStorage
            const user = JSON.parse(localStorage.getItem('user'));
            user.profile_photo = imageData;
            localStorage.setItem('user', JSON.stringify(user));

            showToast('Foto de perfil actualizada correctamente', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function handleAvatarDelete() {
    if (!confirm('¿Estás seguro de que quieres eliminar tu foto de perfil?')) {
        return;
    }

    // Remove profile photo from user object
    const user = JSON.parse(localStorage.getItem('user'));
    delete user.profile_photo;
    localStorage.setItem('user', JSON.stringify(user));

    // Restore generated avatar
    const generatedAvatar = generateAvatar(user.nombre);
    document.getElementById('current-avatar').src = generatedAvatar;

    showToast('Foto de perfil eliminada correctamente', 'success');
}

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
