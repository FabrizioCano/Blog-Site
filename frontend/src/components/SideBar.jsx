import { Link, useLocation } from "react-router-dom";
import { RxExit,RxHome,RxPerson,RxPlusCircled,RxAccessibility, RxEnter  } from "react-icons/rx";
import { useAuth } from "../contexts/AuthContext";
export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  // chequear si el usuario está autenticado
  // Si el usuario está autenticado, isAuthenticated será true, de lo contrario será false
  const isAuthenticated = !!user;
  // Obtener el nombre de usuario del usuario autenticado
  const username = user?.username;

  return (
    <aside className="w-full md:w-64 bg-gray-900 text-white p-6 shadow-lg flex flex-row md:flex-col items-center md:items-start justify-center md:justify-start space-x-6 md:space-x-0 space-y-0 md:space-y-6">
      <ul className="space-y-4 text-lg">
        <li className="flex items-center space-x-2">
          <h2 className="text-2xl font-bold mb-6 text-center">Menu</h2>
        </li>
        <li className="flex items-center space-x-2">
          <RxHome />
          <Link to="/" className="hover:text-blue-400">Home</Link>
        </li>

        {isAuthenticated && username ? (
          <>
            <li className="flex items-center space-x-2">
              <RxPlusCircled/>
              <Link to="/create" className="hover:text-blue-400">Create Post</Link>
            </li>
            <li className="flex items-center space-x-2">
              <RxPerson/>
              <Link to={`/profile/${username}`} className="hover:text-blue-400">
                My Profile
              </Link>
            </li>
            <li className="flex items-center space-x-2">
              <RxExit/>
              <button
                onClick={logout}
                className="hover:text-red-400"
              >
                
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className="flex items-center space-x-2">
              <RxEnter/>
              <Link to="/login" className="hover:text-blue-400">Login</Link>
            </li>
            <li className="flex items-center space-x-2">
              <RxAccessibility />
              <Link to="/register" className="hover:text-blue-400">Register</Link>
            </li>
          </>
        )}
      </ul>
    </aside>
  );
}
