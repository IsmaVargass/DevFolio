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

    // Add preferences section with tutorial restart button
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

        // Add event listener
        document.getElementById('restart-tutorial-btn').addEventListener('click', () => {
            localStorage.removeItem('tutorial_completed');
            showToast('Redirigiendo al tutorial...', 'info');
            setTimeout(() => {
                window.location.href = 'dashboard.html?start_tutorial=true';
            }, 1000);
        });
    }
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
    // Remove profile photo from user object
    const user = JSON.parse(localStorage.getItem('user'));
    delete user.profile_photo;
    localStorage.setItem('user', JSON.stringify(user));

    // Restore generated avatar
    const generatedAvatar = generateAvatar(user.nombre);
    document.getElementById('current-avatar').src = generatedAvatar;

    showToast('Foto de perfil eliminada correctamente', 'success');
}

// Add tutorial restart handler
document.addEventListener('DOMContentLoaded', () => {
    const restartTutorialBtn = document.getElementById('restart-tutorial-btn');
    if (restartTutorialBtn) {
        restartTutorialBtn.addEventListener('click', () => {
            localStorage.removeItem('tutorial_completed');
            showToast('Redirigiendo al tutorial...', 'info');
            setTimeout(() => {
                window.location.href = 'dashboard.html?start_tutorial=true';
            }, 1000);
        });
    }
});

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
