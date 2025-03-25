import axiosInstance from "@/lib/axiosInstance";
import { useStateStore } from "@/store/state";
import { useUserStore } from "@/store/user";
import { ApiError } from "@/types/api_error";
import { ApiResponse } from "@/types/api_response";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Game = () => {
  const { id } = useParams();
  const [url, setUrl] = useState("");
  const { loading, setLoading, error, setError } = useStateStore();
  const { user, setUser } = useUserStore();
  const gameInit = async () => {
    setLoading(true);
    try {
      const responses = await axiosInstance.post<ApiResponse<{ url: string }>>(
        "/game_init",
        { token: user.token, gameId: id }
      );

      if (
        responses.data.status.errorCode != 0 &&
        responses.data.status.errorCode != 200
      )
        throw new ApiError(
          "An error has occured!",
          responses.data.status.errorCode,
          responses.data.status.mess
        );

      setUrl(responses.data.data.url);
    } catch (error) {
      if ((error as ApiError).statusCode === 401) {
        setUser(null);
      }
      setError(error as ApiError);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!url && id) (async () => gameInit())();
  }, []);
  if (loading) return "loading";
  if (error) return "error";
  if (url)
    return (
      <div className="w-screen h-screen">
        <iframe
          src={url}
          title="Embedded Website"
          className="w-full h-full border-none"
        ></iframe>
      </div>
    );
};

export default Game;
