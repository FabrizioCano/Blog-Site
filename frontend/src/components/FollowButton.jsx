import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

function FollowButton({ profileUsername, initialIsFollowing,onToggleFollow }) {
  const { authFetch } = useAuth();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [loading, setLoading] = useState(false);

  //funcion para manejar el click en el botón de seguir/dejar de seguir
  //si el usuario ya está siguiendo, se le deja de seguir, si no lo está
  async function handleClick() {
    if (loading) return;
    setLoading(true);

    try {
      // Determinar la acción a realizar (seguir o dejar de seguir)
      const action = isFollowing ? "unfollow" : "follow";
      // Realizar la petición al backend para seguir/dejar de seguir
      const res = await authFetch(`${API_URL}/followers/follow-unfollow/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, username: profileUsername }),
      });
      // Verificar si la respuesta fue exitosa
      if (!res.ok) throw new Error("Error toggling follow");
      await res.json();
      // Actualizar el estado local y llamar a la función de callback si se proporciona
      const newFollowState=!isFollowing;
      setIsFollowing(!isFollowing);

      // Si se proporciona una función de callback, llamarla con el nuevo estado
      if(onToggleFollow) {
        onToggleFollow(newFollowState);
      }
    } catch {
      toast.error("Failed to update follow status.");
    }
    // Restablecer el estado de carga
    setLoading(false);
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`bg-white text-gray-800 font-bold rounded border-b-2 border-green-500
        hover:border-green-600 hover:bg-green-500 hover:text-white shadow-md py-1 px-3 inline-flex items-center text-sm mt-4`}
      type="button"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export default FollowButton;
