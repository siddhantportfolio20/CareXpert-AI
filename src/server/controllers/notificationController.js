import { db } from '../db.js';
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user?.id;
        const notifications = db.get('notifications');
        const userNotifs = notifications.filter(n => n.userId === userId || req.user?.role === 'Admin');
        res.json({
            success: true,
            unreadCount: userNotifs.filter(n => !n.isRead).length,
            notifications: userNotifs
        });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notifications = db.get('notifications');
        const idx = notifications.findIndex(n => n.id === id);
        if (idx !== -1) {
            notifications[idx].isRead = true;
            db.save('notifications', notifications);
        }
        res.json({ success: true, message: 'Notification marked as read.' });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
