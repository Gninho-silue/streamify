import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {deleteGroup, demoteMember, getGroupById, leaveGroup, promoteMember, removeMember} from '../lib/api';
import {toast} from 'react-hot-toast';
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Crown,
  Edit3,
  Globe,
  Lock,
  LogOut,
  MessageCircle,
  Shield,
  Tag,
  Trash2,
  User,
  Users,
  UserX
} from 'lucide-react';
import GroupChat from '../components/group/GroupChat.jsx';
import useAuthUser from '../hooks/useAuthUser';
import "stream-chat-react/dist/css/v2/index.css";

const GroupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('chat');
  const [isUserAdmin, setIsUserAdmin] = useState(false);
  const [isUserCreator, setIsUserCreator] = useState(false);
  const { authUser } = useAuthUser();

  // Fetch group details
  const { data: group, isLoading, error } = useQuery({
    queryKey: ['group', id],
    queryFn: () => getGroupById(id),
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to load group');
      navigate('/groups');
    }
  });

  useEffect(() => {
    if (!group || !authUser) return;
    const currentUserId = authUser._id;
    const userMember = group.members.find(member => member.user._id === currentUserId);

    setIsUserCreator(group.creator._id === currentUserId);
    setIsUserAdmin(group.creator._id === currentUserId || userMember?.role === 'admin' || userMember?.role === 'moderator');
  }, [group, authUser]);

  // Leave group mutation
  const leaveGroupMutation = useMutation({
    mutationFn: leaveGroup,
    onSuccess: () => {
      toast.success('Successfully left the group');
      queryClient.invalidateQueries(['groups']);
      queryClient.invalidateQueries(['userGroups']);
      navigate('/groups');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to leave group');
    }
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      toast.success('Group deleted successfully');
      queryClient.invalidateQueries(['groups']);
      queryClient.invalidateQueries(['userGroups']);
      navigate('/groups');
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to delete group');
    }
  });

  // Mutations pour la gestion des membres
  const promoteMemberMutation = useMutation({
    mutationFn: (data) => promoteMember(id, data.memberId, data.newRole),
    onSuccess: () => {
      toast.success('Member role updated successfully');
      queryClient.invalidateQueries(['group', id]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update member role');
    }
  });

  const demoteMemberMutation = useMutation({
    mutationFn: (data) => demoteMember(id, data.memberId, data.newRole),
    onSuccess: () => {
      toast.success('Member role updated successfully');
      queryClient.invalidateQueries(['group', id]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to update member role');
    }
  });

  const removeMemberMutation = useMutation({
    mutationFn: (memberId) => removeMember(id, memberId),
    onSuccess: () => {
      toast.success('Member removed successfully');
      queryClient.invalidateQueries(['group', id]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Failed to remove member');
    }
  });

  const handleLeaveGroup = () => {
    if (confirm('Are you sure you want to leave this group?')) {
      leaveGroupMutation.mutate(id);
    }
  };

  const handleDeleteGroup = () => {
    if (confirm('Are you sure you want to delete this group? This action cannot be undone.')) {
      deleteGroupMutation.mutate(id);
    }
  };

  const handleStartCall = (type) => {
    navigate(`/groups/${id}/call/${type}`);
  };

  // Fonction pour gérer le changement de rôle d'un membre
  const handleChangeRole = (memberId, newRole) => {
    const member = group.members.find(m => m.user._id === memberId);
    if (!member) return;
    
    const currentRole = member.role;
    
    // Si le nouveau rôle est inférieur, on rétrograde
    if (
      (currentRole === 'admin' && (newRole === 'moderator' || newRole === 'member')) ||
      (currentRole === 'moderator' && newRole === 'member')
    ) {
      demoteMemberMutation.mutate({ memberId, newRole });
    } 
    // Sinon, on promeut
    else if (
      (currentRole === 'member' && (newRole === 'moderator' || newRole === 'admin')) ||
      (currentRole === 'moderator' && newRole === 'admin')
    ) {
      promoteMemberMutation.mutate({ memberId, newRole });
    }
  };

  // Fonction pour supprimer un membre
  const handleRemoveMember = (memberId) => {
    if (confirm('Are you sure you want to remove this member from the group?')) {
      removeMemberMutation.mutate(memberId);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'badge-success';
      case 'intermediate': return 'badge-warning';
      case 'advanced': return 'badge-error';
      default: return 'badge-info';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Crown className="w-4 h-4 text-warning" />;
      case 'moderator': return <Shield className="w-4 h-4 text-info" />;
      default: return <User className="w-4 h-4 text-base-content/60" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="mt-4 text-base-content/70">Loading group...</p>
        </div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h3 className="text-xl font-semibold mb-2">Group not found</h3>
          <p className="text-base-content/70 mb-4">The group you're looking for doesn't exist or you don't have access.</p>
          <Link to="/groups" className="btn btn-primary">
            Back to Groups
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Cover Image Banner */}
      {group.coverImage && (
        <div className="relative h-40 overflow-hidden">
          <img 
            src={group.coverImage} 
            alt={`${group.name} cover`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-base-100/80"></div>
        </div>
      )}
      
      {/* Header */}
      <div className={`bg-base-100 border-b border-base-300 p-4 ${group.coverImage ? '-mt-16 relative z-10' : ''}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/groups" className="btn btn-ghost btn-circle bg-base-100/80 backdrop-blur-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            
            <div className="flex items-center gap-3">
              {/* Group Image */}
              <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden border-4 border-base-100 shadow-lg">
                {group.image ? (
                  <img 
                    src={group.image} 
                    alt={group.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                )}
              </div>
              
              <div>
                <h1 className="text-xl font-bold">{group.name}</h1>
                <div className="flex items-center gap-2 text-sm text-base-content/70">
                  {group.isPrivate ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                  <span>{group.members.length}/{group.maxMembers} members</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isUserCreator ? (
              <button
                onClick={handleDeleteGroup}
                className="btn btn-error btn-sm gap-2"
                disabled={deleteGroupMutation.isPending}
              >
                <Trash2 className="w-4 h-4" />
                Delete Group
              </button>
            ) : (
              <button
                onClick={handleLeaveGroup}
                className="btn btn-outline btn-sm gap-2"
                disabled={leaveGroupMutation.isPending}
              >
                <LogOut className="w-4 h-4" />
                Leave Group
              </button>
            )}
            
            {isUserAdmin && (
              <Link to={`/groups/${id}/edit`} className="btn btn-primary btn-sm gap-2">
                <Edit3 className="w-4 h-4" />
                Edit group
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="tabs tabs-boxed bg-base-200 m-4">
            <button
              className={`tab gap-2 ${activeTab === 'chat' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('chat')}
            >
              <MessageCircle className="w-4 h-4" />
              Chat
            </button>
            <button
              className={`tab gap-2 ${activeTab === 'members' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('members')}
            >
              <Users className="w-4 h-4" />
              Members ({group.members.length})
            </button>
            <button
              className={`tab gap-2 ${activeTab === 'info' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('info')}
            >
              <BookOpen className="w-4 h-4" />
              Info
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-4">
            {activeTab === 'chat' && (
              <div className="h-full bg-base-100 rounded-lg border border-base-300">
                <GroupChat 
                  group={group} 
                  onStartCall={handleStartCall}
                />
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Group Members</h3>
                  <span className="text-sm text-base-content/70">
                    {group.members.length}/{group.maxMembers} members
                  </span>
                </div>
                
                <div className="grid gap-3">
                  {/* Liste des membres avec indication du rôle et "You" pour l'utilisateur courant */}
                  {[...group.members]
                      .sort((a, b) => {
                        // Le créateur est toujours en premier
                        if (a.user._id === group.creator._id) return -1;
                        if (b.user._id === group.creator._id) return 1;

                        // Ensuite, trier par rôle (admin > moderator > member)
                        const roleOrder = { admin: 1, moderator: 2, member: 3 };
                        return roleOrder[a.role] - roleOrder[b.role];
                      })
                      .map((member) => (
                          <div key={member.user._id} className="card bg-base-100 shadow-sm">
                            <div className="card-body p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="avatar">
                                    <div className="w-10 h-10 rounded-full">
                                      <img
                                          src={member.user.profilePicture || "/default-avatar.png"}
                                          alt={member.user.fullName}
                                      />
                                    </div>
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-medium">
                                        {member.user.fullName}
                                        {authUser && member.user._id === authUser._id && (
                                            <span className="badge badge-accent ml-2 badge-sm">You</span>
                                        )}
                                      </h4>
                                      {getRoleIcon(member.role)}
                                      {member.user._id === group.creator._id && (
                                          <span className="badge badge-primary badge-xs">Creator</span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm text-base-content/70">
                                        Joined {new Date(member.joinedAt).toLocaleDateString()}
                                      </p>
                                      <span className="badge badge-ghost badge-sm">
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <Link
                                      to={`/users/${member.user._id}`}
                                      className="btn btn-ghost btn-sm"
                                  >
                                    View Profile
                                  </Link>

                                  {/* Gestion des membres - visible seulement pour les admins/modos */}
                                  {isUserAdmin && member.user._id !== group.creator._id && member.user._id !== authUser?._id && (
                                      <>
                                        {/* Menu de changement de rôle - créateur peut gérer tout le monde,
                    admin/modo ne peut pas gérer les admins */}
                                        {isUserCreator || member.role !== 'admin' ? (
                                            <div className="dropdown dropdown-end">
                                              <button tabIndex={0} className="btn btn-ghost btn-sm">
                                                <Shield className="w-4 h-4 mr-1" />
                                                Role
                                                <ChevronDown className="w-3 h-3 ml-1" />
                                              </button>
                                              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                                                <li>
                                                  <button
                                                      onClick={() => handleChangeRole(member.user._id, 'member')}
                                                      className={member.role === 'member' ? 'active' : ''}
                                                      disabled={member.role === 'member'}
                                                  >
                                                    <User className="w-4 h-4" />
                                                    Member
                                                  </button>
                                                </li>
                                                <li>
                                                  <button
                                                      onClick={() => handleChangeRole(member.user._id, 'moderator')}
                                                      className={member.role === 'moderator' ? 'active' : ''}
                                                      disabled={member.role === 'moderator'}
                                                  >
                                                    <Shield className="w-4 h-4" />
                                                    Moderator
                                                  </button>
                                                </li>
                                                {isUserCreator && (
                                                    <li>
                                                      <button
                                                          onClick={() => handleChangeRole(member.user._id, 'admin')}
                                                          className={member.role === 'admin' ? 'active' : ''}
                                                          disabled={member.role === 'admin'}
                                                      >
                                                        <Crown className="w-4 h-4" />
                                                        Admin
                                                      </button>
                                                    </li>
                                                )}
                                              </ul>
                                            </div>
                                        ) : null}

                                        {/* Bouton de suppression */}
                                        <button
                                            onClick={() => handleRemoveMember(member.user._id)}
                                            className="btn btn-ghost btn-sm text-error"
                                            disabled={removeMemberMutation.isPending}
                                        >
                                          <UserX className="w-4 h-4 mr-1" />
                                          Remove
                                        </button>
                                      </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                      ))}
                </div>
              </div>
            )}

            {activeTab === 'info' && (
                <div className="space-y-6">
                  {/* Group Images (Added) */}
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title text-lg mb-4">Group Gallery</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Profile Image */}
                        <div>
                          <h4 className="font-medium mb-3">Group Profile</h4>
                          <div className="flex items-center justify-center">
                            <div className="w-40 h-40 rounded-xl overflow-hidden border border-base-300">
                              {group.image ? (
                                  <img
                                      src={group.image}
                                      alt={`${group.name} profile`}
                                      className="w-full h-full object-cover"
                                  />
                              ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                                    <Users className="w-16 h-16 text-primary/60" />
                                  </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Cover Image */}
                        <div>
                          <h4 className="font-medium mb-3">Cover Image</h4>
                          <div className="flex items-center justify-center">
                            <div className="h-40 w-full rounded-xl overflow-hidden border border-base-300">
                              {group.coverImage ? (
                                  <img
                                      src={group.coverImage}
                                      alt={`${group.name} cover`}
                                      className="w-full h-full object-cover"
                                  />
                              ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                                    <span className="text-sm text-base-content/40">No cover image</span>
                                  </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="card bg-base-100 shadow-lg">
                    <div className="card-body">
                      <h3 className="card-title text-lg mb-4">Group Information</h3>

                      <div className="space-y-4">
                        <div>
                          <label className="label">
                            <span className="label-text font-medium">Description</span>
                          </label>
                          <p className="text-base-content/80">{group.description}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="label">
                              <span className="label-text font-medium">Languages</span>
                            </label>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{group.nativeLanguage}</span>
                              <span>→</span>
                              <span className="font-medium">{group.learningLanguage}</span>
                            </div>
                          </div>

                          <div>
                            <label className="label">
                              <span className="label-text font-medium">Level</span>
                            </label>
                            <span className={`badge ${getLevelColor(group.level)}`}>
                            {group.level}
                          </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="label">
                              <span className="label-text font-medium">Created by</span>
                            </label>
                            <div className="flex items-center gap-2">
                              <div className="avatar">
                                <div className="w-6 h-6 rounded-full">
                                  <img
                                      src={group.creator.profilePicture || "/default-avatar.png"}
                                      alt={group.creator.fullName}
                                  />
                                </div>
                              </div>
                              <span>{group.creator.fullName}</span>
                            </div>
                          </div>

                          <div>
                            <label className="label">
                              <span className="label-text font-medium">Created on</span>
                            </label>
                            <p>{new Date(group.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {group.tags && group.tags.length > 0 && (
                      <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                          <h3 className="card-title text-lg mb-4">
                            <Tag className="w-5 h-5" />
                            Tags
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {group.tags.map((tag, index) => (
                                <span key={index} className="badge badge-outline">
                            {tag}
                          </span>
                            ))}
                          </div>
                        </div>
                      </div>
                  )}

                  {/* Rules */}
                  {group.rules && group.rules.length > 0 && (
                      <div className="card bg-base-100 shadow-lg">
                        <div className="card-body">
                          <h3 className="card-title text-lg mb-4">Group Rules</h3>
                          <div className="space-y-2">
                            {group.rules.map((rule, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <span className="text-primary font-bold">{index + 1}.</span>
                                  <p className="text-base-content/80">{rule}</p>
                                </div>
                            ))}
                          </div>
                        </div>
                      </div>
                  )}
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailPage;