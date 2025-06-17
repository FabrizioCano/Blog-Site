import { Link } from 'react-router-dom';

export default function PostList({ posts, showDetailLink = true, isAuthenticated = false }) {
  return (
    <div className="flex flex-col items-center">
      {Array.isArray(posts) && posts.map((post) => (
        <div
          key={post.id}
          className="w-full max-w-4xl px-4 md:px-10 my-4 py-6 bg-white rounded-lg shadow-md"
        >
          <div className="flex justify-between items-center">
            <span className="font-light text-gray-600">
              {new Date(post.date).toLocaleString(undefined, {
                dateStyle: 'long',
                timeStyle: 'short',
              })}
            </span>
          </div>

          <div className="mt-2">
            <p className="mt-2 text-gray-600">{post.text}</p>
          </div>

          <div className="flex justify-between items-center mt-4">
            
            {showDetailLink ? (
              <Link
                className="text-blue-600 hover:underline"
                to={`/posts/${post.id}/`}
              >
                Read More
              </Link>
            ) : (
              <span>&nbsp;</span>
            )}

            <div className="flex items-center">
              <img
                className="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block"
                src={post.author.profile?.image || '../assets/default.jpg'}
                alt={`${post.author.username}'s profile picture`}
              />

              
              {isAuthenticated ? (
                <Link
                  className="text-gray-700 font-bold hover:underline"
                  to={`/profile/${post.author.username}`}
                >
                  {post.author.username}
                </Link>
              ) : (
                <div className="flex flex-col">
                  <span className="text-gray-700 font-bold">
                    {post.author.username}
                  </span>
                  <p className="text-sm text-gray-600">
                    Login to view profile
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
