"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { acceptFriendRequest, getFriendRequests, getNotifications, markAsRead, markAllAsRead } from "../lib/api"
import {
  BellIcon,
  ClockIcon,
  MessageSquareIcon,
  UserCheckIcon,
  CheckIcon,
  Users,
  Sparkles,
  CheckCircleIcon,
} from "lucide-react"
import { toast } from "react-hot-toast"
import NoNotificationsFound from "../components/NoNotificationsFound"

const NotificationPage = () => {
  const queryClient = useQueryClient()

  // Fetch all notifications
  const { data: notifications = [], isLoading: loadingNotifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
    onError: (error) => {
      console.error("Error fetching notifications:", error)
      toast.error("Failed to load notifications")
    },
  })

  // Fetch friend requests
  const { data: friendRequests, isLoading: loadingFriendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
    onError: (error) => {
      console.error("Error fetching friend requests:", error)
      toast.error("Failed to load friend requests")
    },
  })

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] })
      queryClient.invalidateQueries({ queryKey: ["friends"] })
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] })
      toast.success("Friend request accepted successfully!")
    },
    onError: (error) => {
      console.error("Error accepting friend request:", error)
      toast.error(error.response?.data?.message || "Failed to accept friend request")
    },
  })

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] })
    },
  })

  const { mutate: markAllAsReadMutation } = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
      queryClient.invalidateQueries({ queryKey: ["unreadNotifications"] })
      toast.success("All notifications marked as read")
    },
  })

  const handleMarkAsRead = (notificationId) => {
    markAsReadMutation(notificationId)
  }

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation()
  }

  const incomingRequests = friendRequests?.incomingRequests || []
  const acceptedRequests = friendRequests?.acceptedRequests || []

  const unreadNotifications = notifications.filter((n) => !n.read)
  const readNotifications = notifications.filter((n) => n.read)

  const isLoading = loadingNotifications || loadingFriendRequests

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return "Just now"
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <BellIcon className="w-4 h-4 mr-2" />
              Notification Center
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Stay Connected
            </h1>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Keep track of your language learning journey and connections
            </p>

            {/* Stats */}
            <div className="stats stats-horizontal shadow-lg mt-8 bg-base-100">
              <div className="stat">
                <div className="stat-figure text-error">
                  <BellIcon className="w-8 h-8" />
                </div>
                <div className="stat-title">Unread</div>
                <div className="stat-value text-error">{unreadNotifications.length}</div>
                <div className="stat-desc">New notifications</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-primary">
                  <UserCheckIcon className="w-8 h-8" />
                </div>
                <div className="stat-title">Requests</div>
                <div className="stat-value text-primary">{incomingRequests.length}</div>
                <div className="stat-desc">Friend requests</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-success">
                  <Users className="w-8 h-8" />
                </div>
                <div className="stat-title">Connections</div>
                <div className="stat-value text-success">{acceptedRequests.length}</div>
                <div className="stat-desc">New friends</div>
              </div>
            </div>

            {/* Mark All as Read Button */}
            {unreadNotifications.length > 0 && (
                <div className="mt-6">
                  <button onClick={handleMarkAllAsRead} className="btn btn-primary gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    Mark All as Read ({unreadNotifications.length})
                  </button>
                </div>
            )}
          </div>

          {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="text-center">
                  <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                  <p className="text-base-content/70 font-medium">Loading your notifications...</p>
                </div>
              </div>
          ) : (
              <div className="space-y-8">
                {/* Pending Friend Requests */}
                {incomingRequests.length > 0 && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-primary/10 rounded-2xl">
                          <UserCheckIcon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">Friend Requests</h2>
                          <p className="text-base-content/70">People who want to connect with you</p>
                        </div>
                        <div className="badge badge-primary badge-lg ml-auto">{incomingRequests.length}</div>
                      </div>

                      <div className="grid gap-4">
                        {incomingRequests.map((request) => (
                            <div
                                key={request._id}
                                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-primary/20"
                            >
                              <div className="card-body p-6">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className="avatar">
                                      <div className="w-16 h-16 rounded-2xl ring ring-primary/30 ring-offset-base-100 ring-offset-2">
                                        <img
                                            src={request.sender.profilePicture || "/placeholder.svg"}
                                            alt={request.sender.fullName}
                                            className="rounded-2xl"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="card-title text-lg mb-1">{request.sender.fullName}</h3>
                                      <p className="text-base-content/70 mb-2">Wants to be your language partner</p>
                                      <div className="flex flex-wrap gap-2">
                                        <div className="badge badge-primary gap-1">
                                          <span className="font-bold">Native:</span>
                                          {request.sender.nativeLanguage}
                                        </div>
                                        <div className="badge badge-secondary gap-1">
                                          <span className="font-bold">Learning:</span>
                                          {request.sender.learningLanguage}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                      onClick={() => acceptRequestMutation(request._id)}
                                      disabled={isPending}
                                      className="btn btn-primary gap-2"
                                  >
                                    {isPending ? (
                                        <>
                                          <span className="loading loading-spinner loading-sm"></span>
                                          Accepting...
                                        </>
                                    ) : (
                                        <>
                                          <CheckIcon className="w-4 h-4" />
                                          Accept
                                        </>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                    </section>
                )}

                {/* Unread Notifications */}
                {unreadNotifications.length > 0 && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-error/10 rounded-2xl">
                          <BellIcon className="w-6 h-6 text-error" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">New Notifications</h2>
                          <p className="text-base-content/70">Recent updates and messages</p>
                        </div>
                        <div className="badge badge-error badge-lg ml-auto animate-pulse">{unreadNotifications.length}</div>
                      </div>

                      <div className="grid gap-4">
                        {unreadNotifications.map((notification) => (
                            <div
                                key={notification._id}
                                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-error"
                            >
                              <div className="card-body p-6">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start gap-4 flex-1">
                                    {notification.sender && (
                                        <div className="avatar">
                                          <div className="w-12 h-12 rounded-2xl">
                                            <img
                                                src={notification.sender.profilePicture || "/placeholder.svg"}
                                                alt={notification.sender.fullName}
                                                className="rounded-2xl"
                                            />
                                          </div>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                      <h3 className="font-bold text-lg mb-1">{notification.title}</h3>
                                      <p className="text-base-content/70 mb-2">{notification.message}</p>
                                      <div className="flex items-center gap-2 text-sm text-base-content/60">
                                        <ClockIcon className="w-4 h-4" />
                                        {formatDate(notification.createdAt)}
                                      </div>
                                    </div>
                                  </div>
                                  <button
                                      onClick={() => handleMarkAsRead(notification._id)}
                                      className="btn btn-ghost btn-sm gap-2 hover:btn-primary"
                                  >
                                    <CheckIcon className="w-4 h-4" />
                                    Mark Read
                                  </button>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                    </section>
                )}

                {/* New Connections */}
                {acceptedRequests.length > 0 && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-success/10 rounded-2xl">
                          <Sparkles className="w-6 h-6 text-success" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">New Connections</h2>
                          <p className="text-base-content/70">Your latest language learning partnerships</p>
                        </div>
                        <div className="badge badge-success badge-lg ml-auto">{acceptedRequests.length}</div>
                      </div>

                      <div className="grid gap-4">
                        {acceptedRequests.map((request) => {
                          const isReceived = request.type === "received"
                          const user = isReceived ? request.sender : request.recipient
                          const message = isReceived ? "You are now friends!" : "Accepted your friend request!"

                          return (
                              <div
                                  key={request._id}
                                  className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-success/20"
                              >
                                <div className="card-body p-6">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="avatar">
                                        <div className="w-12 h-12 rounded-2xl ring ring-success/30 ring-offset-base-100 ring-offset-2">
                                          <img
                                              src={user.profilePicture || "/placeholder.svg"}
                                              alt={user.fullName}
                                              className="rounded-2xl"
                                          />
                                        </div>
                                      </div>
                                      <div>
                                        <h3 className="font-bold text-lg mb-1">{user.fullName}</h3>
                                        <p className="text-base-content/70 mb-2">{message}</p>
                                        <div className="flex items-center gap-2 text-sm text-base-content/60">
                                          <ClockIcon className="w-4 h-4" />
                                          {formatDate(request.updatedAt)}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="badge badge-success gap-2">
                                      <MessageSquareIcon className="w-4 h-4" />
                                      Connected
                                    </div>
                                  </div>
                                </div>
                              </div>
                          )
                        })}
                      </div>
                    </section>
                )}

                {/* Read Notifications */}
                {readNotifications.length > 0 && (
                    <section className="space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-base-300/50 rounded-2xl">
                          <CheckCircleIcon className="w-6 h-6 text-base-content/60" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">Previous Notifications</h2>
                          <p className="text-base-content/70">Your notification history</p>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        {readNotifications.map((notification) => (
                            <div
                                key={notification._id}
                                className="card bg-base-100 shadow-sm hover:shadow-md transition-all duration-300 opacity-75 hover:opacity-100"
                            >
                              <div className="card-body p-6">
                                <div className="flex items-start gap-4">
                                  {notification.sender && (
                                      <div className="avatar">
                                        <div className="w-10 h-10 rounded-2xl">
                                          <img
                                              src={notification.sender.profilePicture || "/placeholder.svg"}
                                              alt={notification.sender.fullName}
                                              className="rounded-2xl"
                                          />
                                        </div>
                                      </div>
                                  )}
                                  <div className="flex-1">
                                    <h3 className="font-semibold mb-1">{notification.title}</h3>
                                    <p className="text-sm text-base-content/70 mb-2">{notification.message}</p>
                                    <div className="flex items-center gap-2 text-xs text-base-content/60">
                                      <ClockIcon className="w-3 h-3" />
                                      {formatDate(notification.createdAt)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                    </section>
                )}

                {/* No Notifications */}
                {notifications.length === 0 && incomingRequests.length === 0 && acceptedRequests.length === 0 && (
                    <NoNotificationsFound />
                )}
              </div>
          )}
        </div>
      </div>
  )
}

export default NotificationPage
