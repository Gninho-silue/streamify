"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"
import useAuthUser from "../hooks/useAuthUser"
import { useQuery } from "@tanstack/react-query"
import { getStreamToken } from "../lib/api"

import { StreamVideo, StreamVideoClient, StreamCall } from "@stream-io/video-react-sdk"

import "@stream-io/video-react-sdk/dist/css/styles.css"
import toast from "react-hot-toast"
import CallContent from "../components/CallContent"
import { Phone, PhoneOff, Video } from "lucide-react"

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY

const CallPage = () => {
  const { id: callId } = useParams()
  const navigate = useNavigate()
  const [client, setClient] = useState(null)
  const [call, setCall] = useState(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [callType, setCallType] = useState("video") // video or audio

  const { authUser, isLoading } = useAuthUser()

  const { data: tokenData } = useQuery({
    queryKey: ["streamToken"],
    queryFn: getStreamToken,
    enabled: !!authUser,
  })

  useEffect(() => {
    const initCall = async () => {
      if (!tokenData?.token || !authUser || !callId) return

      try {
        console.log("Initializing Stream video client...")

        const user = {
          id: authUser._id,
          name: authUser.fullName,
          image: authUser.profilePicture,
        }

        const videoClient = new StreamVideoClient({
          apiKey: STREAM_API_KEY,
          user,
          token: tokenData.token,
        })

        const callInstance = videoClient.call("default", callId)

        // Check if it's an audio-only call
        const urlParams = new URLSearchParams(window.location.search)
        const isAudioCall = urlParams.get("type") === "audio"
        setCallType(isAudioCall ? "audio" : "video")

        await callInstance.join({ create: true })

        console.log("Joined call successfully")

        setClient(videoClient)
        setCall(callInstance)

        // Show success notification
        toast.success(isAudioCall ? "🎙️ Joined voice call successfully!" : "🎥 Joined video call successfully!", {
          duration: 3000,
        })
      } catch (error) {
        console.error("Error joining call:", error)
        toast.error("Could not join the call. Please try again.")
        // Redirect back after error
        setTimeout(() => navigate(-1), 2000)
      } finally {
        setIsConnecting(false)
      }
    }

    initCall()

    // Cleanup on unmount
    return () => {
      if (call) {
        call.leave()
      }
      if (client) {
        client.disconnectUser()
      }
    }
  }, [tokenData, authUser, callId, navigate])

  if (isLoading || isConnecting) {
    return (
        <div className="h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
          <div className="card bg-base-100 shadow-2xl p-8">
            <div className="text-center space-y-6">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-20 animate-pulse">
                  {callType === "audio" ? <Phone className="w-10 h-10" /> : <Video className="w-10 h-10" />}
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  {callType === "audio" ? "Joining Voice Call..." : "Joining Video Call..."}
                </h2>
                <p className="text-base-content/70">Please wait while we connect you</p>
              </div>
              <div className="flex justify-center">
                <span className="loading loading-spinner loading-lg text-primary"></span>
              </div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="h-screen bg-gradient-to-br from-base-300 to-base-200">
        {client && call ? (
            <StreamVideo client={client}>
              <StreamCall call={call}>
                <CallContent callType={callType} onLeave={() => navigate(-1)} />
              </StreamCall>
            </StreamVideo>
        ) : (
            <div className="h-full flex items-center justify-center">
              <div className="card bg-base-100 shadow-2xl p-8">
                <div className="text-center space-y-6">
                  <div className="avatar placeholder">
                    <div className="bg-error text-error-content rounded-full w-20">
                      <PhoneOff className="w-10 h-10" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2 text-error">Call Failed</h2>
                    <p className="text-base-content/70 mb-6">
                      Could not initialize call. Please refresh or try again later.
                    </p>
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => window.location.reload()} className="btn btn-primary">
                        Retry
                      </button>
                      <button onClick={() => navigate(-1)} className="btn btn-outline">
                        Go Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}

export default CallPage
