import axiosInstance from "@/lib/axiosInstance";
import { useStateStore } from "@/store/state";
import { useUserStore } from "@/store/user";
import { ApiError } from "@/types/api_error";
import { ApiResponse } from "@/types/api_response";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

const Game = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
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
  if (error) return "error";
  if (loading || !url)
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="text-casino-gold text-2xl font-bold flex gap-2 items-center">
            <Loader2 className="w-8 h-8 animate-spin" />
            Loading
          </div>
          <div className="text-casino-silver text-lg font-semibold">
            Please wait a moment.
          </div>
        </div>
      </div>
    );
  if (url)
    return (
      <div className="w-screen h-screen">
        <button
          onClick={() => navigate(searchParams.get("back"))}
          className="flex bg-gradient-to-r from-transparent via-slate-950/50 to-black p-2 ps-4 pe-12 absolute top-0 right-0 items-center gap-2 text-casino-silver hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        <iframe
          src={url}
          title="Embedded Website"
          className="w-full h-full border-none"
        ></iframe>
      </div>
    );
};

export default Game;
