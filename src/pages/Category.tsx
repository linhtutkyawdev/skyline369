import { Game } from "@/types/game";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, LoaderPinwheel, LucideTriangle, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useGameStore } from "@/store/game";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/store/user";
import { APIResponse } from "@/types/api_response";
import { GameData } from "@/types/game_data";
import { usePageStore } from "@/store/page";
import { useProductCodeStore } from "@/store/productCode";
import { cn } from "@/lib/utils";
import { useModalStore } from "@/store/modal";
import { useTranslation } from "react-i18next";

export default function Category() {
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  const [productCodes, setProductCodes] = useState<string[]>([]);
  const [productCode, setProductCode] = useState("");
  const { gameType } = useParams();
  const { t } = useTranslation();
  const { user } = useUserStore();
  const { games, loading, error, addGames, setLoading, setError } =
    useGameStore();
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const { pages, getPage, setPages, setPage } = usePageStore();
  const { setActiveModal } = useModalStore();

  const loadGames = async () => {
    setLoading(true);

    try {
      const page = getPage(gameType, productCode);
      if (!page || page.currentPage < page.lastPage) {
        const responses = await axiosInstance.post<APIResponse<GameData>>(
          "/get_game_list",
          {
            token: user.token,
            page: (page && page.currentPage) || 1,
            gameType,
            productCode,
          }
        );
        addGames(responses.data.data.data);
        setPage({
          ...page,
          currentPage: page ? page.currentPage + 1 : 2,
          lastPage: responses.data.data.last_page,
        });
      } else {
        addGames([]);
      }
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };
  const loadProductCodes = async () => {
    setLoading(true);
    try {
      const responses = await axiosInstance.post<APIResponse<string[]>>(
        "/get_game_vendor",
        { token: user.token, gameType }
      );
      setProductCodes(responses.data.data);
      setPages(
        Array.from(
          new Map(
            [
              {
                gameType,
                productCode: "",
                currentPage: 1,
                lastPage: 2,
              },
              ...pages,
              ...responses.data.data.map((productCode) => ({
                gameType,
                productCode,
                currentPage: 1,
                lastPage: 2,
              })),
            ].map((item) => [`${item.gameType}-${item.productCode}`, item])
          ).values()
        )
      );
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  };

  // Setup intersection observer for infinite scroll
  const lastGameElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
          await loadGames();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading]
  );

  useEffect(() => {
    (async () => {
      if (productCodes.length === 0) {
        await loadProductCodes();
      }
    })();
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      const filteredGames = games.filter(
        (game) =>
          game.gameType === gameType &&
          (!productCode || game.productCode === productCode)
        // && game.is_mobile === (isMobile ? "1" : "0")
      );
      setFilteredGames(filteredGames);
    }
  }, [games]);

  useEffect(() => {
    loadGames();
  }, [productCode]);

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="h-screen overflow-y-scroll scrollbar-none">
      <div className="fixed top-0 w-full flex justify-between items-end z-50 glass-effect animate-fade-in px-4 py-4">
        <div className="flex flex-col justify-start">
          <div className="flex items-center gap-2 xl:gap-4 ml-4">
            <div
              onClick={() => setActiveModal("profile")}
              className="w-10 h-10 xl:w-12 xl:h-12 2xl:w-14 2xl:h-14 rounded-full overflow-hidden border-2 border-casino-gold flex items-center justify-center cursor-pointer transition-all hover:border-4 hover:scale-105"
            >
              <div className="bg-casino-light-blue w-full h-full flex items-center justify-center">
                <User className="w-6 h-6 2xl:w-10 2xl:h-10 text-casino-silver" />
              </div>
            </div>
            {/* Username and Balance  */}

            <div className="flex flex-col items-start">
              <span className="text-casino-silver font-semibold 2xl:text-lg">
                {(user && user.name) || t("register_login")}
              </span>
              <span className="text-casino-gold text-sm">
                {user && user.balance
                  ? parseFloat(user.balance).toFixed(2)
                  : ""}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors mx-4 mt-2"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
        {/* Provider productCodes */}
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-bold capitalize text-center pb-4 hidden xl:block ">
            {gameType}
          </h1>
          <div className="flex items-center gap-2 overflow-scroll flex-wrap scrollbar-none justify-center px-4">
            {productCodes.length > 0 &&
              productCodes.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setProductCode(tab == productCode ? "" : tab);
                  }}
                  className={`px-3 py-1 xl:px-4 xl:py-2 rounded-full whitespace-nowrap ${
                    productCode === tab
                      ? "bg-casino-gold text-casino-deep-blue font-medium"
                      : "bg-gradient-to-r from-casino-light-blue/80 to-casino-deep-blue/80 text-casino-silver"
                  }`}
                >
                  {tab}
                </button>
              ))}
          </div>
        </div>

        {/* search box */}
        <div className="flex flex-col items-center">
          <h1 className="text-lg x:text-2xl font-bold capitalize text-center pb-2 xl:hidden">
            {gameType}
          </h1>
          <input
            onChange={(e) => {
              setFilteredGames(
                games.filter((game) =>
                  game.gameName
                    .toLowerCase()
                    .includes(e.target.value.toLowerCase())
                )
              );
            }}
            type="text"
            placeholder="Search"
            className="w-full px-3 py-1 xl:px-4 xl:py-2 rounded-full bg-casino-deep-blue text-casino-silver placeholder:text-casino-silver"
          />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-12 xl:pt-40 pt-32"
      >
        {filteredGames.map((game, index) => {
          return (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * (index % 6) }}
              className="game-card overflow-hidden"
            >
              <div className="relative">
                <img
                  src={isMobile ? game.m_img : game.img}
                  alt={game.gameName}
                  className="w-full h-32 max-h-32 lg:h-40 lg:max-h-40 2xl:h-56 2xl:max-h-56 object-cover"
                />
                {game.on_line === "1" && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="animate-pulse w-2 h-2 bg-white rounded-full"></span>
                      LIVE
                    </div>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 px-2 py-1 rounded text-xs text-white">
                  100 players
                </div>
              </div>
              <div className="p-4 bg-gradient-to-t from-casino-deep-blue to-transparent min-h-40">
                <h3 className="text-white text-xl font-semibold">
                  {game.gameName}
                </h3>
                <p className="text-casino-silver text-sm mt-1">
                  {game.productCode}
                </p>
                <button className="mt-3 px-4 py-2 bg-casino-gold text-casino-deep-blue rounded-md font-medium hover:bg-opacity-90 transition-all">
                  Play Now
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {filteredGames.length < 15 && loading && (
        <div className="text-center py-6">
          <div className="inline-block w-8 h-8 border-4 border-casino-light-blue border-t-casino-gold rounded-full animate-spin"></div>
          <p className="text-casino-silver mt-2">Loading more games...</p>
        </div>
      )}

      {getPage(gameType, productCode) &&
      getPage(gameType, productCode).currentPage >=
        getPage(gameType, productCode).lastPage ? (
        <div className="text-center py-6 text-casino-silver">
          No more games to load
        </div>
      ) : (
        filteredGames.length >= 15 && (
          <div
            className="relative flex items-center justify-center -mt-12"
            ref={lastGameElementRef}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                className="fill-casino-deep-blue/40"
                d="M0,288L60,288C120,288,240,288,360,256C480,224,600,160,720,160C840,160,960,224,1080,256C1200,288,1320,288,1380,288L1440,288L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              ></path>
            </svg>
            <LoaderPinwheel className="absolute xl:bottom-10 w-16 h-16 animate-spin bottom-5 text-casino-gold" />
          </div>
        )
      )}
    </div>
  );
}
