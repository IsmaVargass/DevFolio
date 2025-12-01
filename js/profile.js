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
    // Social links would be loaded here
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
}

function handleProfileUpdate(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Simulate API call
    console.log('Updating profile:', data);

    // Update local storage for demo purposes
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
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById('current-avatar').src = e.target.result;
            // Here you would upload to server
        };
        reader.readAsDataURL(file);
    }
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} show`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
