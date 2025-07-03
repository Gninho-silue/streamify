"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { useQuery } from "@tanstack/react-query"
import { getStreamToken, getUserPublicProfile } from "../lib/api"

import { Channel, Chat, MessageInput, MessageList, Thread, Window } from "stream-chat-react"
import { StreamChat } from "stream-chat"
import toast from "react-hot-toast"

import ChatLoader from "../components/ChatLoader"
import { ArrowLeft, Video, Phone, MoreVertical, UserCheck, Shield } from "lucide-react"

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

// Composant d'en-tête personnalisé pour le chat
const CustomChatHeader = ({ targetUser, onBack, onVideoCall, onVoiceCall }) => {
  return (
    <div className="bg-base-100 border-b border-base-300 shadow-sm flex-shrink-0">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="btn btn-ghost btn-circle hover:bg-primary/10 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {targetUser && (
            <div className="flex items-center gap-3">
              <div className="avatar indicator">
                <div className="w-12 h-12 rounded-2xl ring ring-primary/20 ring-offset-base-100 ring-offset-2">
                  <img
                    src={targetUser.image || "/default-avatar.png"}
                    alt={targetUser.name}
                    className="rounded-2xl"
                  />
                </div>
                <span className="indicator-item badge badge-success badge-sm">
                  <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                </span>
              </div>
              <div>
                <h3 className="font-bold text-lg">{targetUser.name}</h3>
                <p className="text-sm text-base-content/70">Online now</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onVoiceCall}
            className="btn btn-ghost btn-circle hover:bg-success/10 hover:text-success transition-all duration-300 group"
            title="Start voice call"
          >
            <Phone className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>

          <button
            onClick={onVideoCall}
            className="btn btn-ghost btn-circle hover:bg-primary/10 hover:text-primary transition-all duration-300 group"
            title="Start video call"
          >
            <Video className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
          </button>

          <div className="dropdown dropdown-end">
            <button tabIndex={0} className="btn btn-ghost btn-circle hover:bg-base-200 transition-all duration-300">
              <MoreVertical className="w-5 h-5" />
            </button>
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow-2xl bg-base-100 rounded-2xl w-52 border border-base-300"
            >
              <li>
                <a className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 transition-colors duration-200">
                  <UserCheck className="w-4 h-4" />
                  View Profile
                </a>
              </li>
              <li>
                <a className="flex items-center gap-3 p-3 rounded-xl hover:bg-error/10 hover:text-error transition-colors duration-200">
                  <Shield className="w-4 h-4" />
                  Block User
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatPage = () => {
  const { id: targetUserId } = useParams()
  const navigate = useNavigate()

  const [chatClient, setChatClient] = useState(null)
  const [channel, setChannel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [targetUser, setTargetUser] = useState(null)

  const { authUser } = useAuthUser()

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  })

  const { data: targetUserData, error: targetUserError } = useQuery({
    queryKey: ["userProfile", targetUserId],
    queryFn: () => getUserPublicProfile(targetUserId),
    enabled: !!targetUserId,
  })

  useEffect(() => {
    const initChat = async () => {
      if (!tokenData?.token || !authUser) {
        return;
      }

      try {
        // Nettoyage d'une éventuelle instance précédente
        if (chatClient) {
          await chatClient.disconnectUser();
        }
        
        const client = StreamChat.getInstance(STREAM_API_KEY)

        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePicture,
          },
          tokenData.token,
        )

        const channelId = [authUser._id, targetUserId].sort().join("-")

        const currChannel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        })

        await currChannel.watch()

        // Get target user info from channel members
        const members = Object.values(currChannel.state.members)
        const target = members.find((member) => member.user.id !== authUser._id)
        setTargetUser(target?.user)

        setChatClient(client)
        setChannel(currChannel)
      } catch (error) {
        console.error("Error initializing chat:", error)
        toast.error("Could not connect to chat. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    if (tokenData?.token && authUser && targetUserId) {
      initChat()
    }
    
    // Nettoyage lors du démontage du composant
    return () => {
      if (chatClient) {
        chatClient.disconnectUser().catch(console.error);
      }
    }
  }, [tokenData, authUser, targetUserId])

  const handleVideoCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`

      channel.sendMessage({
        text: `🎥 I've started a video call. Join me here: ${callUrl}`,
        attachments: [
          {
            type: "video_call",
            title: "Join Video Call",
            url: callUrl,
          },
        ],
      })

      toast.success("Video call link sent successfully!")
      
      // Rediriger vers la page d'appel si nécessaire
      // navigate(`/call/${channel.id}?type=video`);
    }
  }

  const handleVoiceCall = () => {
    if (channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}?type=audio`

      channel.sendMessage({
        text: `📞 I've started a voice call. Join me here: ${callUrl}`,
        attachments: [
          {
            type: "voice_call",
            title: "Join Voice Call",
            url: callUrl,
          },
        ],
      })

      toast.success("Voice call link sent successfully!")
      
      // Rediriger vers la page d'appel si nécessaire
      // navigate(`/call/${channel.id}?type=audio`);
    }
  }

  if (targetUserError) {
    toast.error("User not found");
    navigate(-1);
    return null;
  }

  if (loading || !chatClient || !channel) {
    return <ChatLoader />
  }

  return (
    <div className="h-screen w-full flex flex-col">
      {/* En-tête personnalisé */}
      <CustomChatHeader 
        targetUser={targetUser} 
        onBack={() => navigate(-1)}
        onVideoCall={handleVideoCall}
        onVoiceCall={handleVoiceCall}
      />

      {/* Conteneur du chat - utilise tout l'espace disponible */}
      <div className="flex-1 w-full">
        <Chat client={chatClient} theme="str-chat__theme-light">
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
  )
}

export default ChatPage