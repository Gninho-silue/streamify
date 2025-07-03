import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {deleteGroup, getUserGroups, leaveGroup} from '../lib/api';
import {toast} from 'react-hot-toast';
import {Plus} from 'lucide-react';
import {Link} from 'react-router';
import GroupsList from '../components/group/GroupsList';

const MyGroupsPage = () => {
  const queryClient = useQueryClient();
  const currentUserId = localStorage.getItem('userId');

  const { data: groups = [], isLoading, error } = useQuery({
    queryKey: ['userGroups'],
    queryFn: getUserGroups,
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to load your groups');
    }
  });

  const leaveGroupMutation = useMutation({
    mutationFn: leaveGroup,
    onSuccess: () => {
      toast.success('Successfully left the group');
      queryClient.invalidateQueries(['userGroups']);
      queryClient.invalidateQueries(['groups']);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to leave group');
    }
  });

  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      toast.success('Group deleted successfully');
      queryClient.invalidateQueries(['userGroups']);
      queryClient.invalidateQueries(['groups']);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete group');
    }
  });

  const handleLeaveGroup = (groupId) => {
    if (confirm('Are you sure you want to leave this group?')) {
      leaveGroupMutation.mutate(groupId);
    }
  };

  const handleDeleteGroup = (groupId) => {
    if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      deleteGroupMutation.mutate(groupId);
    }
  };

  const emptyGroupsAction = (
    <div className="flex gap-4 justify-center">
      <Link to="/groups/create" className="btn btn-primary">
        Create Group
      </Link>
      <Link to="/groups" className="btn btn-outline">
        Browse Groups
      </Link>
    </div>
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Groups</h1>
          <p className="text-base-content/70">Manage your learning communities</p>
        </div>
        <Link
          to="/groups/create"
          className="btn btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Group
        </Link>
      </div>

      {/* Groups */}
      <GroupsList
        groups={groups}
        isLoading={isLoading}
        error={error}
        currentUserId={currentUserId}
        isInMyGroups={true}
        onLeaveGroup={handleLeaveGroup}
        onDeleteGroup={handleDeleteGroup}
        pendingActionIds={{
          leaving: leaveGroupMutation.isPending ? leaveGroupMutation.variables : null,
          deleting: deleteGroupMutation.isPending ? deleteGroupMutation.variables : null
        }}
        emptyMessage="You haven't joined or created any groups yet. Start by creating your first learning community!"
        emptyAction={emptyGroupsAction}
      />
    </div>
  );
};

export default MyGroupsPage;