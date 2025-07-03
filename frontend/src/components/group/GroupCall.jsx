import { useEffect, useState } from 'react';
import { StreamVideo, StreamVideoClient, StreamCall } from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { toast } from 'react-hot-toast';
import { Phone, Video, Mic, MicOff, VideoOff, Users, X } from 'lucide-react';
import { useStreamAuth } from '../../hooks/useStreamAuth.js';
import useAuthUser from '../../hooks/useAuthUser.js';
import CallContent from '../CallContent.jsx';

const GroupCall = ({ group, callType = 'video', onEndCall }) => {
  const [client, setClient] = useState(null);
  const [call, setCall] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { streamToken: streamVideoToken, isLoading: authLoading, error: authError } = useStreamAuth();
  const { authUser } = useAuthUser();

  useEffect(() => {
    const initCall = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!streamVideoToken || !authUser) {
          return;
        }

        console.log('Initializing Stream video client for group:', group._id);
        console.log('Call type:', callType);
        console.log('User:', authUser._id);

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePicture,
        };

        const videoClient = new StreamVideoClient({
          apiKey: import.meta.env.VITE_STREAM_API_KEY,
          user,
          token: streamVideoToken,
        });

        // Create call ID for the group
        const callId = `group_call_${group._id}`;
        const callInstance = videoClient.call('default', callId, {
          data: {
            custom: {
              groupId: group._id,
              groupName: group.name,
              type: callType,
            },
          },
        });

        // Join the call
        await callInstance.join({ create: true });

        console.log('Joined group call successfully');

        setClient(videoClient);
        setCall(callInstance);

        // Show success notification
        toast.success(
          callType === 'audio' 
            ? '🎙️ Joined group voice call successfully!' 
            : '🎥 Joined group video call successfully!',
          { duration: 3000 }
        );
      } catch (err) {
        console.error('Error initializing call:', err);
        setError(err.message);
        toast.error('Failed to start call');
      } finally {
        setIsLoading(false);
      }
    };

    if (group && group._id && streamVideoToken && authUser) {
      initCall();
    }

    // Cleanup on unmount
    return () => {
      if (call) {
        call.leave();
      }
      if (client) {
        client.disconnectUser();
      }
    };
  }, [group, callType, streamVideoToken, authUser]);

  const handleEndCall = () => {
    if (call) {
      call.leave();
    }
    if (onEndCall) {
      onEndCall();
    }
    toast.success('Call ended');
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-base-content/70">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h3 className="text-xl font-semibold mb-2">Authentication failed</h3>
          <p className="text-base-content/70 mb-4">{authError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
          <p className="text-base-content/70">Starting {callType} call...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">📞</div>
          <h3 className="text-xl font-semibold mb-2">Call failed</h3>
          <p className="text-base-content/70 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary"
            >
              Retry
            </button>
            <button 
              onClick={handleEndCall} 
              className="btn btn-outline"
            >
              End Call
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Call Header */}
      <div className="bg-base-100 border-b border-base-300 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl flex items-center justify-center">
              {group.image ? (
                <img src={group.image} alt={group.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <Users className="w-5 h-5 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold">{group.name} - {callType} call</h3>
              <p className="text-sm text-base-content/70">
                {group.members.length} members
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleEndCall}
              className="btn btn-error btn-sm gap-2"
              title="End call"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stream Video Call */}
      <div className="flex-1 relative">
        {client && call ? (
          <StreamVideo client={client}>
            <StreamCall call={call}>
              <CallContent callType={callType} onLeave={handleEndCall} />
            </StreamCall>
          </StreamVideo>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📞</div>
              <h3 className="text-xl font-semibold mb-2">Call not available</h3>
              <p className="text-base-content/70">Unable to start call</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCall;
