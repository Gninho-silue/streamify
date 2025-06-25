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
        title: 'New Friend Request',
        message: `${sender.fullName} sent you a friend request`,
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
        title: 'Friend Request Accepted',
        message: `${accepter.fullName} accepted your friend request`,
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
        title: 'New Message',
        message: `${sender.fullName} sent you a message`,
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
        title: 'New User Recommended',
        message: `${newUser.fullName} joined the platform and might interest you`,
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
        'birthday': 'Happy Birthday! 🎉',
        'welcome': 'Welcome to Streamify! 🚀',
        'milestone': 'Congratulations on your progress! 🎯',
        'reminder': 'Don\'t forget to practice your languages! 📚'
    };

    return createNotification({
        recipient: recipient._id,
        sender: null,
        type: 'system',
        title: 'Special Event',
        message: eventMessages[eventType] || 'Special Event',
        data: {
            eventType,
            ...eventData
        }
    });
}; 