// js/messages.js
import { apiFetch } from './api.js';
import { showAlert } from './utils.js';

// Esta función podría usarse en un panel de administración o dashboard privado
export async function loadMessages() {
    // Implementar si se añade una sección de "Buzón de Mensajes" en el Dashboard
    // Por ahora, el requisito principal suele ser ENVIAR mensajes (desde el punto de vista público)
    // Pero si el usuario logueado quiere ver sus mensajes:
    try {
        const messages = await apiFetch('/messages/list.php');
        console.log('Mensajes recibidos:', messages);
        // Renderizar en algún lugar si existe el contenedor
    } catch (error) {
        console.error(error);
    }
}

export async function sendMessage(userId, senderName, senderEmail, message) {
    try {
        await apiFetch('/messages/create.php', 'POST', {
            user_id: userId,
            sender_name: senderName,
            sender_email: senderEmail,
            message
        });
        showAlert('Mensaje enviado correctamente');
    } catch (error) {
        showAlert(error.message, 'error');
    }
}
