import Notification from '../models/notification.model.js';

// Fonction utilitaire pour créer des notifications
export const createNotification = async ({
    recipient,
    sender,
    type,
    title,
    message,
    data = {}
}) => {
    try {
        const notification = await Notification.create({
            recipient,
            sender,
            type,
            title,
            message,
            data
        });
        
        console.log(`Notification created: ${type} for user ${recipient}`);
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Notifications pour les demandes d'ami
export const sendFriendRequestNotification = async (sender, recipient) => {
    return createNotification({
        recipient: recipient._id,
        sender: sender._id,
        type: 'friend_request',
        title: 'Nouvelle demande d\'ami',
        message: `${sender.fullName} vous a envoyé une demande d'ami`,
        data: {
            senderName: sender.fullName,
            senderPicture: sender.profilePicture,
            senderId: sender._id
        }
    });
};

// Notifications pour l'acceptation de demandes d'ami
export const sendFriendRequestAcceptedNotification = async (accepter, requester) => {
    return createNotification({
        recipient: requester._id,
        sender: accepter._id,
        type: 'friend_request',
        title: 'Demande d\'ami acceptée',
        message: `${accepter.fullName} a accepté votre demande d'ami`,
        data: {
            accepterName: accepter.fullName,
            accepterPicture: accepter.profilePicture,
            accepterId: accepter._id
        }
    });
};

// Notifications pour les nouveaux messages (si vous implémentez le chat)
export const sendMessageNotification = async (sender, recipient, messagePreview) => {
    return createNotification({
        recipient: recipient._id,
        sender: sender._id,
        type: 'message',
        title: 'Nouveau message',
        message: `${sender.fullName} vous a envoyé un message`,
        data: {
            senderName: sender.fullName,
            senderPicture: sender.profilePicture,
            messagePreview: messagePreview.substring(0, 50) + '...',
            senderId: sender._id
        }
    });
};

// Notifications système
export const sendSystemNotification = async (recipient, title, message, data = {}) => {
    return createNotification({
        recipient: recipient._id,
        sender: null, // Pas d'expéditeur pour les notifications système
        type: 'system',
        title,
        message,
        data
    });
};

// Notifications pour les nouveaux utilisateurs recommandés
export const sendNewUserNotification = async (recipient, newUser) => {
    return createNotification({
        recipient: recipient._id,
        sender: newUser._id,
        type: 'system',
        title: 'Nouvel utilisateur recommandé',
        message: `${newUser.fullName} a rejoint la plateforme et pourrait vous intéresser`,
        data: {
            newUserName: newUser.fullName,
            newUserPicture: newUser.profilePicture,
            newUserId: newUser._id,
            nativeLanguage: newUser.nativeLanguage,
            learningLanguage: newUser.learningLanguage
        }
    });
};

// Notifications pour les anniversaires ou événements spéciaux
export const sendSpecialEventNotification = async (recipient, eventType, eventData = {}) => {
    const eventMessages = {
        'birthday': 'Joyeux anniversaire ! 🎉',
        'welcome': 'Bienvenue sur Streamify ! 🚀',
        'milestone': 'Félicitations pour votre progression ! 🎯',
        'reminder': 'N\'oubliez pas de pratiquer vos langues ! 📚'
    };

    return createNotification({
        recipient: recipient._id,
        sender: null,
        type: 'system',
        title: 'Événement spécial',
        message: eventMessages[eventType] || 'Événement spécial',
        data: {
            eventType,
            ...eventData
        }
    });
}; 