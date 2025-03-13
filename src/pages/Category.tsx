import slotgatorAxiosInstance from "@/lib/slotgatorAxiosInstance";
import { cn } from "@/lib/utils";
import { Game } from "@/types/game";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useDataStore } from "@/store/data";

export default function Category() {
  const navigate = useNavigate();
  const { type } = useParams();
  const {
    data: { games, loading, page, hasMore, error },
    setLoading,
    setPage,
    addGames,
  } = useDataStore();

  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [providers, setProviders] = useState<string[]>([]);
  const [activeProvider, setActiveProvider] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);

  const loadGames = async () => {
    setLoading(true);
    const pageNumbers = Array.from({ length: 10 }, (_, i) => page + i); // Fetch 10 pages at once

    try {
      const responses = await Promise.all(
        pageNumbers.map((p) =>
          slotgatorAxiosInstance.get<{ items: Game[] }>("/games", {
            params: { page: p },
          })
        )
      );

      addGames(responses.flatMap((res) => res.data.items));
      setPage(page + 10);
      setLoading(false);
    } catch (error) {
      throw error;
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
      if (games.length == 0) {
        await loadGames();
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (games.length == 0 || !type || loading) return;
      const typeFilteredGames = games.filter(
        (game) => game.type == type && game.is_mobile == isMobile
      );

      const currentProviders = [];
      typeFilteredGames.map((game) => {
        if (!currentProviders.includes(game.provider)) {
          currentProviders.push(game.provider);
        }
      });
      setProviders(currentProviders);
      if (!activeProvider) setActiveProvider(currentProviders[0]);

      const filteredGames = typeFilteredGames.filter(
        (game) =>
          game.provider == activeProvider ||
          game.provider == currentProviders[0]
      );

      if (filteredGames.length < 6) {
        return await loadGames();
      }

      setFilteredGames(
        filteredGames.filter((game) => game.provider == activeProvider)
      );
    })();
  }, [games]);

  useEffect(() => {
    setFilteredGames(
      games.filter(
        (game) =>
          game.provider == activeProvider &&
          game.type == type &&
          game.is_mobile == isMobile
      )
    );
  }, [activeProvider]);

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="h-screen overflow-y-scroll pb-20 pt-6 px-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center mb-8"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center text-white mb-6 capitalize"
      >
        {type}
      </motion.h1>

      {/* Provider providers */}
      <div className="mb-6 overflow-x-auto pb-2 flex xl:justify-center gap-2">
        {providers.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveProvider(tab)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeProvider === tab
                ? "bg-casino-gold text-casino-deep-blue font-medium"
                : "bg-casino-deep-blue text-casino-silver"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredGames.map((game, index) => {
          // Apply ref to last element for infinite scroll
          const isLastElement = filteredGames.length === index + 1;

          return (
            <motion.div
              key={game.uuid}
              ref={isLastElement ? lastGameElementRef : null}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * (index % 6) }}
              className="game-card overflow-hidden"
            >
              <div className="relative">
                <img
                  src={game.image}
                  alt={game.name}
                  className="w-full h-48 object-cover"
                />
                {true && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="animate-pulse w-2 h-2 bg-white rounded-full"></span>
                      LIVE
                    </div>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 px-2 py-1 rounded text-xs text-white">
                  {Math.floor(Math.random() * 1000)} players
                </div>
              </div>
              <div className="p-4 bg-gradient-to-t from-casino-deep-blue to-transparent">
                <h3 className="text-white text-xl font-semibold">
                  {game.name}
                </h3>
                <p className="text-casino-silver text-sm mt-1">Live Dealer</p>
                <button className="mt-3 px-4 py-2 bg-casino-gold text-casino-deep-blue rounded-md font-medium hover:bg-opacity-90 transition-all">
                  Play Now
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {loading && (
        <div className="text-center py-6">
          <div className="inline-block w-8 h-8 border-4 border-casino-light-blue border-t-casino-gold rounded-full animate-spin"></div>
          <p className="text-casino-silver mt-2">Loading more games...</p>
        </div>
      )}
      {filteredGames.length > 0 && !loading && (
        <div className="text-center py-6 text-casino-silver">
          No more games to load
        </div>
      )}

      <div className="flex justify-center py-8">
        <button
          onClick={async () => await loadGames()}
          className={cn(
            "px-4 py-2 bg-casino-gold text-casino-deep-blue rounded-md font-medium hover:bg-opacity-90 transition-all",
            {
              hidden: loading,
            }
          )}
        >
          Forcely Load More Games
        </button>
      </div>
    </div>
  );
}
