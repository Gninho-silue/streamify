import { useEffect, useState } from 'react';
import { StreamChat } from 'stream-chat';
import { toast } from 'react-hot-toast';
import { Download, File, Image, FileText, Video, Music, Archive, FileX } from 'lucide-react';
import { useStreamAuth } from '../hooks/useStreamAuth';
import useAuthUser from '../hooks/useAuthUser';

const GroupFiles = ({ group }) => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [files, setFiles] = useState([]);
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
        const channel = streamClient.channel('messaging', channelId, {
          name: group.name,
          image: group.image,
          members: group.members.map(member => member.user._id),
        });

        await channel.watch();

        // Get all messages with file attachments
        const messages = await channel.getMessages();
        const fileAttachments = messages.results
          .flatMap(message => message.attachments || [])
          .filter(attachment => 
            attachment.type === 'file' || 
            attachment.type === 'image' || 
            attachment.type === 'video' ||
            attachment.type === 'audio'
          )
          .map(attachment => ({
            ...attachment,
            messageId: messages.results.find(msg => 
              msg.attachments?.some(att => att.asset_url === attachment.asset_url)
            )?.id,
            sender: messages.results.find(msg => 
              msg.attachments?.some(att => att.asset_url === attachment.asset_url)
            )?.user,
            createdAt: messages.results.find(msg => 
              msg.attachments?.some(att => att.asset_url === attachment.asset_url)
            )?.created_at
          }));

        setFiles(fileAttachments);
        setClient(streamClient);
        setChannel(channel);
      } catch (err) {
        console.error('Error loading files:', err);
        setError(err.message);
        toast.error('Failed to load group files');
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

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (fileType?.startsWith('video/')) return <Video className="w-5 h-5" />;
    if (fileType?.startsWith('audio/')) return <Music className="w-5 h-5" />;
    if (fileType?.includes('pdf')) return <FileText className="w-5 h-5" />;
    if (fileType?.includes('zip') || fileType?.includes('rar')) return <Archive className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
          <p className="text-base-content/70">Loading group files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold mb-2">Files unavailable</h3>
          <p className="text-base-content/70 mb-4">{error}</p>
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

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-base-100 border-b border-base-300 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Fichiers partagés</h3>
            <p className="text-sm text-base-content/70">
              {files.length} fichier{files.length !== 1 ? 's' : ''} partagé{files.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Files List */}
      <div className="flex-1 overflow-y-auto p-4">
        {files.length === 0 ? (
          <div className="text-center py-12">
            <FileX className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Aucun fichier partagé</h3>
            <p className="text-base-content/70">
              Les fichiers partagés dans le chat apparaîtront ici
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {files.map((file, index) => (
              <div key={`${file.asset_url}-${index}`} className="card bg-base-100 shadow-sm border border-base-300">
                <div className="card-body p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        {getFileIcon(file.mime_type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">
                        {file.title || file.name || 'Fichier sans nom'}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-base-content/70 mt-1">
                        <span>{formatFileSize(file.file_size || 0)}</span>
                        <span>•</span>
                        <span>{formatDate(file.createdAt)}</span>
                        {file.sender && (
                          <>
                            <span>•</span>
                            <span>par {file.sender.name}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <a
                        href={file.asset_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm gap-2"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupFiles;
 