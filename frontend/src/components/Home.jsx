import PostPage from "./PostPage";
import SideBar from "./SideBar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <SideBar />

      <main className="flex-1 p-6">
        <h1 className="text-3xl text-center font-bold mb-6 text-gray-800">Recent Posts</h1>

        {!isAuthenticated && (
          <div className="text-center text-lg text-gray-600 space-y-4">
            <p>You must be logged in to create a post</p>
          </div>
        )}
        <PostPage />

      </main>
    </div>
  );
}
