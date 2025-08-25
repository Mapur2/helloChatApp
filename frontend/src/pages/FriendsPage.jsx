import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getUserFriends } from '../lib/api'
import FriendCard from '../components/FriendCard'
import NoFriendsFound from '../components/NoFriendCard'

function FriendsPage() {
  const { data: friends = [], isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: getUserFriends,
  });

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="text-sm opacity-60">Loading your friends...</p>
            </div>
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
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
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
      `}</style>
    </div>
  )
}

export default FriendsPage
