import Notification from '../models/notification.model.js';

// Récupérer toutes les notifications de l'utilisateur
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'fullName profilePicture')
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            notifications
        });
    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Récupérer le nombre de notifications non lues
export const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.countDocuments({
            recipient: req.user._id,
            read: false
        });

        res.status(200).json({
            success: true,
            count
        });
    } catch (error) {
        console.error('Error getting unread count:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Marquer une notification comme lue
export const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: req.params.id,
                recipient: req.user._id
            },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found'
            });
        }

        res.status(200).json({
            success: true,
            notification
        });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// Marquer toutes les notifications comme lues
export const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            {
                recipient: req.user._id,
                read: false
            },
            { read: true }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}; 