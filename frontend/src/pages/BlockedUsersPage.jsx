"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getBlockedUsers, unblockUser } from "../lib/api"
import { toast } from "react-hot-toast"
import { SearchIcon, UserXIcon, Shield, AlertTriangle, CheckCircle, Undo2 } from "lucide-react"

const BlockedUsersPage = () => {
  const queryClient = useQueryClient()
  const [searchQuery, setSearchQuery] = useState("")

  const { data: blockedUsers = [], isLoading } = useQuery({
    queryKey: ["blockedUsers"],
    queryFn: getBlockedUsers,
    onError: (error) => {
      toast.error("Failed to load blocked users")
    },
  })

  const { mutate: unblockUserMutation, isPending } = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blockedUsers"] })
      toast.success("User unblocked successfully")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to unblock user")
    },
  })

  const filteredUsers = blockedUsers.filter((user) => user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleUnblock = (userId, userName) => {
    if (window.confirm(`Are you sure you want to unblock ${userName}? They will be able to contact you again.`)) {
      unblockUserMutation(userId)
    }
  }

  if (isLoading) {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-base-content/70 font-medium">Loading blocked users...</p>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-error/10 text-error rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4 mr-2" />
              Privacy & Safety
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-error to-warning bg-clip-text text-transparent">
              Blocked Users
            </h1>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Manage users you've blocked to maintain a safe learning environment
            </p>

            {/* Stats */}
            <div className="stats stats-horizontal shadow-lg mt-8 bg-base-100">
              <div className="stat">
                <div className="stat-figure text-error">
                  <UserXIcon className="w-8 h-8" />
                </div>
                <div className="stat-title">Blocked Users</div>
                <div className="stat-value text-error">{blockedUsers.length}</div>
                <div className="stat-desc">Total blocked</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-warning">
                  <AlertTriangle className="w-8 h-8" />
                </div>
                <div className="stat-title">Safety Level</div>
                <div className="stat-value text-warning">High</div>
                <div className="stat-desc">Protected account</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-success">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div className="stat-title">Status</div>
                <div className="stat-value text-success">Secure</div>
                <div className="stat-desc">Privacy maintained</div>
              </div>
            </div>
          </div>

          {/* Info Alert */}
          <div className="alert alert-info mb-8 shadow-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold mb-1">About Blocked Users</h3>
                <p className="text-sm">
                  Blocked users cannot send you messages, see your profile, or send friend requests. You can unblock them
                  at any time to restore normal interaction.
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          {blockedUsers.length > 0 && (
              <div className="card bg-base-100 shadow-xl mb-8 border border-base-300">
                <div className="card-body p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-xl">
                      <SearchIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Search Blocked Users</h3>
                      <p className="text-sm text-base-content/70">Find specific users in your blocked list</p>
                    </div>
                  </div>

                  <div className="relative">
                    <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="input input-bordered w-full pl-12 input-lg"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {searchQuery && (
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-base-content/70">
                          Showing <span className="font-bold text-primary">{filteredUsers.length}</span> of{" "}
                          <span className="font-bold">{blockedUsers.length}</span> blocked users
                        </p>
                        {filteredUsers.length !== blockedUsers.length && (
                            <button onClick={() => setSearchQuery("")} className="btn btn-ghost btn-sm">
                              Show All
                            </button>
                        )}
                      </div>
                  )}
                </div>
              </div>
          )}

          {/* Results */}
          {blockedUsers.length === 0 ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center py-16">
                  <div className="avatar placeholder mb-6">
                    <div className="bg-success/20 text-success rounded-full w-20">
                      <CheckCircle className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="card-title justify-center text-2xl mb-3 text-success">No blocked users</h3>
                  <p className="text-base-content/70 max-w-md mx-auto mb-6">
                    Great! You haven't blocked any users. Your account is open for positive language learning interactions.
                  </p>
                  <div className="badge badge-success badge-lg gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Clean Account
                  </div>
                </div>
              </div>
          ) : filteredUsers.length === 0 ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center py-16">
                  <div className="avatar placeholder mb-6">
                    <div className="bg-base-300 text-base-content rounded-full w-20">
                      <SearchIcon className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="card-title justify-center text-2xl mb-3">No users found</h3>
                  <p className="text-base-content/70 max-w-md mx-auto mb-6">
                    No blocked users match your search. Try a different search term.
                  </p>
                  <button onClick={() => setSearchQuery("")} className="btn btn-primary">
                    Show All Blocked Users
                  </button>
                </div>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map((user) => (
                    <div
                        key={user._id}
                        className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-error/20"
                    >
                      <div className="card-body p-6">
                        {/* User Info */}
                        <div className="flex items-center gap-4 mb-4">
                          <div className="avatar">
                            <div className="w-16 h-16 rounded-2xl ring ring-error/30 ring-offset-base-100 ring-offset-2 grayscale">
                              <img
                                  src={user.profilePicture || "/default-avatar.png"}
                                  alt={user.fullName}
                                  className="rounded-2xl"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="card-title text-lg mb-1 truncate">{user.fullName}</h3>
                            <div className="badge badge-error badge-sm gap-1">
                              <UserXIcon className="w-3 h-3" />
                              Blocked
                            </div>
                          </div>
                        </div>

                        {/* User Details */}
                        {(user.nativeLanguage || user.learningLanguage) && (
                            <div className="flex flex-wrap gap-2 mb-4 opacity-60">
                              {user.nativeLanguage && (
                                  <div className="badge badge-outline badge-sm">Native: {user.nativeLanguage}</div>
                              )}
                              {user.learningLanguage && (
                                  <div className="badge badge-outline badge-sm">Learning: {user.learningLanguage}</div>
                              )}
                            </div>
                        )}

                        {/* Action Button */}
                        <div className="card-actions justify-stretch mt-auto">
                          <button
                              className="btn btn-success btn-outline w-full gap-2 group"
                              onClick={() => handleUnblock(user._id, user.fullName)}
                              disabled={isPending}
                          >
                            {isPending ? (
                                <>
                                  <span className="loading loading-spinner loading-sm"></span>
                                  Unblocking...
                                </>
                            ) : (
                                <>
                                  <Undo2 className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                                  Unblock User
                                </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
          )}

          {/* Help Section */}
          {blockedUsers.length > 0 && (
              <div className="card bg-base-100 shadow-xl mt-12 border border-info/20">
                <div className="card-body p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-info/10 rounded-2xl">
                      <AlertTriangle className="w-6 h-6 text-info" />
                    </div>
                    <div>
                      <h3 className="card-title text-lg mb-2">Need Help?</h3>
                      <p className="text-base-content/70 mb-4">
                        If you're experiencing harassment or inappropriate behavior, you can report users to our moderation
                        team. Blocking is a personal privacy tool, while reporting helps keep the entire community safe.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <div className="badge badge-info gap-1">
                          <Shield className="w-3 h-3" />
                          Safe Environment
                        </div>
                        <div className="badge badge-success gap-1">
                          <CheckCircle className="w-3 h-3" />
                          24/7 Support
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          )}
        </div>
      </div>
  )
}

export default BlockedUsersPage
