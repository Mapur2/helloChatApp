import React, { useEffect, useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getFriendRequests, getOutgoingFriendReqs, acceptFriendRequest } from '../lib/api'
import { CheckIcon, UserPlusIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

function NotificationPage() {
  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading: loadingIncoming } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: getFriendRequests,
  });

  const { data: outgoingFriendReqs = [], isLoading: loadingOutgoing } = useQuery({
    queryKey: ['outgoingFriendReqs'],
    queryFn: getOutgoingFriendReqs,
  });

  const { mutate: acceptRequest, isPending: isAccepting } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const incoming = useMemo(() => friendRequests?.incomingReqs ?? [], [friendRequests]);

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
          <Link to="/" className="btn btn-ghost btn-sm">Back Home</Link>
        </div>

        {/* Incoming Requests */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Incoming friend requests</h2>

          {loadingIncoming ? (
            <div className="card bg-base-100 p-6 shadow">
              <div className="loading loading-spinner loading-md"></div>
            </div>
          ) : incoming.length === 0 ? (
            <div className="card bg-base-100 p-6 shadow text-sm opacity-70">No incoming requests</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {incoming.map((req) => (
                <div key={req._id} className="card bg-base-100 shadow border border-base-300">
                  <div className="card-body p-4 flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full ring-2 ring-primary/20">
                        <img src={req.sender.profilePic} alt={req.sender.fullName} className="rounded-full object-cover" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{req.sender.fullName}</p>
                      <p className="text-xs opacity-60 truncate">wants to be your friend</p>
                    </div>
                    <button
                      className="btn btn-success btn-sm gap-2"
                      onClick={() => acceptRequest(req._id)}
                      disabled={isAccepting}
                    >
                      <CheckIcon className="size-4" />
                      {isAccepting ? 'Accepting...' : 'Accept'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Outgoing Requests */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Pending sent requests</h2>
          {loadingOutgoing ? (
            <div className="card bg-base-100 p-6 shadow">
              <div className="loading loading-spinner loading-md"></div>
            </div>
          ) : outgoingFriendReqs.length === 0 ? (
            <div className="card bg-base-100 p-6 shadow text-sm opacity-70">No pending requests</div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {outgoingFriendReqs.map((req) => (
                <div key={req._id} className="card bg-base-100 shadow border border-base-300">
                  <div className="card-body p-4 flex items-center gap-4">
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full ring-2 ring-secondary/20">
                        <img src={req.recipient.profilePic} alt={req.recipient.fullName} className="rounded-full object-cover" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{req.recipient.fullName}</p>
                      <p className="text-xs opacity-60 truncate">request sent, awaiting response</p>
                    </div>
                    <div className="badge badge-outline gap-1"><UserPlusIcon className="size-3" /> Sent</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default NotificationPage
