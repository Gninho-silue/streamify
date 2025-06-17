import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { acceptFriendRequest, getFriendRequests, getNotifications, markAsRead, markAllAsRead } from '../lib/api';
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon, CheckIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import NoNotificationsFound from '../components/NoNotificationsFound';

const NotificationPage = () => {
  const queryClient = useQueryClient();

  // Récupérer toutes les notifications
  const { data: notifications = [], isLoading: loadingNotifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    onError: (error) => {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    }
  });

  // Récupérer les demandes d'ami
  const { data: friendRequests, isLoading: loadingFriendRequests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
    onError: (error) => {
      console.error('Error fetching friend requests:', error);
      toast.error('Failed to load friend requests');
    }
  });

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      toast.success('Friend request accepted successfully!');
    },
    onError: (error) => {
      console.error('Error accepting friend request:', error);
      toast.error(error.response?.data?.message || 'Failed to accept friend request');
    }
  });

  const { mutate: markAsReadMutation } = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
    }
  });

  const { mutate: markAllAsReadMutation } = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotifications'] });
      toast.success('All notifications marked as read');
    }
  });

  const handleMarkAsRead = (notificationId) => {
    markAsReadMutation(notificationId);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation();
  };

  const incomingRequests = friendRequests?.incomingRequests || [];
  const acceptedRequests = friendRequests?.acceptedRequests || [];

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const isLoading = loadingNotifications || loadingFriendRequests;

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto max-w-4xl space-y-8'>
        <div className="flex justify-between items-center">
          <h1 className='text-2xl sm:text-3xl font-bold tracking-tight'>Notifications</h1>
          {unreadNotifications.length > 0 && (
            <button 
              onClick={handleMarkAllAsRead}
              className="btn btn-outline btn-sm"
            >
              <CheckIcon className="size-4 mr-2" />
              Marquer tout comme lu
            </button>
          )}
        </div>

        {isLoading ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ) : (
          <>
            {/* Demandes d'ami en attente */}
            {incomingRequests.length > 0 && (
              <section className='space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <UserCheckIcon className='size-5 text-primary' />
                  Demandes d'ami en attente
                  <span className='badge badge-primary ml-2'>({incomingRequests.length})</span>
                </h2>
                <div className='space-y-3'>
                  {incomingRequests.map(request => (
                    <div key={request._id} className='card bg-base-200 shadow-sm hover:shadow-md transition-shadow'>
                      <div className='card-body p-4'>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-3'>
                            <img src={request.sender.profilePicture} alt={request.sender.fullName} className='w-10 h-10 rounded-full' />
                            <div>
                              <h3 className='text-lg font-semibold'>{request.sender.fullName}</h3>
                              <p className='text-sm text-gray-600'>Veut être votre ami</p>
                              <div className='flex flex-wrap gap-1.5 mt-1'>
                                <span className='badge badge-secondary'>Native: {request.sender.nativeLanguage}</span>
                                <span className='badge badge-outline'>Learning: {request.sender.learningLanguage}</span>
                              </div>
                            </div>
                          </div>
                          <button 
                            onClick={() => acceptRequestMutation(request._id)} 
                            disabled={isPending}
                            className='btn btn-primary btn-sm'
                          >
                            {isPending ? 'Acceptation...' : 'Accepter'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Notifications non lues */}
            {unreadNotifications.length > 0 && (
              <section className='space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <BellIcon className='size-5 text-error' />
                  Notifications non lues
                  <span className='badge badge-error ml-2'>({unreadNotifications.length})</span>
                </h2>
                <div className='space-y-3'>
                  {unreadNotifications.map(notification => (
                    <div key={notification._id} className='card bg-base-200 shadow-sm border-l-4 border-error'>
                      <div className='card-body p-4'>
                        <div className='flex items-start justify-between'>
                          <div className='flex items-start gap-3 flex-1'>
                            {notification.sender && (
                              <img src={notification.sender.profilePicture} alt={notification.sender.fullName} className='w-10 h-10 rounded-full' />
                            )}
                            <div className='flex-1'>
                              <h3 className='text-lg font-semibold'>{notification.title}</h3>
                              <p className='text-sm text-gray-600'>{notification.message}</p>
                              <p className='text-sm flex items-center opacity-70 mt-1'>
                                <ClockIcon className='size-4 mr-1' />
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleMarkAsRead(notification._id)}
                            className='btn btn-ghost btn-sm'
                          >
                            <CheckIcon className='size-4' />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Notifications lues */}
            {readNotifications.length > 0 && (
              <section className='space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <BellIcon className='size-5 text-success' />
                  Notifications lues
                </h2>
                <div className='space-y-3'>
                  {readNotifications.map(notification => (
                    <div key={notification._id} className='card bg-base-200 shadow-sm opacity-75'>
                      <div className='card-body p-4'>
                        <div className='flex items-start gap-3'>
                          {notification.sender && (
                            <img src={notification.sender.profilePicture} alt={notification.sender.fullName} className='w-10 h-10 rounded-full' />
                          )}
                          <div className='flex-1'>
                            <h3 className='text-lg font-semibold'>{notification.title}</h3>
                            <p className='text-sm text-gray-600'>{notification.message}</p>
                            <p className='text-sm flex items-center opacity-70 mt-1'>
                              <ClockIcon className='size-4 mr-1' />
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Demandes d'ami acceptées */}
            {acceptedRequests.length > 0 && (
              <section className='space-y-4'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <MessageSquareIcon className='size-5 text-success' />
                  Nouvelles connexions
                </h2>
                <div className='space-y-3'>
                  {acceptedRequests.map(request => {
                    const isReceived = request.type === 'received';
                    const user = isReceived ? request.sender : request.recipient;
                    const message = isReceived 
                      ? "Vous êtes maintenant amis !" 
                      : "A accepté votre demande d'ami !";

                    return (
                      <div key={request._id} className='card bg-base-200 shadow-sm'>
                        <div className='card-body p-4'>
                          <div className='flex items-start gap-3'>
                            <div className='avatar size-10 rounded-full'>
                              <img src={user.profilePicture} alt={user.fullName} />
                            </div>
                            <div className='flex-1'>
                              <h3 className='text-lg font-semibold'>{user.fullName}</h3>
                              <p className='text-sm text-gray-600'>{message}</p>
                              <p className='text-sm flex items-center opacity-70 mt-1'>
                                <ClockIcon className='size-4 mr-1' />
                                {new Date(request.updatedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className='badge badge-success'>
                              <MessageSquareIcon className='size-4 mr-1' />
                              Nouvel ami
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Aucune notification */}
            {notifications.length === 0 && incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default NotificationPage 