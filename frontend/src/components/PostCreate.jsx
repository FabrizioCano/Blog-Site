import { useState } from "react";
import { authFetch } from "../utils/auth";
import { useNavigate } from "react-router-dom";
export default function PostCreate() {
  const [form, setForm] = useState({ text: "" });
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");
    if (!token) {
      alert("You must be logged in to create a post.");
      return;
    }

    const postUrl = `${import.meta.env.VITE_API_URL}/feed/posts/create/`;
    try {
      const res = await authFetch(postUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: form.text }),
      });

      if (!res.ok) throw new Error("Error creating post");

      setForm({ text: "" });
      alert("Post created successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to create post.");
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 max-w-xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Create a Post</h2>

      <textarea
        name="text"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        rows={4}
        placeholder="What's on your mind?"
        value={form.text}
        onChange={handleChange}
        required
        maxLength={240}
      ></textarea>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Post
        </button>
      </div>
    </form>
  );
}
