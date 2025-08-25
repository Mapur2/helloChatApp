import { Link } from "react-router-dom";
import { MessageCircleIcon, HeartIcon } from "lucide-react";

const FriendCard = ({ friend }) => {
  return (
    <div className="group card bg-gradient-to-br from-base-200 to-base-300 hover:from-base-100 hover:to-base-200 border border-base-300 hover:border-primary/20 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className="card-body p-5 space-y-4">
        {/* USER INFO */}
        <div className="flex items-center gap-3">
          <div className="avatar size-14 ring-4 ring-primary/10 group-hover:ring-primary/30 transition-all duration-300">
            <img 
              src={friend?.profilePic} 
              alt={friend?.fullName}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
              {friend?.fullName}
            </h3>
            <div className="flex items-center gap-1 text-xs opacity-60">
              <HeartIcon className="size-3" />
              <span>Language Partner</span>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-2">
          <span className="badge badge-primary badge-outline font-medium text-xs">
            Native: {friend?.nativeLanguage}
          </span>
        </div>

        {/* Message Button */}
        <Link 
          to={`/chat/${friend?._id}`} 
          className="btn btn-primary btn-sm w-full gap-2 hover:btn-secondary transition-all duration-300 hover:scale-105 hover:shadow-lg"
        >
          <MessageCircleIcon className="size-4" />
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;