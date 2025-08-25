import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
  getFriendRequests,
  acceptFriendRequest,
} from "../lib/api";
import { Link } from "react-router-dom";
import { 
  CheckCircleIcon, 
  MapPinIcon, 
  UserPlusIcon, 
  UsersIcon, 
  SparklesIcon,
  HeartIcon,
  MessageCircleIcon,
  GlobeIcon,
  CheckIcon
} from "lucide-react";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendCard";

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());
  const [incomingRequestsMap, setIncomingRequestsMap] = useState(new Map());

  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  const { data: recommendedUsers = [], isLoading: loadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getRecommendedUsers,
  });

  const { data: outgoingFriendReqs } = useQuery({
    queryKey: ["outgoingFriendReqs"],
    queryFn: getOutgoingFriendReqs,
  });

  const { data: friendRequests } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendRequests,
  });

  const { mutate: sendRequestMutation, isPending: isSendingRequest } = useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outgoingFriendReqs"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  const { mutate: acceptRequestMutation, isPending: isAcceptingRequest } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friends"] });
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);

  useEffect(() => {
    const incomingMap = new Map();
    if (friendRequests && friendRequests.incomingReqs) {
      friendRequests.incomingReqs.forEach((req) => {
        incomingMap.set(req.sender._id, req._id);
      });
      setIncomingRequestsMap(incomingMap);
    }
  }, [friendRequests]);

  const handleAcceptRequest = (requestId) => {
    acceptRequestMutation(requestId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-300">
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
              <SparklesIcon className="size-6" />
              <h1 className="text-3xl sm:text-4xl font-bold">Welcome Back!</h1>
              <SparklesIcon className="size-6" />
            </div>
            <p className="text-lg opacity-70 max-w-2xl mx-auto">
              Connect with language learners around the world and practice together
            </p>
          </div>

          {/* Friends Section */}
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <HeartIcon className="size-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
                  <p className="text-sm opacity-60">Connect and chat with your language partners</p>
                </div>
              </div>
              <Link 
                to="/notifications" 
                className="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <UsersIcon className="size-4" />
                Friend Requests
              </Link>
            </div>

            {loadingFriends ? (
              <div className="flex justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="loading loading-spinner loading-lg text-primary"></div>
                  <p className="text-sm opacity-60">Loading your friends...</p>
                </div>
              </div>
            ) : friends.length === 0 ? (
              <div className="animate-fade-in">
                <NoFriendsFound />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {friends.map((friend, index) => (
                  <div 
                    key={friend._id} 
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <FriendCard friend={friend} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Recommended Users Section */}
          <section className="space-y-8">
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <GlobeIcon className="size-6 text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Meet New Learners</h2>
                    <p className="text-sm opacity-60">
                      Discover perfect language exchange partners based on your profile
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {loadingUsers ? (
              <div className="flex justify-center py-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="loading loading-spinner loading-lg text-secondary"></div>
                  <p className="text-sm opacity-60">Finding amazing language partners...</p>
                </div>
              </div>
            ) : recommendedUsers.length === 0 ? (
              <div className="card bg-gradient-to-r from-base-200 to-base-300 p-8 text-center border border-base-300 shadow-lg">
                <div className="max-w-md mx-auto">
                  <div className="p-4 bg-base-100 rounded-full w-fit mx-auto mb-4">
                    <UsersIcon className="size-8 text-base-content/50" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">No recommendations available</h3>
                  <p className="text-base-content/70 mb-4">
                    We're working hard to find the perfect language partners for you!
                  </p>
                  <div className="badge badge-outline">Check back later</div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedUsers.map((user, index) => {
                  const hasRequestBeenSent = outgoingRequestsIds.has(user._id);
                  const hasIncomingRequest = incomingRequestsMap.has(user._id);
                  const incomingRequestId = incomingRequestsMap.get(user._id);

                  return (
                    <div
                      key={user._id}
                      className="group card bg-gradient-to-br from-base-200 to-base-300 hover:from-base-100 hover:to-base-200 border border-base-300 hover:border-primary/20 hover:shadow-2xl transition-all duration-500 hover:scale-105 animate-fade-in"
                      style={{ animationDelay: `${index * 150}ms` }}
                    >
                      <div className="card-body p-6 space-y-5">
                        {/* User Header */}
                        <div className="flex items-center gap-4">
                          <div className="avatar size-16 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
                            <img 
                              src={user.profilePic} 
                              alt={user.fullName}
                              className="rounded-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                              {user.fullName}
                            </h3>
                            {user.location && (
                              <div className="flex items-center text-xs opacity-70 mt-1">
                                <MapPinIcon className="size-3 mr-1" />
                                <span className="truncate">{user.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Languages */}
                        <div className="space-y-2">
                          <div className="flex flex-wrap gap-2">
                            <span className="badge badge-primary badge-outline font-medium">
                              Native: {user.nativeLanguage}
                            </span>
                          </div>
                        </div>

                        {/* Bio */}
                        {user.bio && (
                          <div className="bg-base-100/50 rounded-lg p-3">
                            <p className="text-sm opacity-80 line-clamp-3">{user.bio}</p>
                          </div>
                        )}

                        {/* Action Button */}
                        {hasIncomingRequest ? (
                          <button
                            className="btn btn-success w-full mt-2 gap-2 hover:btn-success/80 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                            onClick={() => handleAcceptRequest(incomingRequestId)}
                            disabled={isAcceptingRequest}
                          >
                            <CheckIcon className="size-4" />
                            {isAcceptingRequest ? "Accepting..." : "Accept Friend Request"}
                          </button>
                        ) : (
                          <button
                            className={`btn w-full mt-2 gap-2 transition-all duration-300 ${
                              hasRequestBeenSent 
                                ? "btn-success btn-outline" 
                                : "btn-primary hover:btn-secondary"
                            } hover:scale-105 hover:shadow-lg`}
                            onClick={() => sendRequestMutation(user._id)}
                            disabled={hasRequestBeenSent || isSendingRequest}
                          >
                            {hasRequestBeenSent ? (
                              <>
                                <CheckCircleIcon className="size-4" />
                                Request Sent
                              </>
                            ) : (
                              <>
                                <UserPlusIcon className="size-4" />
                                {isSendingRequest ? "Sending..." : "Send Friend Request"}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default HomePage;