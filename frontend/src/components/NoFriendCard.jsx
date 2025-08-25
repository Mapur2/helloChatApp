import React from "react";
import { UsersIcon, HeartIcon, SparklesIcon } from "lucide-react";

function NoFriendsFound() {
  return (
    <div className="card bg-gradient-to-r from-base-200 to-base-300 p-8 text-center border border-base-300 shadow-lg max-w-md mx-auto">
      <div className="space-y-4">
        <div className="p-4 bg-base-100 rounded-full w-fit mx-auto">
          <UsersIcon className="size-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-bold text-xl text-base-content">
            No friends yet
          </h3>
          <p className="text-base-content/70">
            Start your language learning journey by connecting with amazing people!
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm opacity-60">
          <HeartIcon className="size-4" />
          <span>Scroll down to discover new language partners</span>
          <SparklesIcon className="size-4" />
        </div>
      </div>
    </div>
  );
}

export default NoFriendsFound;
