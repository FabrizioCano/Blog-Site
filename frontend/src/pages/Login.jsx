import { useState } from "react";
import { login } from "../../api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-toastify";
import loginImage from "../assets/thought-catalog-505eectW54k-unsplash.jpg"

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await login(username, password);

      if (data.access) {
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);
        localStorage.setItem("username", username);

        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Login failed. Invalid credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Invalid credentials.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0">
        <img
          src={loginImage}
          alt="Login Background"
          className="w-full h-full object-cover object-left filter blur-lg brightness-50"
          style={{ objectPosition: '50% 30%' }}
        />

      </div>
      <div className="relative z-10 bg-white p-8 rounded-md shadow-lg w-full max-w-md">
        <Header
          heading="Login"
          paragraph="Don't have an account?"
          linkName="Register"
          linkUrl="/register"
        />

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              required
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="appearance-none border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              required
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="appearance-none border rounded-md py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline w-full"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
