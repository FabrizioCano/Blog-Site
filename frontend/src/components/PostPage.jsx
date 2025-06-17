import { useEffect, useState } from "react";
import PostList from "./PostList";
import { authFetch } from "../utils/auth";
export default function PostPage() {
  const [posts, setPosts] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem("access"));
  }, []);

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
  }, []);

  return <PostList posts={posts} showDetailLink={isAuthenticated} isAuthenticated={isAuthenticated} />;
}
