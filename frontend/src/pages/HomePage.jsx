import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router";
import { useState } from "react";
import { getUserFriends, getRecommendedUsers, getOutgoingFriendRequests, sendFriendRequest } from "../lib/api";
import FriendCard, { getLanguageFlag } from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";
import NoRecommendedUsersFound from "../components/NoRecommendedUsersFound";
import { Users, UserPlus, CheckCircle, MapPin } from "lucide-react";
import toast from "react-hot-toast";


const HomePage = () => {
  const queryClient = useQueryClient();
  const [pendingUserId, setPendingUserId] = useState(null);

  const { data: friends = [], isLoading: isFriendsLoading } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: isRecommendedUsersLoading } =
    useQuery({
      queryKey: ["recommendedUsers"],
      queryFn: getRecommendedUsers,
    });

  const { data: outgoingFriendRequests = [] } = useQuery({
    queryKey: ["outgoingFriendRequests"],
    queryFn: getOutgoingFriendRequests,
  });

  const { mutate: sendFriendRequestMutation } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["outgoingFriendRequests"],
      });

    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Failed to send friend request"
      );
    },
    onSettled: () => {
      setPendingUserId(null);
    },
  });


  const outgoingRequestsIds = new Set(
    outgoingFriendRequests.map((request) => request.recipient._id)
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-2xl font-bold tracking-tight">Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <Users className="mr-2 size-3" />
            Friend Requests
          </Link>
        </div>

        {isFriendsLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {friends.map((friend) => (
              <FriendCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        <section>
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Meet New Learners</h2>
                <p className="opacity-70">
                  Discover perfect language exchange partners based on your profile
                </p>
              </div>
            </div>
          </div>

          {isRecommendedUsersLoading ? (
            <div className="flex justify-center py-12">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : recommendedUsers.length === 0 ? (
            <NoRecommendedUsersFound />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                const isSending = pendingUserId === user._id;

                return (
                  <div
                    key={user._id}
                    className="card bg-base-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="card-body p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="avatar size-16 rounded-full">
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">{user.fullName}</h3>
                          {user.location && (
                            <div className="flex items-center text-xs opacity-70 mt-1">
                              <MapPin className="size-3 mr-1" />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Languages with flags */}
                      <div className="flex items-center gap-2">
                        <span className="badge badge-secondary text-xs whitespace-nowrap">
                          {getLanguageFlag(user.nativeLanguage)}
                          Native: {capitalize(user.nativeLanguage)}
                        </span>

                        <span className="badge badge-outline text-xs whitespace-nowrap">
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitalize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className="text-sm opacity-70">{user.bio}</p>}

                      {/* Action button */}
                      <button
                        className={`btn w-full mt-2 ${hasRequestBeenSent
                            ? "btn-disabled"
                            : "btn-primary"
                          }`}
                        onClick={() => {
                          setPendingUserId(user._id);
                          sendFriendRequestMutation(user._id);
                        }}
                        disabled={hasRequestBeenSent || isSending}
                      >
                        {hasRequestBeenSent ? (
                          <>
                            <CheckCircle className="size-4 mr-2" />
                            Request Sent
                          </>
                        )  : (
                          <>
                            <UserPlus className="size-4 mr-2" />
                            Send Friend Request
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
      </div >
    </div >
  );
};

export default HomePage

const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};