import React from "react";
import { VideoIcon } from "lucide-react";

const CallButton = ({ handleVideoCall, disabled = false }) => {
  return (
    <div className="absolute top-3 right-3 z-10">
      <button
        type="button"
        onClick={handleVideoCall}
        disabled={disabled}
        className="btn btn-primary btn-sm gap-2 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
        aria-label="Start video call"
        title="Start video call"
      >
        <VideoIcon className="size-4" />
        Call
      </button>
    </div>
  );
};

export default CallButton;
