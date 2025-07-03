import {useState} from 'react';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {getPublicGroups, joinGroup, searchGroups} from '../lib/api';
import {toast} from 'react-hot-toast';
import {Filter, Plus, Search} from 'lucide-react';
import {Link} from 'react-router';
import {LANGUAGES} from "../constants/index.js";
import GroupsList from '../components/group/GroupsList';

const GroupsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    nativeLanguage: '',
    learningLanguage: '',
    level: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const queryClient = useQueryClient();
  const currentUserId = localStorage.getItem('userId');

  // Fetch groups
  const { data: groups = [], isLoading, error } = useQuery({
    queryKey: ['groups', searchQuery, filters],
    queryFn: () => {
      const params = { ...filters };
      if (searchQuery) params.q = searchQuery;
      return Object.keys(params).length > 0 ? searchGroups(params) : getPublicGroups();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to load groups');
    }
  });

  // Join group mutation
  const joinGroupMutation = useMutation({
    mutationFn: joinGroup,
    onSuccess: (data, groupId) => {
      toast.success('Successfully joined group!');
      queryClient.invalidateQueries(['groups']);
      queryClient.invalidateQueries(['userGroups']);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to join group');
    }
  });

  const handleJoinGroup = (groupId) => {
    joinGroupMutation.mutate(groupId);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // La recherche se fait automatiquement via useQuery
  };

  const clearFilters = () => {
    setFilters({
      nativeLanguage: '',
      learningLanguage: '',
      level: ''
    });
  };

  const emptyGroupsMessage = searchQuery || Object.values(filters).some(f => f)
    ? 'Try adjusting your search or filters'
    : 'Be the first to create a learning group!';

  const emptyGroupsAction = !searchQuery && !Object.values(filters).some(f => f) && (
    <Link to="/groups/create" className="btn btn-primary">
      Create First Group
    </Link>
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Learning Groups</h1>
          <p className="text-base-content/70">Join groups to practice languages with others</p>
        </div>
        <Link
          to="/groups/create"
          className="btn btn-primary gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Group
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card bg-base-100 shadow-lg mb-8">
        <div className="card-body">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
                <input
                  type="text"
                  placeholder="Search groups by name, description, or tags..."
                  className="input input-bordered w-full pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <label className="label">
                    <span className="label-text">Native Language</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={filters.nativeLanguage}
                    onChange={(e) => setFilters(prev => ({ ...prev, nativeLanguage: e.target.value }))}
                  >
                    <option value="">All Languages</option>
                    {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Learning Language</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={filters.learningLanguage}
                    onChange={(e) => setFilters(prev => ({ ...prev, learningLanguage: e.target.value }))}
                  >
                    <option value="">All Languages</option>
                    {LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">Level</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={filters.level}
                    onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value }))}
                  >
                    <option value="">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="all">All Levels</option>
                  </select>
                </div>
              </div>
            )}

            {/* Filter Actions */}
            {showFilters && (
              <div className="flex gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn btn-ghost btn-sm"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Groups Grid */}
      <GroupsList
        groups={groups}
        isLoading={isLoading}
        error={error}
        currentUserId={currentUserId}
        isInMyGroups={false}
        onJoinGroup={handleJoinGroup}
        pendingActionIds={{ joining: joinGroupMutation.isPending ? joinGroupMutation.variables : null }}
        emptyMessage={emptyGroupsMessage}
        emptyAction={emptyGroupsAction}
      />
    </div>
  );
};

export default GroupsPage;