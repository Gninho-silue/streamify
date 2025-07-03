"use client"

import {useState} from "react"
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {blockUser, getMyFriends} from "../lib/api"
import FriendCard from "../components/FriendCard"
import NoFriendsFound from "../components/NoFriendsFound"
import {FilterIcon, Globe, Heart, SearchIcon, SortAscIcon, SortDescIcon, Users} from "lucide-react"
import {toast} from "react-hot-toast";

const FriendsPage = () => {
    const queryClient = useQueryClient()
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("name")
    const [sortOrder, setSortOrder] = useState("asc")
    const [filterByLanguage, setFilterByLanguage] = useState("")
    const [showFilters, setShowFilters] = useState(false)
    const [pendingActionId, setPendingActionId] = useState(null)
    const [currentAction, setCurrentAction] = useState(null)

    const { data: friends = [], isLoading } = useQuery({
        queryKey: ["friends"],
        queryFn: getMyFriends,
    })

    // Block user mutation
    const { mutate: blockUserMutation, isPending } = useMutation({
        mutationFn: blockUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["friends"] })
            queryClient.invalidateQueries({ queryKey: ["blockedUsers"] })
            toast.success("User blocked successfully")
            setPendingActionId(null)
            setCurrentAction(null)
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to block user")
            setPendingActionId(null)
            setCurrentAction(null)
        },
    })

    // Handle card actions
    const handleCardAction = (actionType, userId, userName) => {
        if (actionType === 'block') {
            if (window.confirm(`Are you sure you want to block ${userName}? You will not be able to message them or see their profile.`)) {
                setPendingActionId(userId)
                setCurrentAction('block')
                blockUserMutation(userId)
            }
        }
    }

    // Get unique languages for filter
    const uniqueLanguages = [...new Set(friends.flatMap((friend) => [friend.nativeLanguage, friend.learningLanguage]))]

    // Filter and sort friends
    const filteredAndSortedFriends = friends
        .filter((friend) => {
            const matchesSearch =
                !searchQuery ||
                friend.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                friend.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                friend.location?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesLanguage =
                !filterByLanguage || friend.nativeLanguage === filterByLanguage || friend.learningLanguage === filterByLanguage

            return matchesSearch && matchesLanguage
        })
        .sort((a, b) => {
            let comparison = 0

            switch (sortBy) {
                case "name":
                    comparison = a.fullName.localeCompare(b.fullName)
                    break
                case "language":
                    comparison = a.nativeLanguage.localeCompare(b.nativeLanguage)
                    break
                case "status":
                    const statusOrder = { available: 0, busy: 1, away: 2 }
                    comparison = (statusOrder[a.availability] || 3) - (statusOrder[b.availability] || 3)
                    break
                default:
                    comparison = 0
            }

            return sortOrder === "asc" ? comparison : -comparison
        })

    const toggleSort = () => {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }

    const clearFilters = () => {
        setSearchQuery("")
        setFilterByLanguage("")
        setSortBy("name")
        setSortOrder("asc")
    }

    const hasActiveFilters = searchQuery || filterByLanguage || sortBy !== "name" || sortOrder !== "asc"

    // Statistics
    const availableFriends = friends.filter((f) => f.availability === "available").length
    const totalLanguages = uniqueLanguages.length

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="text-center">
                    <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
                    <p className="text-base-content/70 font-medium">Loading your friends...</p>
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
                        <Heart className="w-4 h-4 mr-2" />
                        Your Language Learning Network
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        My Learning Partners
                    </h1>
                    <p className="text-xl text-base-content/70 max-w-2xl mx-auto">
                        Connect, practice, and grow together with your language exchange friends
                    </p>

                    {/* Stats */}
                    {friends.length > 0 && (
                        <div className="stats stats-horizontal shadow-lg mt-8 bg-base-100">
                            <div className="stat">
                                <div className="stat-figure text-primary">
                                    <Users className="w-8 h-8" />
                                </div>
                                <div className="stat-title">Total Friends</div>
                                <div className="stat-value text-primary">{friends.length}</div>
                                <div className="stat-desc">Language partners</div>
                            </div>
                            <div className="stat">
                                <div className="stat-figure text-success">
                                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                                    </div>
                                </div>
                                <div className="stat-title">Available Now</div>
                                <div className="stat-value text-success">{availableFriends}</div>
                                <div className="stat-desc">Ready to chat</div>
                            </div>
                            <div className="stat">
                                <div className="stat-figure text-secondary">
                                    <Globe className="w-8 h-8" />
                                </div>
                                <div className="stat-title">Languages</div>
                                <div className="stat-value text-secondary">{totalLanguages}</div>
                                <div className="stat-desc">Different languages</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Search and Filters */}
                {friends.length > 0 && (
                    <div className="card bg-base-100 shadow-xl mb-8 border border-base-300">
                        <div className="card-body p-6">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <SearchIcon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Find Friends</h3>
                                        <p className="text-sm text-base-content/70">Search and organize your connections</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {hasActiveFilters && (
                                        <button onClick={clearFilters} className="btn btn-ghost btn-sm">
                                            Clear All
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
                                        placeholder="Search by name, status, or location..."
                                        className="input input-bordered w-full pl-12 input-lg"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>

                                {/* Filters and Sort */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Filter by Language</span>
                                        </label>
                                        <select
                                            className="select select-bordered"
                                            value={filterByLanguage}
                                            onChange={(e) => setFilterByLanguage(e.target.value)}
                                        >
                                            <option value="">All Languages</option>
                                            {uniqueLanguages.map((lang) => (
                                                <option key={lang} value={lang}>
                                                    {lang}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Sort by</span>
                                        </label>
                                        <select
                                            className="select select-bordered"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option value="name">Name</option>
                                            <option value="language">Native Language</option>
                                            <option value="status">Availability</option>
                                        </select>
                                    </div>

                                    <div className="form-control">
                                        <label className="label">
                                            <span className="label-text font-medium">Order</span>
                                        </label>
                                        <button onClick={toggleSort} className="btn btn-outline gap-2">
                                            {sortOrder === "asc" ? <SortAscIcon className="w-4 h-4" /> : <SortDescIcon className="w-4 h-4" />}
                                            {sortOrder === "asc" ? "Ascending" : "Descending"}
                                        </button>
                                    </div>
                                </div>

                                {/* Active Filters Display */}
                                {hasActiveFilters && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {searchQuery && (
                                            <div className="badge badge-primary gap-2">
                                                Search: {searchQuery}
                                                <button onClick={() => setSearchQuery("")} className="btn btn-ghost btn-xs">
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                        {filterByLanguage && (
                                            <div className="badge badge-secondary gap-2">
                                                Language: {filterByLanguage}
                                                <button onClick={() => setFilterByLanguage("")} className="btn btn-ghost btn-xs">
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                        {sortBy !== "name" && (
                                            <div className="badge badge-accent gap-2">
                                                Sort: {sortBy}
                                                <button onClick={() => setSortBy("name")} className="btn btn-ghost btn-xs">
                                                    ×
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Results */}
                {!friends || friends.length === 0 ? (
                    <NoFriendsFound />
                ) : filteredAndSortedFriends.length === 0 ? (
                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body text-center py-16">
                            <div className="avatar placeholder mb-6">
                                <div className="bg-base-300 text-base-content rounded-full w-20">
                                    <SearchIcon className="w-10 h-10" />
                                </div>
                            </div>
                            <h3 className="card-title justify-center text-2xl mb-3">No friends match your search</h3>
                            <p className="text-base-content/70 max-w-md mx-auto mb-6">
                                Try adjusting your search terms or filters to find your language partners.
                            </p>
                            {hasActiveFilters && (
                                <button onClick={clearFilters} className="btn btn-primary">
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Results Count */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-base-content/70">
                                Showing <span className="font-bold text-primary">{filteredAndSortedFriends.length}</span> of{" "}
                                <span className="font-bold">{friends.length}</span> friends
                            </p>
                            {filteredAndSortedFriends.length !== friends.length && (
                                <button onClick={clearFilters} className="btn btn-ghost btn-sm">
                                    Show All Friends
                                </button>
                            )}
                        </div>


                        {/* Friends list */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAndSortedFriends.map((friend) => (
                                <FriendCard
                                    key={friend._id}
                                    user={friend}
                                    cardType="friend"
                                    onAction={handleCardAction}
                                    isPending={isPending && pendingActionId === friend._id}
                                    pendingAction={currentAction}
                                />
                            ))}
                        </div>


                    </>
                )}
            </div>
        </div>
    )
}

export default FriendsPage
