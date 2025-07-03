import GroupCard from './GroupCard';

const GroupsList = ({ 
  groups, 
  isLoading, 
  error,
  currentUserId,
  isInMyGroups = false,
  onJoinGroup,
  onLeaveGroup,
  onDeleteGroup,
  pendingActionIds = {},
  emptyMessage,
  emptyAction
}) => {
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold mb-2">Failed to load groups</h3>
          <p className="text-base-content/70">Please try again later</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-lg animate-pulse">
            <div className="card-body">
              <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-base-300 rounded w-full mb-1"></div>
              <div className="h-3 bg-base-300 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold mb-2">No groups found</h3>
        <p className="text-base-content/70 mb-4">
          {emptyMessage || "No groups to display"}
        </p>
        {emptyAction}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {groups.map((group) => (
        <GroupCard 
          key={group._id}
          group={group}
          currentUserId={currentUserId}
          isInMyGroups={isInMyGroups}
          onJoinGroup={onJoinGroup}
          onLeaveGroup={onLeaveGroup}
          onDeleteGroup={onDeleteGroup}
          isJoining={pendingActionIds.joining === group._id}
          isLeaving={pendingActionIds.leaving === group._id}
          isDeleting={pendingActionIds.deleting === group._id}
        />
      ))}
    </div>
  );
};

export default GroupsList;