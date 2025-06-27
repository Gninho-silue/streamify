"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getRecommendedUsers, sendFriendRequest, getOutgoingFriendRequests } from "../lib/api"
import {SearchIcon, FilterIcon, UserPlusIcon, CheckCircleIcon, Users, Globe, Sparkles, MapPinIcon} from "lucide-react"
import { getLanguageFlag } from "../components/FriendCard"
import { LANGUAGES } from "../constants"
import { toast } from "react-hot-toast"

const UsersPage = () => {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({
    nativeLanguage: "",
    learningLanguage: "",
    searchQuery: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  })

  // Fetch outgoing friend requests
  const { data: outgoingFriendRequests } = useQuery({
    queryKey: ["outgoingFriendRequests"],
    queryFn: getOutgoingFriendRequests,
  })

  // Get outgoing requests IDs
  const outgoingRequestsIds = new Set(outgoingFriendRequests?.outgoingRequests?.map((req) => req.recipient._id) || [])

  // Send friend request mutation
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Friend request sent successfully!")
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send friend request")
    },
  })

  const filteredUsers = users.filter((user) => {
    const matchesNative =
        !filters.nativeLanguage || user.nativeLanguage.toLowerCase() === filters.nativeLanguage.toLowerCase()
    const matchesLearning =
        !filters.learningLanguage || user.learningLanguage.toLowerCase() === filters.learningLanguage.toLowerCase()
    const matchesSearch =
        !filters.searchQuery ||
        user.fullName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        user.bio?.toLowerCase().includes(filters.searchQuery.toLowerCase())

    return matchesNative && matchesLearning && matchesSearch
  })

  const clearFilters = () => {
    setFilters({
      nativeLanguage: "",
      learningLanguage: "",
      searchQuery: "",
    })
  }

  const hasActiveFilters = filters.nativeLanguage || filters.learningLanguage || filters.searchQuery

  if (isLoading) {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center">
          <div className="text-center">
            <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
            <p className="text-base-content/70 font-medium">Finding language partners...</p>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-base-200">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              <Globe className="w-4 h-4 mr-2" />
              Language Exchange Community
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Find Your Perfect Language Partner
            </h1>
            <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
              Connect with native speakers and fellow learners from around the world
            </p>
            <div className="stats stats-horizontal shadow-lg mt-8 bg-base-100">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <Users className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Users</div>
                <div className="stat-value text-primary">{users.length}</div>
                <div className="stat-desc">Active learners</div>
              </div>
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="stat-title">Matches Found</div>
                <div className="stat-value text-secondary">{filteredUsers.length}</div>
                <div className="stat-desc">Perfect for you</div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="card bg-base-100 shadow-xl mb-8 border border-base-300">
            <div className="card-body p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <FilterIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Find Your Match</h3>
                    <p className="text-sm text-base-content/70">Filter by languages and interests</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {hasActiveFilters && (
                      <button onClick={clearFilters} className="btn btn-ghost btn-sm">
                        Clear Filters
                      </button>
                  )}
                  <button onClick={() => setShowFilters(!showFilters)} className="btn btn-primary btn-sm sm:hidden">
                    <FilterIcon className="w-4 h-4 mr-2" />
                    {showFilters ? "Hide" : "Show"} Filters
                  </button>
                </div>
              </div>

              <div className={`space-y-4 ${showFilters ? "block" : "hidden sm:block"}`}>
                {/* Search Bar */}
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
                  <input
                      type="text"
                      placeholder="Search by name, bio, or interests..."
                      className="input input-bordered w-full pl-12 input-lg"
                      value={filters.searchQuery}
                      onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
                  />
                </div>

                {/* Language Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Native Language</span>
                    </label>
                    <select
                        className="select select-bordered select-lg"
                        value={filters.nativeLanguage}
                        onChange={(e) => setFilters((prev) => ({ ...prev, nativeLanguage: e.target.value }))}
                    >
                      <option value="">All Native Languages</option>
                      {LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Learning Language</span>
                    </label>
                    <select
                        className="select select-bordered select-lg"
                        value={filters.learningLanguage}
                        onChange={(e) => setFilters((prev) => ({ ...prev, learningLanguage: e.target.value }))}
                    >
                      <option value="">All Learning Languages</option>
                      {LANGUAGES.map((lang) => (
                          <option key={lang} value={lang}>
                            {lang}
                          </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {filters.searchQuery && (
                          <div className="badge badge-primary gap-2">
                            Search: {filters.searchQuery}
                            <button
                                onClick={() => setFilters((prev) => ({ ...prev, searchQuery: "" }))}
                                className="btn btn-ghost btn-xs"
                            >
                              ×
                            </button>
                          </div>
                      )}
                      {filters.nativeLanguage && (
                          <div className="badge badge-secondary gap-2">
                            Native: {filters.nativeLanguage}
                            <button
                                onClick={() => setFilters((prev) => ({ ...prev, nativeLanguage: "" }))}
                                className="btn btn-ghost btn-xs"
                            >
                              ×
                            </button>
                          </div>
                      )}
                      {filters.learningLanguage && (
                          <div className="badge badge-accent gap-2">
                            Learning: {filters.learningLanguage}
                            <button
                                onClick={() => setFilters((prev) => ({ ...prev, learningLanguage: "" }))}
                                className="btn btn-ghost btn-xs"
                            >
                              ×
                            </button>
                          </div>
                      )}
                    </div>
                )}
              </div>
            </div>
          </div>

          {/* Results */}
          {filteredUsers.length === 0 ? (
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body text-center py-16">
                  <div className="avatar placeholder mb-6">
                    <div className="bg-base-300 text-base-content rounded-full w-20">
                      <Users className="w-10 h-10" />
                    </div>
                  </div>
                  <h3 className="card-title justify-center text-2xl mb-3">No language partners found</h3>
                  <p className="text-base-content/70 max-w-md mx-auto mb-6">
                    Try adjusting your filters or search terms to discover more language exchange opportunities.
                  </p>
                  {hasActiveFilters && (
                      <button onClick={clearFilters} className="btn btn-primary">
                        Clear All Filters
                      </button>
                  )}
                </div>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredUsers.map((user) => {
                  const hasRequestSent = outgoingRequestsIds.has(user._id)
                  return (
                      <div
                          key={user._id}
                          className="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-500 border border-base-300 hover:border-primary/20 group"
                      >
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                        <div className="card-body p-6 relative">
                          {/* User Header */}
                          <div className="flex items-start gap-4 mb-4">
                            <div className="avatar">
                              <div className="w-16 h-16 rounded-2xl ring ring-base-300 ring-offset-base-100 ring-offset-2 group-hover:ring-primary/30 transition-all duration-300">
                                <img
                                    src={user.profilePicture || "/default-avatar.png"}
                                    alt={user.fullName}
                                    className="rounded-2xl group-hover:scale-110 transition-transform duration-500"
                                />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="card-title text-lg mb-1 group-hover:text-primary transition-colors duration-300 truncate">
                                {user.fullName}
                              </h3>
                              {user.location && (
                                  <div className="badge badge-outline badge-sm gap-1">
                                    <div className="w-2 h-2 bg-current rounded-full" />
                                    <MapPinIcon />
                                    {user.location}
                                  </div>
                              )}
                            </div>
                          </div>

                          {/* Language Badges */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <div className="badge badge-primary gap-2 font-medium">
                              {getLanguageFlag(user.nativeLanguage)}
                              <span className="font-bold">Native:</span>
                              {user.nativeLanguage}
                            </div>
                            <div className="badge badge-secondary gap-2 font-medium">
                              {getLanguageFlag(user.learningLanguage)}
                              <span className="font-bold">Learning:</span>
                              {user.learningLanguage}
                            </div>
                          </div>

                          {/* Bio */}
                          {user.bio && (
                              <p className="text-sm text-base-content/70 mb-5 leading-relaxed line-clamp-3">
                                {user.bio.length > 120 ? `${user.bio.slice(0, 120)}...` : user.bio}
                              </p>
                          )}

                          {/* Action Button */}
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
                                disabled={hasRequestSent || isPending}
                            >
                              {hasRequestSent ? (
                                  <>
                                    <CheckCircleIcon className="w-4 h-4" />
                                    Request Sent
                                  </>
                              ) : isPending ? (
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
        </div>
      </div>
  )
}

export default UsersPage
