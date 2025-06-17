import { useQuery } from '@tanstack/react-query';
import { getMyFriends } from '../lib/api';
import FriendCard from '../components/FriendCard';
import NoFriendsFound from '../components/NoFriendsFound';
import { LoaderIcon } from 'lucide-react';

const FriendsPage = () => {
    const { data: friends, isLoading } = useQuery({
        queryKey: ['friends'],
        queryFn: getMyFriends
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
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">My Friends</h1>
                    <p className="text-sm text-base-content/70">Connect with your language learning partners</p>
                </div>
            </div>

            {!friends || friends.length === 0 ? (
                <NoFriendsFound />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {friends.map(friend => (
                        <FriendCard key={friend._id} friend={friend} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FriendsPage; 