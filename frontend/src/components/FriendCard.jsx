"use client"

import { Link } from "react-router"
import { LANGUAGE_TO_FLAG } from "../constants"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { blockUser } from "../lib/api"
import { toast } from "react-hot-toast"
import { BanIcon, MapPinIcon, MessageCircle, Sparkles } from "lucide-react"
import { useMemo, useState } from "react"

export const getLanguageFlag = (language) => {
  if (!language) return null

  const langKey = language.toLowerCase()
  const countryCode = LANGUAGE_TO_FLAG[langKey] || null
  if (!countryCode) return null

  return (
      <img
          src={`https://flagcdn.com/w20/${countryCode}.png`}
          alt={`Flag of ${language}`}
          className="inline-block w-4 h-4 mr-1.5 rounded-sm"
          onError={(e) => {
            e.target.style.display = "none"
          }}
      />
  )
}

const FriendCard = ({ friend }) => {
  const queryClient = useQueryClient()
  const [imageError, setImageError] = useState(false)

  const { mutate: blockUserMutation, isPending } = useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] })
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] })
      toast.success("User blocked successfully")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to block user")
    },
  })

  const nativeLanguageFlag = useMemo(() => getLanguageFlag(friend.nativeLanguage), [friend.nativeLanguage])
  const learningLanguageFlag = useMemo(() => getLanguageFlag(friend.learningLanguage), [friend.learningLanguage])

  const handleBlockUser = () => {
    if (
        window.confirm(
            "Are you sure you want to block this user? You will not be able to message them or see their profile.",
        )
    ) {
      blockUserMutation(friend._id)
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

  return (
      <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-500 border border-base-300 hover:border-primary/20 group">
        {/* Gradient overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

        <div className="card-body p-6 relative">
          {/* Header with avatar and basic info */}
          <div className="flex items-start gap-4 mb-4">
            <div className="avatar indicator">
              <div className="w-16 h-16 rounded-2xl ring ring-base-300 ring-offset-base-100 ring-offset-2 group-hover:ring-primary/30 transition-all duration-300">
                <img
                    src={imageError ? "/default-avatar.png" : friend.profilePicture || "/default-avatar.png"}
                    alt={`${friend.fullName}'s profile picture`}
                    className="rounded-2xl group-hover:scale-110 transition-transform duration-500"
                    onError={handleImageError}
                />
              </div>
              {friend.availability && (
                  <span
                      className={`indicator-item badge badge-sm ${getAvailabilityBadgeClass(friend.availability)} border-2 border-base-100`}
                  >
                {friend.availability === "available" ? "●" : friend.availability === "busy" ? "●" : "●"}
              </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="card-title text-lg mb-1 group-hover:text-primary transition-colors duration-300 truncate">
                {friend.fullName}
              </h3>
              {friend.status && (
                  <p className="text-sm text-base-content/70 line-clamp-2 leading-relaxed">{friend.status}</p>
              )}
            </div>
          </div>

          {/* Language badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="badge badge-primary badge-lg gap-2 font-medium">
              {nativeLanguageFlag}
              <span className="font-bold">Native:</span>
              {friend.nativeLanguage}
            </div>
            <div className="badge badge-secondary badge-lg gap-2 font-medium">
              {learningLanguageFlag}
              <span className="font-bold">Learning:</span>
              {friend.learningLanguage}
            </div>
          </div>

          {/* Additional info badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {friend.location && (
                <div className="badge badge-outline gap-2">
                  <MapPinIcon className="w-3 h-3" />
                  {friend.location}
                </div>
            )}
            {friend.availability && (
                <div className={`badge ${getAvailabilityBadgeClass(friend.availability)} gap-2`}>
                  <div className="w-2 h-2 rounded-full bg-current" />
                  {friend.availability}
                </div>
            )}
          </div>

          {/* Interests */}
          {friend.interests && friend.interests.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-4 h-4 text-base-content/60" />
                  <span className="text-xs font-bold text-base-content/60 uppercase tracking-wider">Interests</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {friend.interests.slice(0, 4).map((interest, index) => (
                      <span key={index} className="badge badge-accent badge-sm">
                  {interest}
                </span>
                  ))}
                  {friend.interests.length > 4 && (
                      <span className="badge badge-ghost badge-sm">+{friend.interests.length - 4} more</span>
                  )}
                </div>
              </div>
          )}

          {/* Action buttons */}
          <div className="card-actions justify-stretch gap-2 mt-auto">
            <Link
                to={`/chat/${friend._id}`}
                className="btn btn-primary flex-1 gap-2 group/btn"
                aria-label={`Send message to ${friend.fullName}`}
            >
              <MessageCircle className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
              Message
            </Link>
            <button
                onClick={handleBlockUser}
                disabled={isPending}
                className="btn btn-outline btn-error gap-2 group/block"
                aria-label={`Block ${friend.fullName}`}
            >
              {isPending ? (
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
          </div>
        </div>
      </div>
  )
}

export default FriendCard
