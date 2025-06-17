import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecommendedUsers, sendFriendRequest, getOutgoingFriendRequests } from '../lib/api';
import { LoaderIcon, SearchIcon, FilterIcon, UserPlusIcon, CheckCircleIcon } from 'lucide-react';
import { getLanguageFlag } from '../components/FriendCard';
import { LANGUAGES } from '../constants';
import { toast } from 'react-hot-toast';

const UsersPage = () => {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState({
    nativeLanguage: '',
    learningLanguage: '',
    searchQuery: ''
  });

  // Fetch users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getRecommendedUsers
  });

  // Fetch outgoing friend requests
  const { data: outgoingFriendRequests } = useQuery({
    queryKey: ['outgoingFriendRequests'],
    queryFn: getOutgoingFriendRequests
  });

  // Get outgoing requests IDs
  const outgoingRequestsIds = new Set(
    outgoingFriendRequests?.outgoingRequests?.map(req => req.recipient._id) || []
  );

  // Send friend request mutation
  const { mutate: sendRequestMutation, isPending } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outgoingFriendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Friend request sent successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send friend request');
    }
  });

  const filteredUsers = users.filter(user => {
    const matchesNative = !filters.nativeLanguage || 
      user.nativeLanguage.toLowerCase() === filters.nativeLanguage.toLowerCase();
    const matchesLearning = !filters.learningLanguage || 
      user.learningLanguage.toLowerCase() === filters.learningLanguage.toLowerCase();
    const matchesSearch = !filters.searchQuery || 
      user.fullName.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      user.bio?.toLowerCase().includes(filters.searchQuery.toLowerCase());

    return matchesNative && matchesLearning && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <LoaderIcon className="animate-spin size-8 text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Find Language Partners</h1>
          <p className="text-sm text-base-content/70">Discover and connect with language learners worldwide</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="card bg-base-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 size-4" />
              <input
                type="text"
                placeholder="Search by name or bio..."
                className="input input-bordered w-full pl-10"
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              className="select select-bordered"
              value={filters.nativeLanguage}
              onChange={(e) => setFilters(prev => ({ ...prev, nativeLanguage: e.target.value }))}
            >
              <option value="">Native Language</option>
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <select
              className="select select-bordered"
              value={filters.learningLanguage}
              onChange={(e) => setFilters(prev => ({ ...prev, learningLanguage: e.target.value }))}
            >
              <option value="">Learning Language</option>
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="card bg-base-200 p-6 text-center">
          <h3 className="font-semibold text-lg mb-2">No users found</h3>
          <p className="text-base-content opacity-70">Try adjusting your filters to find more language partners.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map(user => {
            const hasRequestSent = outgoingRequestsIds.has(user._id);
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
                      Native: {user.nativeLanguage}
                    </span>
                    <span className="badge badge-outline">
                      {getLanguageFlag(user.learningLanguage)}
                      Learning: {user.learningLanguage}
                    </span>
                  </div>

                  {user.bio && (
                    <p className="text-sm text-muted-foreground opacity-70">
                      {user.bio.length > 100 ? `${user.bio.slice(0, 100)}...` : user.bio}
                    </p>
                  )}

                  <button 
                    className={`btn w-full ${hasRequestSent ? 'btn-disabled' : 'btn-primary'}`}
                    onClick={() => {
                      if (!hasRequestSent) {
                        sendRequestMutation(user._id);
                      }
                    }}
                    disabled={hasRequestSent || isPending}
                  >
                    {hasRequestSent ? (
                      <>
                        <CheckCircleIcon className="mr-2 size-4" />
                        Request Sent
                      </>
                    ): isPending ? (
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
    </div>
  );
};

export default UsersPage; 