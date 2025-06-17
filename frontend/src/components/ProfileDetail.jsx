import { useEffect, useState } from "react";
import FollowButton from "./FollowButton";
import { getUserIdFromToken } from "../utils/auth";
import { useParams } from "react-router-dom";
import { authFetch } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [followersCount, setFollowersCount] = useState(0);

  const loggedInUserId = getUserIdFromToken();
  const { username } = useParams();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await authFetch(`${API_URL}/profiles/${username}/`);
        if (!res.ok) throw new Error("Profile not found");
        const data = await res.json();
        setProfile(data);
        setFollowersCount(data.total_followers); 
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    }

    fetchProfile();
    
  }, [username]);

  if (!profile || !profile.user) {
    return <div className="text-center mt-10 text-gray-500">Loading profile...</div>;
  }

  const isOwnProfile = loggedInUserId === profile.user.id;

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6">
      <img
        src={profile.image || "https://i.imgur.com/dYcYQ7E.png"}
        alt={`${profile.user.username} avatar`}
        className="w-32 h-32 rounded-full mx-auto"
      />
      <h1 className="text-center text-2xl font-bold mt-4">{profile.user.username}</h1>

      {!isOwnProfile && (
        <div className="flex justify-center mt-4">
          <FollowButton profileUsername={username} initialIsFollowing={profile.is_following} onToggleFollow={(newIsFollowing)=>{
            setFollowersCount(prevCount => newIsFollowing ? prevCount + 1 : prevCount - 1);
          }} />
        </div>
      )}

      {isOwnProfile && <p className="text-center mt-4 text-gray-500">This is your profile</p>}

      <div className="flex justify-around mt-6 text-center">
        <div>
          <h2 className="text-lg font-semibold">{profile.total_posts}</h2>
          <p>Posts</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{followersCount}</h2>
          <p>Followers</p>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
