"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { getOutgoingFriendRequests, getRecommendedUsers, getMyFriends, sendFriendRequest } from "../lib/api"
import { Link } from "react-router"
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, Users, Sparkles, ArrowRight, Globe } from "lucide-react"
import { getLanguageFlag } from "../components/FriendCard"
import FriendCard from "../components/FriendCard"
import NoFriendsFound from "../components/NoFriendsFound"
import { toast } from "react-hot-toast"
import { capitalize } from "../lib/utils"

const HomePage = () => {
  const queryClient = useQueryClient()
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set())
  const [loadingUserIds, setLoadingUserIds] = useState(new Set())

  // Fetch user's friends
  const {
    data: friends = [],
    isLoading: loadingFriends,
    error: friendsError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getMyFriends,
  })

  // Fetch recommended users for language exchange
  const {
    data: recommendedUsers = [],
    isLoading: loadingUsers,
    error: usersError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  })

  // Fetch outgoing friend requests
  const { data: outgoingFriendRequests, error: requestsError } = useQuery({
    queryKey: ["outgoingFriendRequests"],
    queryFn: getOutgoingFriendRequests,
  })

  // Update outgoing requests IDs when the data changes
  useEffect(() => {
    const outgoingIds = new Set()
    if (outgoingFriendRequests?.outgoingRequests?.length > 0) {
      outgoingFriendRequests.outgoingRequests.forEach((req) => {
        outgoingIds.add(req.recipient._id)
      })
      setOutgoingRequestsIds(outgoingIds)
    }
  }, [outgoingFriendRequests])

  // Mutation to send a friend request
  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: (userId) => {
      setLoadingUserIds((prev) => new Set([...prev, userId]))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Friend request sent successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send friend request")
    },
    onSettled: (_, __, userId) => {
      setLoadingUserIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    },
  })

  // Show error states if any API calls fail
  if (friendsError || usersError || requestsError) {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
          <div className="card bg-base-100 shadow-2xl max-w-md w-full">
            <div className="card-body text-center">
              <div className="avatar placeholder mb-4">
                <div className="bg-error text-error-content rounded-full w-16">
                  <span className="text-2xl">!</span>
                </div>
              </div>
              <h3 className="card-title justify-center text-error mb-2">Something went wrong</h3>
              <p className="text-base-content/70 mb-6">
                We're having trouble loading your data. Please try refreshing the page or contact support if the problem
                persists.
              </p>
              <div className="card-actions justify-center">
                <button onClick={() => window.location.reload()} className="btn btn-primary">
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="hero bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 rounded-3xl mb-12">
            <div className="hero-content text-center py-16">
              <div className="max-w-4xl">
                <div className="badge badge-primary badge-lg gap-2 mb-6">
                  <Globe className="w-4 h-4" />
                  Language Exchange Platform
                </div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Connect & Learn Together
                </h1>
                <p className="text-xl text-base-content/80 max-w-2xl mx-auto leading-relaxed">
                  Build meaningful connections with language learners worldwide and accelerate your learning journey
                </p>
              </div>
            </div>
          </div>

          {/* Friends Section */}
          <section className="mb-16">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-2xl w-12">
                    <Users className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1">My Learning Partners</h2>
                  <p className="text-base-content/70">Stay connected with your language exchange friends</p>
                </div>
              </div>
              <Link to="/friends" className="btn btn-outline btn-primary gap-2 group">
                View All Friends
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {loadingFriends ? (
                <div className="flex justify-center py-16">
                  <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                    <p className="text-base-content/70 font-medium">Loading your friends...</p>
                  </div>
                </div>
            ) : !friends || friends.length === 0 ? (
                <NoFriendsFound />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {friends.slice(0, 4).map((friend) => (
                      <FriendCard key={friend._id} friend={friend} />
                  ))}
                </div>
            )}
          </section>

          {/* Recommended Users Section */}
          <section className="mb-16">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-secondary text-secondary-content rounded-2xl w-12">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-1">Discover New Learners</h2>
                  <p className="text-base-content/70">Perfect language exchange matches curated for you</p>
                </div>
              </div>
              <Link to="/users" className="btn btn-outline btn-secondary gap-2 group">
                Explore All Users
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>

            {loadingUsers ? (
                <div className="flex justify-center py-16">
                  <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-secondary mb-4"></span>
                    <p className="text-base-content/70 font-medium">Finding perfect matches...</p>
                  </div>
                </div>
            ) : recommendedUsers.length === 0 ? (
                <div className="card bg-base-100 shadow-lg">
                  <div className="card-body text-center py-12">
                    <div className="avatar placeholder mb-6">
                      <div className="bg-base-300 text-base-content rounded-full w-20">
                        <Users className="w-10 h-10" />
                      </div>
                    </div>
                    <h3 className="card-title justify-center mb-3">No recommendations yet</h3>
                    <p className="text-base-content/70 max-w-md mx-auto">
                      We're working on finding the perfect language exchange partners for you. Check back soon for
                      personalized recommendations!
                    </p>
                  </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recommendedUsers.slice(0, 4).map((user) => {
                    const hasRequestSent = outgoingRequestsIds.has(user._id)
                    const isLoading = loadingUserIds.has(user._id)
                    return (
                        <div
                            key={user._id}
                            className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-500 border border-base-300 hover:border-secondary/20 group"
                        >
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                          <div className="card-body p-6 relative">
                            {/* User header */}
                            <div className="flex items-start gap-4 mb-4">
                              <div className="avatar">
                                <div className="w-16 h-16 rounded-2xl ring ring-base-300 ring-offset-base-100 ring-offset-2 group-hover:ring-secondary/30 transition-all duration-300">
                                  <img
                                      src={user.profilePicture || "/default-avatar.png"}
                                      alt={user.fullName}
                                      className="rounded-2xl group-hover:scale-110 transition-transform duration-500"
                                  />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="card-title text-lg mb-1 group-hover:text-secondary transition-colors duration-300 truncate">
                                  {user.fullName}
                                </h3>
                                {user.location && (
                                    <div className="badge badge-outline badge-sm gap-1">
                                      <MapPinIcon className="w-3 h-3" />
                                      {user.location}
                                    </div>
                                )}
                              </div>
                            </div>

                            {/* Language badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                              <div className="badge badge-primary gap-2 font-medium">
                                {getLanguageFlag(user.nativeLanguage)}
                                <span className="font-bold">Native:</span>
                                {capitalize(user.nativeLanguage)}
                              </div>
                              <div className="badge badge-secondary gap-2 font-medium">
                                {getLanguageFlag(user.learningLanguage)}
                                <span className="font-bold">Learning:</span>
                                {capitalize(user.learningLanguage)}
                              </div>
                            </div>

                            {/* Bio */}
                            {user.bio && (
                                <p className="text-sm text-base-content/70 mb-5 leading-relaxed line-clamp-3">
                                  {user.bio.length > 120 ? `${user.bio.slice(0, 120)}...` : user.bio}
                                </p>
                            )}

                            {/* Action button */}
                            <div className="card-actions justify-stretch mt-auto">
                              <button
                                  className={`btn w-full gap-2 group/btn ${
                                      hasRequestSent ? "btn-success btn-disabled" : "btn-primary"
                                  }`}
                                  onClick={() => {
                                    if (!hasRequestSent) {
                                      sendRequestMutation(user._id)
                                    }
                                  }}
                                  disabled={hasRequestSent || isLoading}
                              >
                                {hasRequestSent ? (
                                    <>
                                      <CheckCircleIcon className="w-4 h-4" />
                                      Request Sent
                                    </>
                                ) : isLoading ? (
                                    <>
                                      <span className="loading loading-spinner loading-sm"></span>
                                      Sending...
                                    </>
                                ) : (
                                    <>
                                      <UserPlusIcon className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-200" />
                                      Connect & Learn
                                    </>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                    )
                  })}
                </div>
            )}
          </section>
        </div>
      </div>
  )
}

export default HomePage
