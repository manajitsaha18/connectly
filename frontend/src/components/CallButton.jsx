import { VideoIcon } from "lucide-react";

function CallButton({ handleVideoCall }) {
  return (
     <div className="absolute top-5 left-4 z-20">
      <button
        onClick={handleVideoCall}
        className="btn btn-success btn-sm text-white"
      >
        <VideoIcon className="size-5" />
      </button>
    </div>
  );
}

export default CallButton;