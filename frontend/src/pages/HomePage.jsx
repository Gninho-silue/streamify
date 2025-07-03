"use client"

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query"
import {useEffect, useState} from "react"
import {
  blockUser,
  getMyFriends,
  getOutgoingFriendRequests,
  getRecommendedUsers,
  getUserGroups,
  sendFriendRequest
} from "../lib/api"
import {Link} from "react-router"
import {ArrowRight, Globe, UserPlusIcon, Users, Users2} from "lucide-react"
import FriendCard from "../components/FriendCard"
import NoFriendsFound from "../components/NoFriendsFound"
import {toast} from "react-hot-toast"
import GroupsList from "../components/group/GroupsList" // Importez le composant GroupsList que nous avons créé précédemment

const HomePage = () => {
  const queryClient = useQueryClient()
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set())
  const [loadingUserIds, setLoadingUserIds] = useState(new Set())
  const [pendingActionId, setPendingActionId] = useState(null)
  const [currentAction, setCurrentAction] = useState(null)
  
  // Fetch user's friends
  const {
    data: friends = [],
    isLoading: loadingFriends,
    error: friendsError,
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getMyFriends,
  })

  // Fetch user's groups
  const {
    data: userGroups = [],
    isLoading: loadingGroups,
    error: groupsError,
  } = useQuery({
    queryKey: ["userGroups"],
    queryFn: getUserGroups,
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
      setPendingActionId(userId)
      setCurrentAction('sendRequest')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] })
      queryClient.invalidateQueries({ queryKey: ["users"] })
      toast.success("Friend request sent successfully!")
      setPendingActionId(null)
      setCurrentAction(null)
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send friend request")
      setPendingActionId(null)
      setCurrentAction(null)
    },
    onSettled: (_, __, userId) => {
      setLoadingUserIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    },
  })

  // Mutation to block a user
  const { mutate: blockUserMutation, isPending: isBlockPending } = useMutation({
    mutationFn: blockUser,
    onMutate: (userId) => {
      setPendingActionId(userId)
      setCurrentAction('block')
    },
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
  const handleFriendCardAction = (actionType, userId, userName) => {
    if (actionType === 'sendRequest') {
      sendRequestMutation(userId)
    } else if (actionType === 'block') {
      if (window.confirm(`Are you sure you want to block ${userName}? You will not be able to message them or see their profile.`)) {
        blockUserMutation(userId)
      }
    }
  }

  // Show error states if any API calls fail
  if (friendsError || usersError || requestsError || groupsError) {
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

  // Prepare recommended users with request status
  const preparedRecommendedUsers = recommendedUsers.slice(0, 4).map(user => ({
    ...user,
    requestSent: outgoingRequestsIds.has(user._id)
  }))
  
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
                <FriendCard 
                  key={friend._id}
                  user={friend}
                  cardType="friend"
                  onAction={handleFriendCardAction}
                  isPending={pendingActionId === friend._id}
                  pendingAction={currentAction}
                />
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
                  <UserPlusIcon className="w-6 h-6" />
                </div>
              </div>
            <div>
                <h2 className="text-3xl font-bold mb-1">Recommended Partners</h2>
                <p className="text-base-content/70">Discover new language exchange partners</p>
              </div>
            </div>
            <Link to="/users" className="btn btn-outline btn-secondary gap-2 group">
              View All Users
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
          ) : !recommendedUsers || recommendedUsers.length === 0 ? (
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center py-12">
                <div className="avatar placeholder mb-6">
                  <div className="bg-base-300 text-base-content rounded-full w-20">
                    <UserPlusIcon className="w-10 h-10" />
                  </div>
                </div>
                <h3 className="card-title justify-center mb-3">No recommendations yet</h3>
                <p className="text-base-content/70 mb-6">
                  We're still looking for perfect language partners for you
                </p>
                <div className="card-actions justify-center">
                  <Link to="/users" className="btn btn-secondary">
                    Browse All Users
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {preparedRecommendedUsers.map((user) => (
                <FriendCard 
                  key={user._id}
                  user={user}
                  cardType="recommended"
                  onAction={handleFriendCardAction}
                  isPending={pendingActionId === user._id}
                  pendingAction={currentAction}
                />
              ))}
                            </div>
                          )}
        </section>

        {/* Groups Section */}
        <section className="mb-16">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="avatar placeholder">
                <div className="bg-accent text-accent-content rounded-2xl w-12">
                  <Users2 className="w-6 h-6" />
                          </div>                       
                      </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">My Learning Groups</h2>
                <p className="text-base-content/70">Join communities and practice with multiple learners</p>
                  </div>
                  </div>
            <div className="flex gap-2">
              <Link to="/my-groups" className="btn btn-outline btn-accent gap-2 group">
                My Groups
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link to="/groups" className="btn btn-accent gap-2 group">
                Discover Groups
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
            </div>
          </div>

          <GroupsList
            groups={userGroups.slice(0, 3)} // Limitons à 3 groupes sur la page d'accueil
            isLoading={loadingGroups}
            error={groupsError}
            currentUserId={localStorage.getItem('userId')}
            isInMyGroups={true}
            emptyMessage="Join learning communities to practice with multiple language partners"
            emptyAction={
              <div className="flex justify-center gap-2">
                <Link to="/groups" className="btn btn-accent">
                  Browse Groups
                </Link>
                <Link to="/groups/create" className="btn btn-outline">
                  Create Group
                </Link>
              </div>
            }
          />
        </section>
      </div>
    </div>
  );
};

export default HomePage;