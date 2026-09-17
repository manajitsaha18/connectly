import FriendCard from '../components/FriendCard'
import NoFriendsFound from '../components/NoFriendsFound'
import { getUserFriends } from '../lib/api'
import { useQuery } from '@tanstack/react-query'

const FriendsPage = () => {

    const { data: friends = [], isLoading: isFriendsLoading, isError } = useQuery({
        queryKey: ["friends"],
        queryFn: getUserFriends,
    });

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="container mx-auto space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Your Friends</h2>

                {isFriendsLoading ? (
                    <div className="flex justify-center py-12">
                        <span className="loading loading-spinner loading-lg" />
                    </div>
                ) : isError ? (
                    <div className="alert alert-error">
                        <span>Failed to load your friends.</span>
                    </div>
                ) :
                    friends.length === 0 ? (
                        <NoFriendsFound />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {friends.map((friend) => (
                                <FriendCard key={friend._id} friend={friend} />
                            ))}
                        </div>
                    )}

            </div>
        </div>
    )
}

export default FriendsPage