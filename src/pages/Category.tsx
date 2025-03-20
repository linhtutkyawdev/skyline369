import { Game } from "@/types/game";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, LoaderPinwheel, LucideTriangle } from "lucide-react";
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

export default function Category() {
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  const { productCodes, setProductCodes } = useProductCodeStore();
  const [productCode, setProductCode] = useState("");
  const { gameType } = useParams();
  const { user } = useUserStore();
  const {
    games,
    lastAddedCount,
    loading,
    error,
    addGames,
    setLoading,
    setError,
  } = useGameStore();
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const { pages, getPage, setPages, setPage } = usePageStore();

  const loadGames = async () => {
    setLoading(true);
    console.log("loadg");

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
        { token: user.token }
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

  const categoryRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    (async () => {
      if (productCodes.length === 0) {
        await loadProductCodes();
      }
    })();

    // scroll listener
    const handleScroll = () => {
      if (categoryRef.current) {
        setScrollPosition(categoryRef.current.scrollTop);
      }
    };
    const categoryElement = categoryRef.current;
    if (categoryElement) {
      categoryElement.addEventListener("scroll", handleScroll);
    }
    return () => {
      if (categoryElement) {
        categoryElement.removeEventListener("scroll", handleScroll);
      }
    };
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
    <div
      ref={categoryRef}
      className="h-screen overflow-y-scroll scrollbar-none"
    >
      <div
        className={cn(
          "flex flex-col sticky w-full top-0 left-0 z-50 backdrop-blur-lg mb-4 pt-4 transition-colors duration-100",
          { "bg-casino-deep-blue/90": scrollPosition >= 16 }
        )}
      >
        <AnimatePresence>
          {!isMobile && scrollPosition >= 16 && (
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: 40 }}
              className="flex items-center justify-between mb-8 fixed z-50 top-10 inset-x-10"
            >
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden lg:block">Back</span>
              </button>
              <div className="flex items-center h-full gap-2 text-casino-gold text-xs transition-colors lg:hidden">
                Scroll to the right
                <div className="rotate-90 ml-1">
                  <LucideTriangle className="w-3 h-3 animate-float" />
                </div>
              </div>
            </motion.div>
          )}
          {(isMobile || scrollPosition < 16) && (
            <>
              <motion.div
                initial={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="text-3xl font-bold text-center text-white mb-6 capitalize"
              >
                {gameType}
              </motion.div>
              <motion.div className="flex items-center justify-between mb-8 fixed top-10 inset-x-10">
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                </button>
                <div className="flex items-center h-full gap-2 text-casino-gold text-xs transition-colors lg:hidden">
                  Scroll to the right
                  <div className="rotate-90 ml-1">
                    <LucideTriangle className="w-3 h-3 animate-float" />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        {/* Provider productCodes */}
        <div className="mb-3 xl:mb-6 py-2 flex flex-nowrap justify-center gap-2 sticky overflow-auto lg:flex-wrap mx-10 scrollbar-none">
          {productCodes.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setProductCode(tab == productCode ? "" : tab);
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap ${
                scrollPosition >= 16
                  ? productCode === tab
                    ? "bg-casino-gold text-casino-deep-blue font-medium"
                    : "bg-gradient-to-r from-sky-800/40 to-indigo-800/40 text-casino-silver"
                  : productCode === tab
                  ? "bg-casino-gold text-casino-deep-blue font-medium"
                  : "bg-gradient-to-r from-sky-900/30 to-indigo-900/30 text-casino-silver"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-12"
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
              <div className="p-4 bg-gradient-to-t from-casino-deep-blue to-transparent">
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
