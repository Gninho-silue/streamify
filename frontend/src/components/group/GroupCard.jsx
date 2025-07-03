import { Users, Globe, Lock, Users2, BookOpen, MessageCircle, Trash2, LogOut, Crown, Shield, User } from 'lucide-react';
import { Link } from 'react-router';
import { getLanguageFlag } from "../getLanguageFlag.jsx";

const GroupCard = ({ 
  group, 
  currentUserId, 
  isInMyGroups = false,
  onJoinGroup,
  onLeaveGroup,
  onDeleteGroup,
  isJoining = false,
  isLeaving = false,
  isDeleting = false
}) => {
  const userMember = group.members.find(member => member.user?._id === currentUserId);
  const isCreator = group.creator?._id === currentUserId;
  const isAdmin = userMember?.role === 'admin' || userMember?.role === 'moderator';

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'badge-success';
      case 'intermediate': return 'badge-warning';
      case 'advanced': return 'badge-error';
      default: return 'badge-info';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-warning" />;
      case 'moderator': return <Shield className="w-4 h-4 text-info" />;
      default: return <User className="w-4 h-4 text-base-content/60" />;
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Cover Image */}
      <figure className="h-48 relative">
        {group.coverImage ? (
          <img 
            src={group.coverImage} 
            alt={`${group.name} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <Users2 className="w-16 h-16 text-primary/50" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex gap-2">
          <div className="badge badge-sm badge-ghost bg-base-100/70 backdrop-blur-sm">
            {group.isPrivate ? (
              <Lock className="w-3 h-3 mr-1" />
            ) : (
              <Globe className="w-3 h-3 mr-1" />
            )}
            {group.isPrivate ? "Private" : "Public"}
          </div>
          
          <div className="badge badge-sm badge-ghost bg-base-100/70 backdrop-blur-sm">
            <Users className="w-3 h-3 mr-1" />
            {group.members.length}/{group.maxMembers}
          </div>
        </div>
        
        {isCreator && (
          <div className="absolute top-2 left-2">
            <div className="badge badge-sm badge-warning gap-1 bg-warning/90 backdrop-blur-sm">
              <Crown className="w-3 h-3" />
              Creator
            </div>
          </div>
        )}
        
        {/* Group Profile Image - Overlay at the bottom */}
        <div className="absolute -bottom-8 left-4">
          <div className="avatar">
            <div className="w-16 h-16 rounded-xl ring ring-primary ring-offset-base-100 ring-offset-2 bg-base-200 overflow-hidden shadow-lg">
              {group.image ? (
                <img 
                  src={group.image} 
                  alt={`${group.name} profile`}
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-primary/30 to-secondary/30">
                  <Users className="w-8 h-8 text-base-content/40" />
                </div>
              )}
            </div>
          </div>
        </div>
      </figure>

      <div className="card-body pt-10"> {/* Add padding to make room for the profile image */}
        {/* Group Info */}
        <div className="space-y-3">
          <h3 className="card-title text-lg">{group.name}</h3>
          <p className="text-sm text-base-content/70 line-clamp-2">
            {group.description}
          </p>

          {/* Languages */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium">{getLanguageFlag(group.nativeLanguage)}</span>{group.nativeLanguage}
            <span>→</span>
            <span className="font-medium">{getLanguageFlag(group.learningLanguage)}</span>{group.learningLanguage}
          </div>

          {/* Level */}
          <div className="flex items-center gap-2">
            <span className={`badge ${getLevelColor(group.level)}`}>
              {group.level}
            </span>
            {userMember?.role && getRoleIcon(userMember.role)}
          </div>

          {/* Tags */}
          {group.tags && group.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {group.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="badge badge-outline badge-sm">
                  {tag}
                </span>
              ))}
              {group.tags.length > 3 && (
                <span className="badge badge-outline badge-sm">
                  +{group.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="card-actions justify-stretch mt-4 gap-2">
          {isInMyGroups ? (
            <>
              <Link
                to={`/groups/${group._id}`}
                className="btn btn-primary flex-1 gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Open Chat
              </Link>
              
              {isCreator ? (
                <button
                  className="btn btn-error btn-sm gap-2"
                  onClick={() => onDeleteGroup(group._id)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              ) : (
                <button
                  className="btn btn-outline btn-sm gap-2"
                  onClick={() => onLeaveGroup(group._id)}
                  disabled={isLeaving}
                >
                  {isLeaving ? (
                    <span className="loading loading-spinner loading-xs"></span>
                  ) : (
                    <LogOut className="w-4 h-4" />
                  )}
                  Leave
                </button>
              )}
            </>
          ) : (
            <>
              <Link
                to={`/groups/${group._id}`}
                className="btn btn-outline flex-1 gap-2"
              >
                <BookOpen className="w-4 h-4" />
                View Group
              </Link>
              <button
                className="btn btn-primary flex-1 gap-2"
                onClick={() => onJoinGroup(group._id)}
                disabled={isJoining}
              >
                {isJoining ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Joining...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    Join Group
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupCard;