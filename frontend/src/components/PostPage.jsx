import { useEffect, useState } from "react";
import PostList from "./PostList";
import { useAuth } from "../contexts/AuthContext";
export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const { user, authFetch } = useAuth();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await authFetch(import.meta.env.VITE_API_URL + "/feed/posts/");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
    }

    fetchPosts();
  }, [user,authFetch]);  // Recargar posts si cambia user o authFetch

  return <PostList posts={posts} showDetailLink={!!user} isAuthenticated={!!user} />;
}
