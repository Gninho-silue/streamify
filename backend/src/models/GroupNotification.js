import mongoose from 'mongoose';

const groupNotificationSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: [
      'member_joined',
      'member_left',
      'member_promoted',
      'member_demoted',
      'member_removed',
      'group_updated',
      'event_created',
      'event_reminder',
      'file_shared',
      'mention',
      'call_started'
    ],
    required: true
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  message: {
    type: String,
    required: true,
    maxlength: 500
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index pour les performances
groupNotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
groupNotificationSchema.index({ group: 1, type: 1 });
groupNotificationSchema.index({ recipient: 1, isDeleted: 1 });

// Méthodes statiques
groupNotificationSchema.statics.findUserNotifications = function(userId, limit = 20) {
  return this.find({ 
    recipient: userId, 
    isDeleted: false 
  })
  .populate('group', 'name image')
  .populate('sender', 'fullName profilePicture')
  .sort({ createdAt: -1 })
  .limit(limit);
};

groupNotificationSchema.statics.markAsRead = function(userId, notificationIds) {
  return this.updateMany(
    { 
      _id: { $in: notificationIds }, 
      recipient: userId 
    },
    { isRead: true }
  );
};

groupNotificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    { recipient: userId, isRead: false },
    { isRead: true }
  );
};

// Méthodes d'instance
groupNotificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

groupNotificationSchema.methods.softDelete = function() {
  this.isDeleted = true;
  return this.save();
};

const GroupNotification = mongoose.model('GroupNotification', groupNotificationSchema);

export default GroupNotification;
 