import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import defaultImage from "../assets/default.jpg";
export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/feed/posts/${id}/`);
        if (!res.ok) throw new Error("Post not found");
        const data = await res.json();
        setPost(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchPost();
  }, [id]);

  if (error) {
    return <div className="text-center mt-10 text-red-600">{error}</div>;
  }

  if (!post) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl px-10 my-4 py-6 bg-white rounded-lg shadow-md mx-auto">
      <div className="flex justify-between items-center">
        <span className="font-light text-gray-600">
          {new Date(post.date).toLocaleString()}
        </span>
      </div>

      <div className="mt-2">
        <p className="mt-2 text-gray-700 text-lg">{post.text}</p>
      </div>

      <div className="flex justify-between items-center mt-4">
        <div>
          <Link
            to={`/profile/${post.author.username}`}
            className="flex items-center hover:bg-gray-100 px-2 py-1 rounded"
          >
            <img
              className="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block"
              src={post.author.profile?.image || defaultImage
              }
              alt="avatar"
            />
            <h1 className="text-gray-700 font-bold">{post.author.username}</h1>
          </Link>
        </div>
      </div>
    </div>
  );
}
