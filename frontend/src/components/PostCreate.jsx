import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";

export default function PostCreate() {
  const [form, setForm] = useState({ text: "" });
  const navigate = useNavigate();
  const {user, authFetch}= useAuth();

  // Maneja los cambios en el formulario
  // Actualiza el estado del formulario con el valor del campo correspondiente
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // Maneja el envío del formulario
  // Envía una solicitud POST al backend para crear un nuevo post
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica si el usuario está autenticado
    // Si no está autenticado, muestra un mensaje de error y no envía el formulario
    if (!user) {
      toast.error("You must be logged in to create a post.");
      return;
    }
    // Verifica que el campo de texto no esté vacío
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
      // Si la respuesta es exitosa, resetea el formulario y redirige al usuario a la página principal
      setForm({ text: "" });
      toast.success("Post created successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create post.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col px-4 py-8">

      <Header
        heading="Create a Post"
        paragraph="Want to see all posts?"
        linkName="Go Home"
        linkUrl="/"
      />


      <div className="flex-1 flex items-start justify-center">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg w-full max-w-4xl px-10 py-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Write something that can inspire others!
          </h2>

          <textarea
            name="text"
            className="border border-gray-300 bg-gray-50 rounded-md w-full py-3 px-4 text-gray-700 mb-6 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
            rows={6}
            placeholder="What's on your mind?"
            value={form.text}
            onChange={handleChange}
            required
            maxLength={240}
          ></textarea>

          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
