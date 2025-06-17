import { Link } from 'react-router'
import { LANGUAGE_TO_FLAG } from '../constants';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { blockUser } from '../lib/api';
import { toast } from 'react-hot-toast';
import { BanIcon, MapPinIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

export const getLanguageFlag = (language) => {
  if (!language) return null;

  const langKey = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langKey] || null;
  if (!countryCode) return null;

  return (
    <img
      src={`https://flagcdn.com/w20/${countryCode}.png`}
      alt={`Flag of ${language}`}
      className="inline-block w-4 h-4 mr-1"
      onError={(e) => {
        e.target.style.display = 'none';
      }}
    />
  )
}

const FriendCard = ({ friend }) => {
  const queryClient = useQueryClient();
  const [imageError, setImageError] = useState(false);

  const { mutate: blockUserMutation, isPending } = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
      toast.success('User blocked successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to block user');
    }
  });

  // Memoize flag components to avoid recreation on every render
  const nativeLanguageFlag = useMemo(() => 
    getLanguageFlag(friend.nativeLanguage), 
    [friend.nativeLanguage]
  );
  
  const learningLanguageFlag = useMemo(() => 
    getLanguageFlag(friend.learningLanguage), 
    [friend.learningLanguage]
  );

  const handleBlockUser = () => {
    if (window.confirm('Are you sure you want to block this user? You will not be able to message them or see their profile.')) {
      blockUserMutation(friend._id);
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const getAvailabilityBadgeClass = (availability) => {
    switch (availability) {
      case 'available':
        return 'badge-success';
      case 'busy':
        return 'badge-error';
      default:
        return 'badge-warning';
    }
  };

  return (
    <div className='card bg-base-200 p-4 shadow-md hover:shadow-lg transition-shadow duration-300'>
      <div className='flex items-center gap-3 mb-3'>
        <div className='avatar'>
          <div className='w-12 h-12 rounded-full'>
            <img 
              src={imageError ? '/default-avatar.png' : (friend.profilePicture || '/default-avatar.png')} 
              alt={`${friend.fullName}'s profile picture`}
              className='w-full h-full rounded-full object-cover' 
              onError={handleImageError}
            />
          </div>
        </div>
        <div className='flex-1'>
          <h3 className='font-semibold'>{friend.fullName}</h3>
          <p className='text-sm text-base-content/70'>{friend.status}</p>
        </div>
      </div>

      <div className='flex flex-wrap gap-1.5 mb-2'>
        <span className='badge badge-secondary text-xs'>
          {nativeLanguageFlag}
          Native: {friend.nativeLanguage}
        </span>
        <span className='badge badge-outline text-xs'>
          {learningLanguageFlag}
          Learning: {friend.learningLanguage}
        </span>
        {friend.location && (
          <span className='badge badge-primary text-xs'>
            <MapPinIcon className='size-3 mr-1' />
            {friend.location}
          </span>
        )}
        {friend.availability && (
          <span className={`badge ${getAvailabilityBadgeClass(friend.availability)} text-xs`}>
            {friend.availability}
          </span>
        )}
      </div>

      {friend.interests && friend.interests.length > 0 && (
        <div className='flex flex-wrap gap-1 mb-3'>
          {friend.interests.map((interest, index) => (
            <span key={index} className='badge badge-primary text-xs'>
              {interest}
            </span>
          ))}
        </div>
      )}

      <div className='space-y-1.5'>
        <Link 
          to={`/chat/${friend._id}`} 
          className='btn btn-outline btn-sm w-full'
          aria-label={`Send message to ${friend.fullName}`}
        >
          Message
        </Link>
        <button 
          onClick={handleBlockUser}
          disabled={isPending}
          className='btn btn-error btn-outline btn-sm w-full'
          aria-label={`Block ${friend.fullName}`}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Blocking...
            </>
          ) : (
            <>
              <BanIcon className="size-3 mr-1" />
              Block
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default FriendCard;