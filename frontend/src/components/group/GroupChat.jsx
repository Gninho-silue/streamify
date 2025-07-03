import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  MessageList,
  MessageInput,
  Thread,
  Window,
  ChannelHeader as StreamChannelHeader
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';
import { toast } from 'react-hot-toast';
import { Phone, Video, Users, MoreVertical, AlertTriangle } from 'lucide-react';
import { useStreamAuth } from '../../hooks/useStreamAuth.js';
import useAuthUser from '../../hooks/useAuthUser.js';
import { Link } from 'react-router';

const CustomChannelHeader = ({ group, onStartCall }) => {
  const handleStartCall = (type) => {
    if (onStartCall) {
      onStartCall(type);
    }
  };

  return (
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
              <h3 className="font-semibold">{group.name}</h3>
              <p className="text-sm text-base-content/70">
                {group.members.length} members • {group.nativeLanguage} → {group.learningLanguage}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
                onClick={() => handleStartCall('audio')}
                className="btn btn-ghost btn-sm gap-2"
                title="Start audio call"
            >
              <Phone className="w-4 h-4" />
            </button>
            <button
                onClick={() => handleStartCall('video')}
                className="btn btn-ghost btn-sm gap-2"
                title="Start video call"
            >
              <Video className="w-4 h-4" />
            </button>
            <button className="btn btn-ghost btn-sm gap-2" title="More options">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
  );
};

const GroupChat = ({ group, onStartCall }) => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { streamToken, isLoading: authLoading, error: authError } = useStreamAuth();
  const { authUser } = useAuthUser();

  useEffect(() => {
    const initChat = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!streamToken || !authUser) {
          return;
        }

        // Vérifier si l'utilisateur est membre du groupe
        const isMember = group.members.some(member => member.user._id === authUser._id);
        if (!isMember) {
          setError({
            type: 'not_member',
            message: "You aren't a member of this group. Please join the group to access the chat."
          });
          setIsLoading(false);
          return;
        }

        // Initialize Stream Chat client
        const streamClient = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);

        // Connect user to Stream
        await streamClient.connectUser(
            {
              id: authUser._id,
              name: authUser.fullName,
              image: authUser.profilePicture,
            },
            streamToken
        );

        // Create or get the group channel
        const channelId = `group_${group._id}`;

        try {
          const channel = streamClient.channel('messaging', channelId, {
            name: group.name,
            image: group.image,
            members: group.members.map(member => member.user._id),
          });

          await channel.watch();
          setClient(streamClient);
          setChannel(channel);
        } catch (channelError) {
          console.error('Error watching channel:', channelError);

          // Erreur spécifique pour l'accès non autorisé au canal
          if (channelError.code === 17) {
            setError({
              type: 'access_denied',
              message: "You don't have access to this chat. It may have been deleted or you may not have access anymore." +
                  " Please refresh the page to try again."
            });
          } else {
            setError({
              type: 'channel_error',
              message: "Error loading chat. Please refresh the page to try again."
            });
          }

          // Déconnecter l'utilisateur pour éviter les fuites de mémoire
          streamClient.disconnectUser();
        }
      } catch (err) {
        console.error('Error initializing chat:', err);
        setError({
          type: 'init_error',
          message: err.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (group && group._id && streamToken && authUser) {
      initChat();
    }

    // Cleanup on unmount
    return () => {
      if (client) {
        client.disconnectUser();
      }
    };
  }, [group, streamToken, authUser]);

  const handleStartCall = (type) => {
    if (!channel) return;

    const callUrl = `${window.location.origin}/groups/${group._id}/call?type=${type}`;
    const callTypeText = type === 'video' ? 'video call' : 'voice call';
    const emoji = type === 'video' ? '🎥' : '📞';

    // Send call link in chat
    channel.sendMessage({
      text: `${emoji} I've started a ${callTypeText}. Join me here: ${callUrl}`,
      attachments: [
        {
          type: `${type}_call`,
          title: `Join ${type === 'video' ? 'Video' : 'Voice'} Call`,
          url: callUrl,
        },
      ],
    });

    toast.success(`${type === 'video' ? 'Video' : 'Voice'} call link sent to group!`);

    // If onStartCall callback is provided, also trigger it
    if (onStartCall) {
      onStartCall(type, group._id);
    }
  };

  if (authLoading) {
    return (
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-base-content/70">Authentification...</p>
          </div>
        </div>
    );
  }

  if (authError) {
    return (
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">🔐</div>
            <h3 className="text-xl font-semibold mb-2">Échec d'authentification</h3>
            <p className="text-base-content/70 mb-4">{authError}</p>
            <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
            >
              Réessayer
            </button>
          </div>
        </div>
    );
  }

  if (isLoading) {
    return (
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-base-content/70">Loading Group Chat...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex items-center justify-center h-full w-full">
          <div className="card bg-base-200 max-w-md w-full shadow-lg">
            <div className="card-body text-center">
              <div className="bg-error/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-error" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat not available</h3>
              <p className="text-base-content/70 mb-4">{error.message}</p>

              {error.type === 'not_member' && (
                  <div className="space-y-4">
                    <div className="bg-base-300 p-4 rounded-lg">
                      <p className="text-sm">
                        To access the chat, you must first join this group
                      </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="btn btn-primary w-full"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Refresh
                    </button>
                  </div>
              )}

              {error.type === 'access_denied' && (
                  <div className="space-y-4">
                    <div className="bg-base-300 p-4 rounded-lg">
                      <p className="text-sm">
                        It seems that you no longer have access to this chat. If you have just been removed from the group,
                        the modifications can take a moment to be applied. Please refresh the page to try again.
                      </p>
                    </div>
                    <Link to="/groups" className="btn btn-primary w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Go to groups
                    </Link>
                  </div>
              )}

              {(error.type === 'init_error' || error.type === 'channel_error') && (
                  <button
                      onClick={() => window.location.reload()}
                      className="btn btn-primary"
                  >
                    Try Again
                  </button>
              )}
            </div>
          </div>
        </div>
    );
  }

  if (!client || !channel) {
    return (
        <div className="flex items-center justify-center h-full w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Chat unavailable</h3>
            <p className="text-base-content/70">Unable to load group chat</p>
          </div>
        </div>
    );
  }

  return (
      <div className="h-full w-full flex flex-col">
        {/* Custom Header */}
        <CustomChannelHeader group={group} onStartCall={handleStartCall} />

        {/* Stream Chat */}
        <div className="flex-1 w-full">
          <Chat client={client} theme="str-chat__theme-light">
            <Channel channel={channel}>
              <Window hideOnThread={false}>
                <MessageList />
                <MessageInput focus />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        </div>
      </div>
  );
};

export default GroupChat;