import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  image: {
    type: String,
    default: null
  },
  coverImage: {
    type: String,
    default: null
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'moderator', 'member'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  nativeLanguage: {
    type: String,
    required: true
  },
  learningLanguage: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'all'],
    default: 'all'
  },
  maxMembers: {
    type: Number,
    default: 50,
    min: 2,
    max: 100
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 20
  }],
  rules: [{
    type: String,
    trim: true,
    maxlength: 200
  }],
  streamChannelId: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour les recherches
groupSchema.index({ name: 'text', description: 'text', tags: 'text' });
groupSchema.index({ nativeLanguage: 1, learningLanguage: 1 });
groupSchema.index({ creator: 1 });
groupSchema.index({ 'members.user': 1 });
groupSchema.index({ isPrivate: 1, isActive: 1 });

// Méthodes statiques
groupSchema.statics.findPublicGroups = function() {
  return this.find({ isPrivate: false, isActive: true })
    .populate('creator', 'fullName profilePicture')
    .populate('members.user', 'fullName profilePicture')
    .sort({ createdAt: -1 });
};

groupSchema.statics.findUserGroups = function(userId) {
  return this.find({
    $or: [
      { creator: userId },
      { 'members.user': userId }
    ],
    isActive: true
  })
  .populate('creator', 'fullName profilePicture')
  .populate('members.user', 'fullName profilePicture')
  .sort({ lastActivity: -1 });
};

// Méthodes d'instance
groupSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.user.toString() === userId.toString());
};

groupSchema.methods.isAdmin = function(userId) {
  return this.members.some(member => 
    member.user.toString() === userId.toString() && 
    ['admin', 'moderator'].includes(member.role)
  );
};

groupSchema.methods.canJoin = function(userId) {
  if (this.isMember(userId)) return false;
  if (this.members.length >= this.maxMembers) return false;
  return true;
};

groupSchema.methods.addMember = function(userId, role = 'member') {
  if (!this.isMember(userId) && this.canJoin(userId)) {
    this.members.push({
      user: userId,
      role: role,
      joinedAt: new Date()
    });
    this.lastActivity = new Date();
    return true;
  }
  return false;
};

groupSchema.methods.removeMember = function(userId) {
  this.members = this.members.filter(member => 
    member.user.toString() !== userId.toString()
  );
  this.lastActivity = new Date();
};

const Group = mongoose.model('Group', groupSchema);

export default Group; 