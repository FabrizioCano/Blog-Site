import { useState } from "react";
import { register } from "../../api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../contexts/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });

  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (credentialResponse) => {

    if (!credentialResponse.credential) {
      toast.error("Google login failed: Missing token.");
      return;
    }

    try {
      await googleLogin(credentialResponse.credential);
      navigate("/",{ replace: true });
    } catch (error) {
      toast.error("Google login failed");
    }
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await register(
        form.username,
        form.email,
        form.password1,
        form.password2
      );

      toast.success("User registered successfully!");
      navigate("/login");
    } catch (error) {
      if (error.data) {
        const errors = error.data;
        Object.values(errors).forEach((messages) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => toast.error(msg));
          } else {
            toast.error(messages);
          }
        });
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-md relative z-10">
        <Header
          heading="Register"
          paragraph="Already have an account?"
          linkName="Login"
          linkUrl="/login"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700"
          />

          <input
            required
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700"
          />

          <input
            required
            name="password1"
            type="password"
            placeholder="Password"
            value={form.password1}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700"
          />

          <input
            required
            name="password2"
            type="password"
            placeholder="Confirm Password"
            value={form.password2}
            onChange={handleChange}
            className="w-full border rounded-md py-2 px-3 text-gray-700"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
          >
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 mb-2">Or register with Google:</p>
          <GoogleLogin
            onSuccess={handleGoogleLoginSuccess}
            onError={() => toast.error("Google Login Failed")}
            width="100"
          />

        </div>
      </div>
    </div>
  );
}
