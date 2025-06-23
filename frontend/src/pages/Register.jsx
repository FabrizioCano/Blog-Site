import { useState } from "react";
import { register } from "../../api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });
  const navigate = useNavigate();

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
      <div className="relative z-10 bg-white p-8 rounded-md shadow-lg w-full max-w-md">
        <Header
          heading="Register"
          paragraph="Already have an account?"
          linkName="Login"
          linkUrl="/login"
        />

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="username">Username</label>
            <input
              required
              name="username"
              id="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              className="appearance-none border rounded-md py-2 px-3 text-gray-700 w-full focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">Email</label>
            <input
              required
              name="email"
              id="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="appearance-none border rounded-md py-2 px-3 text-gray-700 w-full focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password1">Password</label>
            <input
              required
              name="password1"
              id="password1"
              type="password"
              placeholder="Password"
              value={form.password1}
              onChange={handleChange}
              className="appearance-none border rounded-md py-2 px-3 text-gray-700 w-full focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password2">Confirm Password</label>
            <input
              required
              name="password2"
              id="password2"
              type="password"
              placeholder="Confirm Password"
              value={form.password2}
              onChange={handleChange}
              className="appearance-none border rounded-md py-2 px-3 text-gray-700 w-full focus:outline-none focus:shadow-outline"
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
