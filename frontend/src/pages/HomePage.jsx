import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect, useState } from "react";
import { getOutgoingFriendRequests, getRecommendedUsers, getMyFriends, sendFriendRequest } from "../lib/api";
import { Link } from "react-router";
import { CheckCircleIcon, MapPinIcon, User2Icon, UserPlusIcon } from "lucide-react";
import  { getLanguageFlag } from "../components/FriendCard";
import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import { toast } from "react-hot-toast";
import { capitalize } from "../lib/utils";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [loadingUserIds, setLoadingUserIds] = useState(new Set());
  
  // Fetch user's friends
  const { 
    data: friends = [], 
    isLoading: loadingFriends,
    error: friendsError 
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getMyFriends
  });

  // Fetch recommended users for language exchange
  const { 
    data: recommendedUsers = [], 
    isLoading: loadingUsers,
    error: usersError 
  } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers
  });

  // Fetch outgoing friend requests
  const { 
    data: outgoingFriendRequests,
    error: requestsError 
  } = useQuery({
    queryKey: ["outgoingFriendRequests"],
    queryFn: getOutgoingFriendRequests
  });
  
  // Update outgoing requests IDs when the data changes
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendRequests?.outgoingRequests?.length > 0) {
      outgoingFriendRequests.outgoingRequests.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendRequests]);

  // Mutation to send a friend request
  const { mutate: sendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,
    onMutate: (userId) => {
      setLoadingUserIds(prev => new Set([...prev, userId]));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Friend request sent successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to send friend request");
    },
    onSettled: (_, __, userId) => {
      setLoadingUserIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  });

  // Show error states if any API calls fail
  if (friendsError || usersError || requestsError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card bg-error/10 p-6 text-center">
          <h3 className="font-semibold text-lg mb-2 text-error">Something went wrong</h3>
          <p className="text-base-content opacity-70">
            Please try refreshing the page. If the problem persists, contact support.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Friends Section */}
      <section className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">My Friends</h2>
            <p className="text-sm text-base-content/70">Connect with your language learning partners</p>
          </div>
          <Link to="/friends" className="btn btn-primary">
            View All Friends
          </Link>
        </div>
        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : !friends || friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-5">
            {friends.slice(0, 4).map(friend => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}
      </section>

      {/* Recommended Users Section */}
      <section className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
            <p className="text-sm text-base-content/70">Discover perfect language exchange partners based on your profile</p>
          </div>
          <Link to="/users" className="btn btn-primary">
            View All Users
          </Link>
        </div>
        {loadingUsers ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : recommendedUsers.length === 0 ? (
          <div className="card bg-base-200 p-6 text-center">
            <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
            <p className="text-base-content opacity-70">You have no recommended users at the moment. Please check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-10">
            {recommendedUsers.slice(0, 4).map(user => {
              const hasRequestSent = outgoingRequestsIds.has(user._id);
              const isLoading = loadingUserIds.has(user._id);
              return (
                <div key={user._id} className="card bg-base-200 hover:shadow-lg transition-all duration-300">
                  <div className="card-body p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar size-16 rounded-full">
                        <img src={user.profilePicture || '/default-avatar.png'} alt={user.fullName} />
                      </div>

                      <div>
                        <h3 className="font-semibold text-lg">{user.fullName}</h3>
                        {user.location && (
                          <div className="flex items-center text-xs opacity-70 mt-1">
                            <MapPinIcon className="mr-1 size-4" />
                            <span className="badge badge-secondary text-xs">
                              {user.location}
                            </span>
                          </div>
                        )}
                      </div>                       
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      <span className="badge badge-secondary">
                        {getLanguageFlag(user.nativeLanguage)}
                        Native: {capitalize(user.nativeLanguage)}
                      </span>
                      <span className="badge badge-outline">
                        {getLanguageFlag(user.learningLanguage)}
                        Learning: {capitalize(user.learningLanguage)}
                      </span>
                    </div>
                    {user.bio && (
                      <p className="text-sm text-muted-foreground opacity-70">
                        {user.bio.length > 100 ? `${user.bio.slice(0, 100)}...` : user.bio}
                      </p>
                    )}

                    <button 
                      className={`btn w-full mt-2 ${hasRequestSent ? 'btn-disabled' : 'btn-primary'}`}
                      onClick={() => {
                        if (!hasRequestSent) {
                          sendRequestMutation(user._id);
                        }
                      }}
                      disabled={hasRequestSent || isLoading}
                    >
                      {hasRequestSent ? (
                        <>
                          <CheckCircleIcon className="mr-2 size-4" />
                          Request Sent
                        </>
                      ): isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <UserPlusIcon className="mr-2 size-4" />
                          Add Friend
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;


