/* js/profile.js - Enhanced Profile Management with Dynamic Features */

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        window.location.href = '../index.html';
        return;
    }

    initializeProfile(user);
    setupEventListeners();
    setupPasswordModal();
});

/* ============================================
   INITIALIZATION
   ============================================ */
function initializeProfile(user) {
    loadProfileData(user);
    updateMemberStats(user);
    setupBioCounter();
    calculateProfileCompletion(user);
}

function loadProfileData(user) {
    // Display user info
    document.getElementById('display-name').textContent = user.nombre || 'Usuario';
    document.getElementById('display-email').textContent = user.email || '';

    // Set avatar using utility function
    const avatar = document.getElementById('current-avatar');
    avatar.src = getUserAvatar(user);

    // Fill form fields
    const fields = ['nombre', 'bio', 'location', 'phone', 'github', 'linkedin', 'twitter', 'website', 'job_title', 'company'];
    fields.forEach(field => {
        const el = document.getElementById(field);
        if (el) el.value = user[field] || '';
    });
}

function updateMemberStats(user) {
    // Member since
    const memberSince = user.member_since || new Date().toISOString();
    if (!user.member_since) {
        user.member_since = memberSince;
        localStorage.setItem('user', JSON.stringify(user));
    }

    const memberDate = new Date(memberSince);
    const memberSinceEl = document.getElementById('member-since');
    if (memberSinceEl) {
        memberSinceEl.textContent = formatDate(memberDate);
    }

    // Last updated
    const lastUpdated = user.last_updated || memberSince;
    const lastUpdatedEl = document.getElementById('last-updated');
    if (lastUpdatedEl) {
        lastUpdatedEl.textContent = formatRelativeTime(new Date(lastUpdated));
    }
}

function calculateProfileCompletion(user) {
    const fields = ['nombre', 'bio', 'location', 'phone', 'github', 'linkedin', 'twitter', 'website', 'job_title', 'company', 'profile_photo'];
    const totalFields = fields.length;
    const completedFields = fields.filter(field => user[field] && user[field].trim() !== '').length;

    const percentage = Math.round((completedFields / totalFields) * 100);

    const progressFill = document.getElementById('profile-progress');
    const percentageEl = document.getElementById('profile-percentage');

    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }

    if (percentageEl) {
        percentageEl.textContent = percentage + '%';
    }
}

/* ============================================
   EVENT LISTENERS
   ============================================ */
function setupEventListeners() {
    // Profile form submit
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Avatar upload - click (only on change button, not container)
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const avatarUpload = document.getElementById('avatar-upload');

    if (changeAvatarBtn && avatarUpload) {
        changeAvatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            avatarUpload.click();
        });
    }

    if (avatarUpload) {
        avatarUpload.addEventListener('change', handleAvatarUpload);
    }

    // Avatar container click for upload
    const avatarContainer = document.getElementById('avatar-container');
    if (avatarContainer && avatarUpload) {
        avatarContainer.addEventListener('click', (e) => {
            // Only trigger if clicking the container itself, not the buttons
            if (e.target === avatarContainer || e.target.closest('.profile-avatar') || e.target.closest('.avatar-overlay')) {
                avatarUpload.click();
            }
        });
    }

    // Avatar upload - drag and drop
    if (avatarContainer) {
        avatarContainer.addEventListener('dragover', handleDragOver);
        avatarContainer.addEventListener('dragleave', handleDragLeave);
        avatarContainer.addEventListener('drop', handleDrop);
    }

    // Avatar delete - FIXED
    const deleteAvatarBtn = document.getElementById('delete-avatar-btn');
    if (deleteAvatarBtn) {
        deleteAvatarBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            handleAvatarDelete();
        });
    }

    // Tutorial restart
    const restartTutorialBtn = document.getElementById('restart-tutorial-btn');
    if (restartTutorialBtn) {
        restartTutorialBtn.addEventListener('click', handleRestartTutorial);
    }

    // Export profile
    const exportBtn = document.getElementById('export-profile-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', handleExportProfile);
    }

    // Share profile
    const shareBtn = document.getElementById('share-profile-btn');
    if (shareBtn) {
        shareBtn.addEventListener('click', handleShareProfile);
    }

    // Clear data
    const clearDataBtn = document.getElementById('clear-data-btn');
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', handleClearData);
    }
}

function setupBioCounter() {
    const bioField = document.getElementById('bio');
    const bioCounter = document.getElementById('bio-counter');

    if (bioField && bioCounter) {
        // Initial count
        bioCounter.textContent = bioField.value.length;

        // Update on input
        bioField.addEventListener('input', () => {
            bioCounter.textContent = bioField.value.length;
        });
    }
}

/* ============================================
   PROFILE UPDATE
   ============================================ */
function handleProfileUpdate(e) {
    e.preventDefault();

    const saveBtn = document.getElementById('save-btn');

    // Show loading state
    saveBtn.classList.add('loading');
    saveBtn.disabled = true;

    // Simulate save delay for better UX
    setTimeout(() => {
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        const user = JSON.parse(localStorage.getItem('user'));
        const updatedUser = {
            ...user,
            ...data,
            last_updated: new Date().toISOString()
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Update display
        document.getElementById('display-name').textContent = data.nombre;
        updateMemberStats(updatedUser);
        calculateProfileCompletion(updatedUser);

        // Update avatar if it was auto-generated (to reflect new name)
        if (!updatedUser.profile_photo) {
            document.getElementById('current-avatar').src = getUserAvatar(updatedUser);
        }

        // Remove loading state
        saveBtn.classList.remove('loading');
        saveBtn.disabled = false;

        showToast('Perfil actualizado correctamente', 'success');
    }, 800);
}

/* ============================================
   AVATAR MANAGEMENT
   ============================================ */
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    processAvatarFile(file);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.opacity = '0.7';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.style.opacity = '1';
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.opacity = '1';

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Por favor arrastra un archivo de imagen válido', 'error');
        return;
    }

    processAvatarFile(file);
}

function processAvatarFile(file) {
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

        // Compress and resize if needed
        compressImage(imageData, (compressedData) => {
            document.getElementById('current-avatar').src = compressedData;

            const user = JSON.parse(localStorage.getItem('user'));
            user.profile_photo = compressedData;
            localStorage.setItem('user', JSON.stringify(user));

            // Update profile completion
            calculateProfileCompletion(user);

            showToast('Foto de perfil actualizada correctamente', 'success');
        });
    };
    reader.readAsDataURL(file);
}

function compressImage(dataUrl, callback) {
    const img = new Image();
    img.onload = function () {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Max dimensions
        const maxSize = 400;
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > height) {
            if (width > maxSize) {
                height *= maxSize / width;
                width = maxSize;
            }
        } else {
            if (height > maxSize) {
                width *= maxSize / height;
                height = maxSize;
            }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG with 0.8 quality
        callback(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.src = dataUrl;
}

function handleAvatarDelete() {
    console.log('handleAvatarDelete called - restoring default avatar');
    
    const user = JSON.parse(localStorage.getItem('user'));
    
    // Remove the custom photo to restore default
    delete user.profile_photo;
    localStorage.setItem('user', JSON.stringify(user));

    // Update the avatar image to default (initials-based)
    const avatarImg = document.getElementById('current-avatar');
    if (avatarImg) {
        avatarImg.src = getUserAvatar(user);
        console.log('Avatar restored to default (initials)');
    }
    
    // Update profile completion
    calculateProfileCompletion(user);

    showToast('Foto restaurada al avatar predeterminado', 'success');
}

/* ============================================
   PASSWORD MODAL
   ============================================ */
function setupPasswordModal() {
    const modal = document.getElementById('password-modal');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const closeBtn = modal.querySelector('.close');
    const cancelBtn = document.getElementById('cancel-password-btn');
    const passwordForm = document.getElementById('password-form');

    // Open modal
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            modal.classList.add('show');
            passwordForm.reset();
        });
    }

    // Close modal
    const closeModal = () => {
        modal.classList.remove('show');
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Handle password change
    if (passwordForm) {
        passwordForm.addEventListener('submit', handlePasswordChange);
    }
}

function handlePasswordChange(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    const user = JSON.parse(localStorage.getItem('user'));

    // Validate current password
    if (currentPassword !== user.password) {
        showToast('La contraseña actual es incorrecta', 'error');
        return;
    }

    // Validate new passwords match
    if (newPassword !== confirmPassword) {
        showToast('Las contraseñas nuevas no coinciden', 'error');
        return;
    }

    // Validate password length
    if (newPassword.length < 6) {
        showToast('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    // Update password
    user.password = newPassword;
    localStorage.setItem('user', JSON.stringify(user));

    // Close modal and show success
    document.getElementById('password-modal').classList.remove('show');
    showToast('Contraseña actualizada correctamente', 'success');

    e.target.reset();
}

/* ============================================
   NEW UTILITIES
   ============================================ */
function handleExportProfile() {
    const user = JSON.parse(localStorage.getItem('user'));

    // Create a clean export object (without password)
    const exportData = { ...user };
    delete exportData.password;

    // Convert to JSON string
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    // Create download link
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `devfolio-profile-${user.nombre || 'usuario'}-${new Date().toISOString().split('T')[0]}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Perfil exportado correctamente', 'success');
}

function handleShareProfile() {
    const user = JSON.parse(localStorage.getItem('user'));
    const profileUrl = `${window.location.origin}/DevFolio/portfolio/${user.email}`;

    // Try to use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: `Perfil de ${user.nombre || 'Usuario'}`,
            text: `Mira mi perfil en DevFolio`,
            url: profileUrl
        }).then(() => {
            showToast('Perfil compartido correctamente', 'success');
        }).catch((error) => {
            // Fallback to clipboard
            copyToClipboard(profileUrl);
        });
    } else {
        // Fallback to clipboard
        copyToClipboard(profileUrl);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Enlace copiado al portapapeles', 'success');
        });
    } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Enlace copiado al portapapeles', 'success');
    }
}

function handleClearData() {
    if (!confirm('⚠️ ADVERTENCIA: Esto eliminará TODOS tus datos de DevFolio de forma permanente.\n\n¿Estás absolutamente seguro de que quieres continuar?')) {
        return;
    }

    if (!confirm('Esta acción NO se puede deshacer. ¿Continuar?')) {
        return;
    }

    // Clear all localStorage
    localStorage.clear();

    showToast('Todos los datos han sido eliminados', 'info');

    // Redirect to home after 2 seconds
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 2000);
}

/* ============================================
   TUTORIAL RESTART
   ============================================ */
function handleRestartTutorial() {
    localStorage.removeItem('tutorial_completed');
    showToast('Redirigiendo al tutorial...', 'info');
    setTimeout(() => {
        window.location.href = 'dashboard.html?start_tutorial=true';
    }, 1000);
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;

    return formatDate(date);
}
