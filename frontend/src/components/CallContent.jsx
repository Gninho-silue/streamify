"use client"

import { CallControls, CallingState, SpeakerLayout, StreamTheme, useCallStateHooks } from "@stream-io/video-react-sdk"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { Phone, Video, Mic, MicOff, Users, Settings, MessageSquare, Maximize, Minimize } from "lucide-react"

const CallContent = ({ callType = "video", onLeave }) => {
    const { useCallCallingState, useParticipants, useLocalParticipant } = useCallStateHooks()
    const callingState = useCallCallingState()
    const participants = useParticipants()
    const localParticipant = useLocalParticipant()
    const navigate = useNavigate()

    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showControls, setShowControls] = useState(true)
    const [callDuration, setCallDuration] = useState(0)

    // Auto-hide controls after 3 seconds of inactivity
    useEffect(() => {
        let timeout
        if (showControls) {
            timeout = setTimeout(() => setShowControls(false), 3000)
        }
        return () => clearTimeout(timeout)
    }, [showControls])

    // Call duration timer
    useEffect(() => {
        let interval
        if (callingState === CallingState.JOINED) {
            interval = setInterval(() => {
                setCallDuration((prev) => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [callingState])

    // Handle call end
    useEffect(() => {
        if (callingState === CallingState.LEFT) {
            onLeave?.()
            navigate(-1)
            
        }
    }, [callingState, navigate, onLeave])

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    // Loading state
    if (callingState === CallingState.JOINING) {
        return (
            <div className="h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <div className="card bg-base-100 shadow-2xl p-8">
                    <div className="text-center space-y-6">
                        <div className="avatar placeholder">
                            <div className="bg-primary text-primary-content rounded-full w-24 animate-pulse">
                                {callType === "audio" ? <Phone className="w-12 h-12" /> : <Video className="w-12 h-12" />}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-2">
                                {callType === "audio" ? "Connecting to Voice Call..." : "Connecting to Video Call..."}
                            </h2>
                            <p className="text-base-content/70">Establishing connection with participants</p>
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
        <div
            className="h-screen bg-gradient-to-br from-base-300 to-base-200 relative overflow-hidden"
            onMouseMove={() => setShowControls(true)}
            onClick={() => setShowControls(true)}
        >
            <StreamTheme>
                {/* Call Header */}
                <div
                    className={`absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/50 to-transparent p-6 transition-all duration-300 ${
                        showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
                    }`}
                >
                    <div className="flex items-center justify-between text-white">
                        <div className="flex items-center gap-4">
                            <div className="badge badge-success gap-2">
                                <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                                Live
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span className="font-medium">{participants.length} participants</span>
                            </div>
                            <div className="badge badge-primary">{formatDuration(callDuration)}</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={toggleFullscreen}
                                className="btn btn-ghost btn-circle text-white hover:bg-white/20"
                                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                            >
                                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Call Area */}
                <div className="h-full relative">
                    {callType === "video" ? (
                        <SpeakerLayout />
                    ) : (
                        // Audio-only layout
                        <div className="h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                            <div className="text-center space-y-8">
                                <div className="flex justify-center gap-6">
                                    {participants.map((participant) => (
                                        <div key={participant.sessionId} className="text-center">
                                            <div className="avatar placeholder mb-4">
                                                <div className="bg-primary text-primary-content rounded-full w-24 ring-4 ring-primary/30 ring-offset-4 ring-offset-base-100">
                                                    <img
                                                        src={participant.image || "/default-avatar.png"}
                                                        alt={participant.name}
                                                        className="rounded-full"
                                                    />
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-lg">{participant.name}</h3>
                                            <div className="flex items-center justify-center gap-2 mt-2">
                                                {participant.audioEnabled ? (
                                                    <div className="badge badge-success gap-1">
                                                        <Mic className="w-3 h-3" />
                                                        Speaking
                                                    </div>
                                                ) : (
                                                    <div className="badge badge-error gap-1">
                                                        <MicOff className="w-3 h-3" />
                                                        Muted
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="card bg-base-100/80 backdrop-blur-sm shadow-xl p-6">
                                    <h2 className="text-2xl font-bold mb-2">Voice Call in Progress</h2>
                                    <p className="text-base-content/70">Audio-only conversation mode</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Custom Call Controls */}
                <div
                    className={`absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/50 to-transparent p-6 transition-all duration-300 ${
                        showControls ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
                    }`}
                >
                    <div className="flex justify-center">
                        <div className="bg-base-100/90 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-base-300">
                            <CallControls />
                        </div>
                    </div>
                </div>

                {/* Floating Action Buttons */}
                <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-10 space-y-3">
                    <button
                        className="btn btn-circle bg-base-100/80 backdrop-blur-sm border-base-300 hover:bg-base-100 shadow-lg"
                        title="Chat"
                    >
                        <MessageSquare className="w-5 h-5" />
                    </button>
                    <button
                        className="btn btn-circle bg-base-100/80 backdrop-blur-sm border-base-300 hover:bg-base-100 shadow-lg"
                        title="Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                </div>
            </StreamTheme>
        </div>
    )
}

export default CallContent
