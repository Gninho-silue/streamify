"use client"

import { useParams, useNavigate } from "react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import {
  MessageCircle,
  UserPlus,
  CheckCircle,
  Phone,
  Video,
  Heart,
  Share2,
  Flag,
  MoreVertical,
  ArrowLeft,
  Star,
  Shield,
  Clock,
  MapPin,
  Globe,
  Calendar,
  Award,
  Zap,
  User,
} from "lucide-react"
import { getUserPublicProfile, sendFriendRequest, getOutgoingFriendRequests, getMyFriends } from "../lib/api"
import ProfileInfo from "../components/profile/ProfileInfo"
import ProfileSocial from "../components/profile/ProfileSocial"
import ProfileLoader from "../components/profile/ProfileLoader"
import { toast } from "react-hot-toast"
import {formatDate} from "../lib/utils.js";

export default function UserProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [isLiked, setIsLiked] = useState(false)
  const [showReportModal, setShowReportModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile", id],
    queryFn: () => getUserPublicProfile(id),
    enabled: !!id,
    onError: (err) => {
      toast.error(err?.response?.data?.message || "User not found")
    },
  })

  const { data: outgoingFriendRequests } = useQuery({
    queryKey: ["outgoingFriendRequests"],
    queryFn: getOutgoingFriendRequests,
  })

  const { data: friends = [] } = useQuery({
    queryKey: ["friends"],
    queryFn: getMyFriends,
  })

  const hasRequestSent = outgoingFriendRequests?.outgoingRequests?.some((req) => req.recipient._id === id)

  const isAlreadyFriend = friends.some((friend) => friend._id === id)

  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] })
      toast.success("Friend request sent successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send friend request")
    },
  })

  const handleSendMessage = () => {
    navigate(`/chat/${id}`)
  }

  const handleCall = () => {
    navigate(`/call/${id}?type=audio`)
  }

  const handleVideoCall = () => {
    navigate(`/call/${id}?type=video`)
  }

  const handleSendFriendRequest = () => {
    if (!hasRequestSent && !isAlreadyFriend) {
      sendRequestMutation(id)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.fullName}'s Profile`,
          text: `Check out ${profile?.fullName}'s profile on Streamify`,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Share cancelled")
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard!")
    }
  }
  console.log(profile);

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case "available":
        return "text-success"
      case "busy":
        return "text-error"
      case "away":
        return "text-warning"
      default:
        return "text-base-content/50"
    }
  }

  const getAvailabilityText = (availability) => {
    switch (availability) {
      case "available":
        return "Available"
      case "busy":
        return "Busy"
      case "away":
        return "Away"
      default:
        return "Offline"
    }
  }

  if (isLoading) return <ProfileLoader />

  if (error || !profile) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="card bg-base-100 shadow-xl max-w-md">
            <div className="card-body text-center">
              <div className="text-6xl mb-4">😕</div>
              <h2 className="card-title justify-center">User Not Found</h2>
              <p className="text-base-content/70">This user doesn't exist or has been deleted.</p>
              <div className="card-actions justify-center mt-4">
                <button onClick={() => navigate(-1)} className="btn btn-primary">
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-base-200 via-base-100 to-base-200">
        {/* Header with navigation */}
        <div className="bg-base-100 border-b border-base-300 sticky top-0 z-30 backdrop-blur-md bg-base-100/80">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm btn-circle">
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h1 className="font-bold text-lg">{profile.fullName}</h1>
                  <div className="flex items-center gap-2 text-sm">
                    <div
                        className={`w-2 h-2 rounded-full ${getAvailabilityColor(profile.availability).replace("text-", "bg-")}`}
                    ></div>
                    <span className={getAvailabilityColor(profile.availability)}>
                    {getAvailabilityText(profile.availability)}
                  </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                    onClick={() => setIsLiked(!isLiked)}
                    className={`btn btn-ghost btn-sm btn-circle ${isLiked ? "text-error" : ""}`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                </button>

                <button onClick={handleShare} className="btn btn-ghost btn-sm btn-circle">
                  <Share2 className="w-4 h-4" />
                </button>

                <div className="dropdown dropdown-end">
                  <button tabIndex={0} className="btn btn-ghost btn-sm btn-circle">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  <ul
                      tabIndex={0}
                      className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300"
                  >
                    <li>
                      <button onClick={() => setShowReportModal(true)}>
                        <Flag className="w-4 h-4" />
                        Report User
                      </button>
                    </li>
                    <li>
                      <button>
                        <Shield className="w-4 h-4" />
                        Block User
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Profile header */}
          <div className="card bg-base-100 shadow-xl mb-8 border border-base-300 overflow-hidden">
            <div className="relative">
              {/* Cover image */}
              <div className="h-48 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 relative">
                {profile.coverPicture && (
                    <img
                        src={profile.coverPicture || "/placeholder.svg"}
                        alt="Cover"
                        className="w-full h-full object-cover"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Main information */}
              <div className="card-body p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Avatar and basic info */}
                  <div className="flex flex-col items-center md:items-start">
                    <div className="avatar -mt-16 mb-4">
                      <div className="w-24 h-24 rounded-full ring-4 ring-base-100 shadow-xl">
                        <img
                            src={profile.profilePicture || "/placeholder.svg?height=96&width=96"}
                            alt={profile.fullName}
                            className="object-cover"
                        />
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center md:text-left">{profile.fullName}</h2>

                    <div className="flex items-center gap-2 mt-2">
                      <MapPin className="w-4 h-4 text-base-content/60" />
                      <span className="text-base-content/70">{profile.location || "Not specified"}</span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-base-content/60" />
                      <span className="text-base-content/70">
                      Member since {formatDate(profile.createdAt)}
                    </span>
                    </div>
                  </div>

                  {/* Statistics and badges */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        <div className="stat-value text-lg text-primary">{friends.length}</div>
                        <div className="stat-desc">Friends</div>
                      </div>
                      <div className="text-center">
                        <div className="stat-value text-lg text-secondary">4.8</div>
                        <div className="stat-desc">Rating</div>
                      </div>
                      <div className="text-center">
                        <div className="stat-value text-lg text-accent">127</div>
                        <div className="stat-desc">Conversations</div>
                      </div>
                      <div className="text-center">
                        <div className="stat-value text-lg text-success">89%</div>
                        <div className="stat-desc">Response</div>
                      </div>
                    </div>

                    {/* Badges and achievements */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <div className="badge badge-primary gap-1">
                        <Award className="w-3 h-3" />
                        Verified Member
                      </div>
                      <div className="badge badge-secondary gap-1">
                        <Star className="w-3 h-3" />
                        Top Contributor
                      </div>
                      <div className="badge badge-accent gap-1">
                        <Zap className="w-3 h-3" />
                        Active
                      </div>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                        <div className="bg-base-200 rounded-lg p-4">
                          <p className="text-base-content/80 italic">"{profile.bio}"</p>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="card bg-base-100 shadow-xl mb-8 border border-base-300">
            <div className="card-body p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <button
                    onClick={handleSendMessage}
                    className="btn btn-primary gap-2 hover:scale-105 transition-transform"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Message
                </button>

                <button
                    onClick={handleCall}
                    className="btn btn-outline btn-success gap-2 hover:scale-105 transition-transform"
                    disabled={profile.availability === "busy"}
                >
                  <Phone className="w-4 h-4" />
                  Call
                </button>

                <button
                    onClick={handleVideoCall}
                    className="btn btn-outline btn-info gap-2 hover:scale-105 transition-transform"
                    disabled={profile.availability === "busy"}
                >
                  <Video className="w-4 h-4" />
                  Video Call
                </button>

                {isAlreadyFriend ? (
                    <button className="btn btn-success gap-2" disabled>
                      <CheckCircle className="w-4 h-4" />
                      Already Friend
                    </button>
                ) : hasRequestSent ? (
                    <button className="btn btn-warning gap-2" disabled>
                      <Clock className="w-4 h-4" />
                      Request Sent
                    </button>
                ) : (
                    <button
                        onClick={handleSendFriendRequest}
                        disabled={isPending}
                        className="btn btn-secondary gap-2 hover:scale-105 transition-transform"
                    >
                      {isPending ? (
                          <>
                            <span className="loading loading-spinner loading-xs"></span>
                            Sending...
                          </>
                      ) : (
                          <>
                            <UserPlus className="w-4 h-4" />
                            Add Friend
                          </>
                      )}
                    </button>
                )}
              </div>
            </div>
          </div>

          {/* Tab navigation */}
          <div className="tabs tabs-boxed bg-base-100 shadow-xl mb-8 border border-base-300 p-2">
            <button
                className={`tab tab-lg flex-1 gap-2 ${activeTab === "overview" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("overview")}
            >
              <User className="w-4 h-4" />
              Overview
            </button>
            <button
                className={`tab tab-lg flex-1 gap-2 ${activeTab === "languages" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("languages")}
            >
              <Globe className="w-4 h-4" />
              Languages
            </button>
            <button
                className={`tab tab-lg flex-1 gap-2 ${activeTab === "social" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("social")}
            >
              <Share2 className="w-4 h-4" />
              Social
            </button>
          </div>

          {/* Tab content */}
          <div className="space-y-6">
            {activeTab === "overview" && <ProfileInfo profile={profile} isOwnProfile={false} />}

            {activeTab === "languages" && (
                <div className="card bg-base-100 shadow-xl border border-base-300">
                  <div className="card-body p-6">
                    <h3 className="card-title mb-4">Languages & Learning</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="text-lg">🗣️</span>
                          Native Language
                        </h4>
                        <div className="badge badge-primary badge-lg">{profile.nativeLanguage || "Not specified"}</div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <span className="text-lg">📚</span>
                          Learning Language
                        </h4>
                        <div className="badge badge-secondary badge-lg">{profile.learningLanguage || "Not specified"}</div>
                      </div>
                    </div>

                    {profile.interests && profile.interests.length > 0 && (
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">Interests</h4>
                          <div className="flex flex-wrap gap-2">
                            {profile.interests.map((interest, index) => (
                                <span key={index} className="badge badge-outline">
                          {interest}
                        </span>
                            ))}
                          </div>
                        </div>
                    )}
                  </div>
                </div>
            )}

            {activeTab === "social" && <ProfileSocial profile={profile} isOwnProfile={false} />}
          </div>
        </div>

        {/* Report modal */}
        {showReportModal && (
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg mb-4">Report This User</h3>
                <p className="mb-4">Why are you reporting this user?</p>

                <div className="space-y-2 mb-6">
                  <label className="label cursor-pointer">
                    <span className="label-text">Inappropriate content</span>
                    <input type="radio" name="report" className="radio radio-primary" />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Harassment</span>
                    <input type="radio" name="report" className="radio radio-primary" />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Spam</span>
                    <input type="radio" name="report" className="radio radio-primary" />
                  </label>
                  <label className="label cursor-pointer">
                    <span className="label-text">Fake profile</span>
                    <input type="radio" name="report" className="radio radio-primary" />
                  </label>
                </div>

                <textarea
                    className="textarea textarea-bordered w-full mb-4"
                    placeholder="Additional details (optional)"
                ></textarea>

                <div className="modal-action">
                  <button className="btn btn-ghost" onClick={() => setShowReportModal(false)}>
                    Cancel
                  </button>
                  <button
                      className="btn btn-error"
                      onClick={() => {
                        setShowReportModal(false)
                        toast.success("Report submitted")
                      }}
                  >
                    Report
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  )
}
