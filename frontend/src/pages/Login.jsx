import { useState } from "react";
import { login as loginRequest } from "../../api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-toastify";
import loginImage from "../assets/thought-catalog-505eectW54k-unsplash.jpg";
import { useAuth } from "../contexts/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate("/",{ replace: true });
    } catch (error) {
      toast.error("Google login failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginRequest(username, password);

      if (data.access) {
        login({ access: data.access, refresh: data.refresh });
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
          style={{ objectPosition: "50% 30%" }}
        />
      </div>

      <div className="relative z-10 bg-white p-8 rounded-md shadow-lg w-full max-w-md">
        <Header
          heading="Login"
          paragraph="Don't have an account?"
          linkName="Register"
          linkUrl="/register"
        />

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              required
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="appearance-none border rounded-md py-2 px-3 text-gray-700 w-full focus:outline-none focus:shadow-outline"
            />
          </div>

          <div>
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              required
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="appearance-none border rounded-md py-2 px-3 text-gray-700 w-full focus:outline-none focus:shadow-outline"
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

        <div className="mt-6 text-center">
          <p className="text-gray-500 mb-2">Or login with Google:</p>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => toast.error("Google Login Failed")}
            width="100%"
          />

        </div>
      </div>
    </div>
  );
}
