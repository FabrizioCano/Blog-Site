import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("access");
    const storedUsername = localStorage.getItem("username");

    setIsAuthenticated(!!token);
    setUsername(storedUsername);
  }, [location]);

  return (
    <aside className="w-full md:w-64 bg-gray-900 text-white p-6 shadow-lg top-left-0 top-right-0">
      <h2 className="text-2xl font-bold mb-6">Menu</h2>
      <ul className="space-y-4 text-lg">
        <li>
          <Link to="/" className="hover:text-blue-400">Home</Link>
        </li>

        {isAuthenticated && username ? (
          <>
            <li>
              <Link to="/create" className="hover:text-blue-400">Create Post</Link>
            </li>
            <li>
              <Link to={`/profile/${username}`} className="hover:text-blue-400">
                My Profile
              </Link>
            </li>
            <li>
              <button
                onClick={() => {
                  localStorage.removeItem("access");
                  localStorage.removeItem("refresh");
                  localStorage.removeItem("username");
                  window.location.reload();
                }}
                className="hover:text-red-400"
              >
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="hover:text-blue-400">Login</Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-blue-400">Register</Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}
