import { useState } from "react";
import { authFetch } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

function FollowButton({ profileUsername, initialIsFollowing,onToggleFollow }) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (loading) return;
    setLoading(true);

    try {
      const action = isFollowing ? "unfollow" : "follow";
      const res = await authFetch(`${API_URL}/followers/follow-unfollow/`, {
        method: "POST",
        body: JSON.stringify({ action, username: profileUsername }),
      });

      if (!res.ok) throw new Error("Error toggling follow");
      await res.json();
      const newFollowState=!isFollowing;
      setIsFollowing(!isFollowing);

      if(onToggleFollow) {
        onToggleFollow(newFollowState);
      }
    } catch {
      alert("Failed to update follow status.");
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`bg-white text-gray-800 font-bold rounded border-b-2 border-green-500
        hover:border-green-600 hover:bg-green-500 hover:text-white shadow-md py-1 px-3 inline-flex items-center text-sm mt-4`}
      type="button"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default FollowButton;
