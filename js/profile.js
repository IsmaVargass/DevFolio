/* js/profile.js - Gestión de Perfil Mejorada con Características Dinámicas */

document.addEventListener('DOMContentLoaded', () => {
    // Carga inicial desde la API
    loadProfileData();
    setupEventListeners();
    setupPasswordModal();
});

/* ============================================
   INICIALIZACIÓN
   ============================================ */
async function loadProfileData() {
    try {
        const response = await fetch('../api/profile/get_profile.php');
        const data = await response.json();

        if (response.ok) {
            const user = data.user;

            // Permitir que otros componentes sepan que el usuario está cargado
            // Aún mantenemos info básica en localStorage para AuthGuard/Sesión
            // Actualizamos usuario de sesión con la última info si es necesario
            initializeProfile(user);
        } else {
            console.error('Error cargando perfil:', data.error);
            showToast('Sesión expirada o error de carga. Por favor inicia sesión.', 'error');
            setTimeout(() => window.location.href = '../index.html', 2000);
        }
    } catch (error) {
        console.error('Error de red:', error);
        showToast('Error de conexión con el servidor', 'error');
    }
}

function initializeProfile(user) {
    populateForm(user);
    updateMemberStats(user);
    setupBioCounter();
    calculateProfileCompletion(user);
}

function populateForm(user) {
    // Mostrar información del usuario
    document.getElementById('display-name').textContent = user.nombre || 'Usuario';
    document.getElementById('display-email').textContent = user.email || '';

    // Establecer avatar
    const avatar = document.getElementById('current-avatar');
    if (user.profile_photo) {
        avatar.src = user.profile_photo;
    } else {
        avatar.src = getUserAvatar(user); // Fallback a iniciales
    }

    // Rellenar campos del formulario
    const fields = ['nombre', 'bio', 'location', 'phone', 'github', 'linkedin', 'twitter', 'website', 'job_title', 'company'];
    fields.forEach(field => {
        const el = document.getElementById(field);
        if (el) el.value = user[field] || '';
    });
}

function updateMemberStats(user) {
    const memberSinceEl = document.getElementById('member-since');
    if (memberSinceEl && user.member_since) {
        memberSinceEl.textContent = formatDate(new Date(user.member_since));
    }

    const lastUpdatedEl = document.getElementById('last-updated');
    if (lastUpdatedEl && user.last_updated) {
        lastUpdatedEl.textContent = formatRelativeTime(new Date(user.last_updated));
    }
}

function calculateProfileCompletion(user) {
    const fields = ['nombre', 'bio', 'location', 'phone', 'github', 'linkedin', 'twitter', 'website', 'job_title', 'company', 'profile_photo'];
    const totalFields = fields.length;
    // Comprobar si los campos no son cadenas vacías
    const completedFields = fields.filter(field => user[field] && user[field].toString().trim() !== '').length;

    const percentage = Math.round((completedFields / totalFields) * 100);

    const progressFill = document.getElementById('profile-progress');
    const percentageEl = document.getElementById('profile-percentage');

    if (progressFill) progressFill.style.width = percentage + '%';
    if (percentageEl) percentageEl.textContent = percentage + '%';
}

/* ============================================
   EVENT LISTENERS (ESCUCHADORES DE EVENTOS)
   ============================================ */
function setupEventListeners() {
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', handleProfileUpdate);
    }

    // Interacciones de Avatar
    const changeAvatarBtn = document.getElementById('change-avatar-btn');
    const avatarUpload = document.getElementById('avatar-upload');
    const avatarContainer = document.getElementById('avatar-container');

    if (changeAvatarBtn && avatarUpload) {
        changeAvatarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            avatarUpload.click();
        });
    }

    if (avatarUpload) {
        avatarUpload.addEventListener('change', handleAvatarUpload);
    }

    if (avatarContainer && avatarUpload) {
        avatarContainer.addEventListener('click', (e) => {
            if (e.target === avatarContainer || e.target.closest('.profile-avatar') || e.target.closest('.avatar-overlay')) {
                avatarUpload.click();
            }
        });

        avatarContainer.addEventListener('dragover', handleDragOver);
        avatarContainer.addEventListener('dragleave', handleDragLeave);
        avatarContainer.addEventListener('drop', handleDrop);
    }

    // Borrar avatar
    const deleteAvatarBtn = document.getElementById('delete-avatar-btn');
    if (deleteAvatarBtn) {
        deleteAvatarBtn.addEventListener('click', handleAvatarDelete);
    }

    // Exportar/Compartir
    const exportBtn = document.getElementById('export-profile-btn');
    if (exportBtn) exportBtn.addEventListener('click', handleExportProfile);

    // Botón de limpiar datos (oculto por ahora ya que usamos BBDD)
    const clearDataBtn = document.getElementById('clear-data-btn');
    if (clearDataBtn) clearDataBtn.style.display = 'none';
}

function setupBioCounter() {
    const bioField = document.getElementById('bio');
    const bioCounter = document.getElementById('bio-counter');

    if (bioField && bioCounter) {
        bioCounter.textContent = bioField.value.length;
        bioField.addEventListener('input', () => {
            bioCounter.textContent = bioField.value.length;
        });
    }
}

/* ============================================
   ACTUALIZACIÓN DE PERFIL
   ============================================ */
async function handleProfileUpdate(e) {
    e.preventDefault();

    const saveBtn = document.getElementById('save-btn');
    saveBtn.classList.add('loading');
    saveBtn.disabled = true;

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('../api/profile/update_profile.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showToast('Perfil actualizado correctamente', 'success');
            // Recargar datos para actualizar estadísticas/progreso
            loadProfileData();
        } else {
            showToast(result.error || 'Error al actualizar', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    } finally {
        saveBtn.classList.remove('loading');
        saveBtn.disabled = false;
    }
}

/* ============================================
   GESTIÓN DE AVATAR
   ============================================ */
function handleAvatarUpload(e) {
    const file = e.target.files[0];
    if (file) uploadAvatar(file);
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.style.opacity = '1';
    const file = e.dataTransfer.files[0];
    if (file) uploadAvatar(file);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.style.opacity = '0.7';
}

function handleDragLeave(e) {
    e.preventDefault();
    e.currentTarget.style.opacity = '1';
}

async function uploadAvatar(file) {
    if (!file.type.startsWith('image/')) {
        showToast('Solo imágenes', 'error');
        return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
        showToast('Subiendo imagen...', 'info');

        const response = await fetch('../api/profile/upload_avatar.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (response.ok) {
            document.getElementById('current-avatar').src = result.url;
            showToast('Foto actualizada', 'success');
            loadProfileData(); // Refrescar puntuación de completado
        } else {
            showToast(result.error || 'Error al subir', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error de conexión', 'error');
    }
}

async function handleAvatarDelete(e) {
    e.preventDefault();
    e.stopPropagation();

    // En una app real llamaríamos a una API para borrar el archivo/columna
    // Por ahora solo alertamos

    if (confirm('¿Seguro que quieres eliminar tu foto?')) {
        // Podríamos implementar delete_avatar.php
        showToast('Funcionalidad de borrar foto pendiente de implementación (se puede reemplazar subiendo otra)', 'info');
    }
}

/* ============================================
   MODAL DE CONTRASEÑA
   ============================================ */
function setupPasswordModal() {
    const modal = document.getElementById('password-modal');
    if (!modal) return;

    const changePasswordBtn = document.getElementById('change-password-btn');
    const closeBtn = modal.querySelector('.close');
    const passwordForm = document.getElementById('password-form');

    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => modal.classList.add('show'));
    }

    if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.remove('show'));

    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('El cambio de contraseña requiere endpoint de backend. (Pendiente Fase 3)');
            modal.classList.remove('show');
        });
    }
}

/* ============================================
   FUNCIONES DE UTILIDAD
   ============================================ */
function handleExportProfile() {
    alert('Exportar perfil: Pendiente de actualización para usar datos de BBDD.');
}

function getUserAvatar(user) {
    // Generar avatar con iniciales
    const name = user.nombre || 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
}

function formatDate(date) {
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatRelativeTime(date) {
    // Mock simple
    return date.toLocaleDateString();
}
