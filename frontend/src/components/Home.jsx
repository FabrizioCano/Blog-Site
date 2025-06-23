import PostPage from "./PostPage";
import SideBar from "./SideBar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "../contexts/AuthContext";
export default function Home() {
  const { user } = useAuth();
  

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <SideBar />

      <main className="flex-1 p-6">
        <Header
          heading="Recent Posts"
          paragraph="Check the latest posts from users."
          linkName=""
          linkUrl=""
        />

        {!user && (
          <div className="text-center text-lg text-gray-600 space-y-4">
            <p>You must be logged in to create a post</p>
          </div>
        )}
        <PostPage />

      </main>
    </div>
  );
}
