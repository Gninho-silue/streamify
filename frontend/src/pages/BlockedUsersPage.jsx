import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getBlockedUsers, unblockUser } from '../lib/api';
import { toast } from 'react-hot-toast';
import { LoaderIcon, UserXIcon } from 'lucide-react';

const BlockedUsersPage = () => {
  const queryClient = useQueryClient();

  const { data: blockedUsers = [], isLoading } = useQuery({
    queryKey: ['blockedUsers'],
    queryFn: getBlockedUsers,
    onError: (error) => {
      toast.error('Failed to load blocked users');
    }
  });

  const { mutate: unblockUserMutation, isPending } = useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blockedUsers'] });
      toast.success('User unblocked successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to unblock user');
    }
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Blocked Users</h1>
          <p className="text-sm text-base-content/70">Manage users you've blocked</p>
        </div>
      </div>

      {blockedUsers.length === 0 ? (
        <div className="card bg-base-200 p-6 text-center">
          <UserXIcon className="size-12 mx-auto mb-4 text-base-content/50" />
          <h3 className="font-semibold text-lg mb-2">No blocked users</h3>
          <p className="text-base-content opacity-70">You haven't blocked any users yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {blockedUsers.map(user => (
            <div key={user._id} className="card bg-base-200 hover:shadow-lg transition-all duration-300">
              <div className="card-body p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="avatar size-16 rounded-full">
                    <img src={user.profilePicture || '/default-avatar.png'} alt={user.fullName} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{user.fullName}</h3>
                  </div>
                </div>

                <button 
                  className="btn btn-error btn-outline w-full"
                  onClick={() => unblockUserMutation(user._id)}
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Unblocking...
                    </>
                  ) : (
                    'Unblock'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlockedUsersPage; 