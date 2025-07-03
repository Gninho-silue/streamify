import {Link} from "react-router"
import {useQueryClient} from "@tanstack/react-query"
import {
  BanIcon,
  CheckCircleIcon,
  MapPinIcon,
  MessageCircle,
  Sparkles,
  Undo2,
  UserPlusIcon,
  UserXIcon
} from "lucide-react"
import {useMemo, useState} from "react"
import {getLanguageFlag} from "./getLanguageFlag.jsx"

const FriendCard = ({ 
  user = {}, // Provide default empty object to prevent undefined errors
  cardType = "friend", // friend, recommended, blocked
  onAction, // Function that will be called with action type and user id
  isPending = false,
  pendingAction = null // The action currently in progress
}) => {
  useQueryClient();
  const [imageError, setImageError] = useState(false)
  
  // Safely access properties with optional chaining
  const nativeLanguageFlag = useMemo(() => 
    user?.nativeLanguage ? getLanguageFlag(user.nativeLanguage) : null, 
    [user?.nativeLanguage]
  )
  
  const learningLanguageFlag = useMemo(() => 
    user?.learningLanguage ? getLanguageFlag(user.learningLanguage) : null, 
    [user?.learningLanguage]
  )

  // Verify user exists before proceeding
  if (!user || !user._id) {
    return null; // Return nothing if user data is invalid
  }

  const handleAction = (actionType) => {
    if (onAction) {
      onAction(actionType, user._id, user.fullName || 'User');
    }
  }

  const handleImageError = () => {
    setImageError(true)
  }

  const getAvailabilityBadgeClass = (availability) => {
    switch (availability) {
      case "available":
        return "badge-success"
      case "busy":
        return "badge-error"
      default:
        return "badge-warning"
    }
  }

  // Render different action buttons based on card type
  const renderActions = () => {
    switch (cardType) {
      case "friend":
        return (
          <>
            <Link
              to={`/chat/${user._id}`}
              className="btn btn-primary flex-1 gap-2 group/btn"
              aria-label={`Send message to ${user.fullName || 'User'}`}
            >
              <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
              Message
            </Link>
            <Link
              to={`/users/${user._id}`}
              className="btn btn-outline flex-1 gap-2"
              aria-label={`View ${user.fullName || 'User'}'s profile`}
            >
              See Profile
            </Link>
            <button
              onClick={() => handleAction('block')}
              disabled={isPending && pendingAction === 'block'}
              className="btn btn-outline btn-error gap-2 group/block"
              aria-label={`Block ${user.fullName || 'User'}`}
            >
              {isPending && pendingAction === 'block' ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Blocking...
                </>
              ) : (
                <>
                  <BanIcon className="w-4 h-4 group-hover/block:scale-110 transition-transform duration-200" />
                  Block
                </>
              )}
            </button>
          </>
        );
        
      case "recommended":
        return (
          <>
            <button
              onClick={() => handleAction('sendRequest')}
              disabled={isPending && pendingAction === 'sendRequest'}
              className="btn btn-primary flex-1 gap-2"
              aria-label={`Send friend request to ${user.fullName || 'User'}`}
            >
              {isPending && pendingAction === 'sendRequest' ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Sending...
                </>
              ) : user.requestSent ? (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  Request Sent
                </>
              ) : (
                <>
                  <UserPlusIcon className="size-3" />
                  Add Friend
                </>
              )}
            </button>
            <Link
              to={`/users/${user._id}`}
              className="btn btn-outline flex-1 gap-2"
              aria-label={`View ${user.fullName || 'User'}'s profile`}
            >
              See Profile
            </Link>
          </>
        );
        
      case "blocked":
        return (
          <button
            onClick={() => handleAction('unblock')}
            disabled={isPending && pendingAction === 'unblock'}
            className="btn btn-outline btn-success gap-2 w-full"
            aria-label={`Unblock ${user.fullName || 'User'}`}
          >
            {isPending && pendingAction === 'unblock' ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Unblocking...
              </>
            ) : (
              <>
                <Undo2 className="w-4 h-4" />
                Unblock User
              </>
            )}
          </button>
        );
        
      default:
        return null;
    }
  };

  // Add different styling based on card type
  const getCardClasses = () => {
    switch (cardType) {
      case "blocked":
        return "border border-error/20";
      case "recommended":
        return "border border-secondary/20";
      default:
        return "border border-base-300 hover:border-primary/20";
    }
  };

  return (
    <div className={`card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-500 ${getCardClasses()} group`}>
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

      <div className="card-body p-6 relative">
        {/* Header with avatar and basic info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="avatar indicator">
            <div className={`w-16 h-16 rounded-2xl ring ring-base-300 ring-offset-base-100 ring-offset-2 group-hover:ring-primary/30 transition-all duration-300 ${cardType === "blocked" ? "grayscale" : ""}`}>
              <img
                src={imageError ? "/default-avatar.png" : user.profilePicture || "/default-avatar.png"}
                alt={`${user.fullName || 'User'}'s profile picture`}
                className="rounded-2xl group-hover:scale-110 transition-transform duration-500"
                onError={handleImageError}
              />
            </div>
            {user.availability && (
              <span
                className={`indicator-item badge badge-sm ${getAvailabilityBadgeClass(user.availability)} border-2 border-base-100`}
              >
                {user.availability === "available" ? "●" : user.availability === "busy" ? "●" : "●"}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="card-title text-lg mb-1 group-hover:text-primary transition-colors duration-300 truncate">
              {user.fullName || 'User'}
            </h3>
            {user.status && (
              <p className="text-sm text-base-content/70 line-clamp-2 leading-relaxed">{user.status}</p>
            )}
            
            {cardType === "blocked" && (
              <div className="badge badge-error badge-sm gap-1 mt-1">
                <UserXIcon className="w-3 h-3" />
                Blocked
              </div>
            )}
            
            {cardType === "recommended" && user.requestSent && (
              <div className="badge badge-success badge-sm gap-1 mt-1">
                <CheckCircleIcon className="w-3 h-3" />
                Request Sent
              </div>
            )}
          </div>
        </div>

        {/* Language badges */}
        {(user.nativeLanguage || user.learningLanguage) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {user.nativeLanguage && (
              <div className="badge badge-primary badge-lg gap-2 font-medium">
                {nativeLanguageFlag}
                <span className="font-bold">Native:</span>
                {user.nativeLanguage}
              </div>
            )}
            {user.learningLanguage && (
              <div className="badge badge-secondary badge-lg gap-2 font-medium">
                {learningLanguageFlag}
                <span className="font-bold">Learning:</span>
                {user.learningLanguage}
              </div>
            )}
          </div>
        )}

        {/* Additional info badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {user.location && (
            <div className="badge badge-outline gap-2">
              <MapPinIcon className="w-3 h-3" />
              {user.location}
            </div>
          )}
          {user.availability && cardType !== "blocked" && (
            <div className={`badge ${getAvailabilityBadgeClass(user.availability)} gap-2`}>
              <div className="w-2 h-2 rounded-full bg-current" />
              {user.availability}
            </div>
          )}
        </div>

        {/* Interests */}
        {user.interests && user.interests.length > 0 && cardType !== "blocked" && (
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-base-content/60" />
              <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">Interests</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {user.interests.slice(0, 4).map((interest, index) => (
                <span key={index} className="badge badge-accent badge-sm">
                  {interest}
                </span>
              ))}
              {user.interests.length > 4 && (
                <span className="badge badge-ghost badge-sm">+{user.interests.length - 4} more</span>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="card-actions justify-stretch gap-2 mt-auto">
          {renderActions()}
        </div>
      </div>
    </div>
  );
};

export default FriendCard;