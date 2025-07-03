import {useState} from 'react';
import {Link, useNavigate, useParams, useSearchParams} from 'react-router';
import {useQuery} from '@tanstack/react-query';
import {getGroupById} from '../lib/api';
import GroupCall from '../components/group/GroupCall.jsx';
import {toast} from 'react-hot-toast';
import {ArrowLeft, Phone, Users, Video} from 'lucide-react';

const GroupCallPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isInCall, setIsInCall] = useState(true);

  // Get call type from query parameters, default to 'video'
  const callType = searchParams.get('type') || 'video';

  // Fetch group details
  const { data: group, isLoading, error } = useQuery({
    queryKey: ['group', id],
    queryFn: () => getGroupById(id),
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to load group');
      navigate('/groups');
    }
  });

  const handleEndCall = () => {
    setIsInCall(false);
    navigate(`/groups/${id}`);
  };

  const handleStartCall = (type) => {
    // Navigate to the same page with different call type
    navigate(`/groups/${id}/call?type=${type}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-base-content/70">Loading group call...</p>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold mb-2">Group not found</h3>
          <p className="text-base-content/70 mb-4">The group you're looking for doesn't exist.</p>
          <Link to="/groups" className="btn btn-primary">
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-base-100 border-b border-base-300 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              to={`/groups/${id}`} 
              className="btn btn-ghost btn-circle"
              onClick={handleEndCall}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
                {group.image ? (
                  <img src={group.image} alt={group.name} className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <Users className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <h1 className="text-lg font-semibold">{group.name}</h1>
                <p className="text-sm text-base-content/70">
                  {callType === 'video' ? 'Video' : 'Audio'} call • {group.members.length} members
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {callType === 'video' && (
              <button
                onClick={() => handleStartCall('audio')}
                className="btn btn-ghost btn-sm gap-2"
                title="Switch to audio call"
              >
                <Phone className="w-4 h-4" />
                Audio
              </button>
            )}
            {callType === 'audio' && (
              <button
                onClick={() => handleStartCall('video')}
                className="btn btn-ghost btn-sm gap-2"
                title="Switch to video call"
              >
                <Video className="w-4 h-4" />
                Video
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Call Component */}
      <div className="flex-1">
        {isInCall && (
          <GroupCall 
            group={group} 
            callType={callType}
            onEndCall={handleEndCall}
            onStartCall={handleStartCall}
          />
        )}
      </div>
    </div>
  );
};

export default GroupCallPage; 