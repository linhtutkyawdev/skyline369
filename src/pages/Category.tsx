import { Game } from "@/types/game";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, LoaderPinwheel, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { isMobile } from "react-device-detect";
import { useGameStore } from "@/store/game";
import axiosInstance from "@/lib/axiosInstance";
import { useUserStore } from "@/store/user";
import { ApiResponse } from "@/types/api_response";
import { GameData } from "@/types/game_data";
import { usePageStore } from "@/store/page";
import { useTranslation } from "react-i18next";
import { useStateStore } from "@/store/state";
import { useProductStore } from "@/store/product";
import { ApiError } from "@/types/api_error";

export default function Category() {
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { gameType } = useParams();

  const [productCode, setProductCode] = useState("");
  const [searchText, setSearchText] = useState("");
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const { user, setUser } = useUserStore();
  const { games, addGames, lastAddedGames } = useGameStore();
  const { pages, getPage, setPages, setPage } = usePageStore();
  const { products, setProducts, getProduct } = useProductStore();
  const { setActiveModal, loading, setLoading, error, setError } =
    useStateStore();

  const loadGames = async () => {
    setLoading(true);
    try {
      const page = getPage(gameType, productCode);
      if (!page || page.currentPage < page.lastPage) {
        const responses = await axiosInstance.post<ApiResponse<GameData>>(
          "/get_game_list",
          {
            token: user.token,
            page: (page && page.currentPage) || 1,
            gameType,
            productCode,
            isMobile: isMobile ? "1" : "0",
          }
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

        addGames(responses.data.data.data);
        setPage({
          gameType,
          productCode,
          currentPage:
            (page ? page.currentPage : responses.data.data.current_page) + 1,
          lastPage: responses.data.data.last_page,
        });
      } else {
        addGames([]);
      }
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setUser(null);
        setError(error);
      }
    }
    // finally {
    //   setLoading(false);
    // }
  };
  const loadProductCodesAndPages = async () => {
    setLoading(true);
    try {
      const responses = await axiosInstance.post<ApiResponse<string[]>>(
        "/get_game_vendor",
        { token: user.token, gameType }
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

      setProducts([
        ...products,
        {
          gameType,
          productCodes: responses.data.data,
        },
      ]);

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
              ...responses.data.data.map((productCode) => ({
                gameType,
                productCode,
                currentPage: 1,
                lastPage: 2,
              })),
              ...pages,
            ].map((item) => [`${item.gameType}-${item.productCode}`, item])
          ).values()
        )
      );
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setUser(null);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlayNow = async (game: Game) => {
    if (parseInt(user.balance) < 1) return;
    setLoading(true);
    try {
      const responses = await axiosInstance.post<
        ApiResponse<{ balance: string; game_balance: string }>
      >("/transfer_to_game", { token: user.token, amount: user.balance });

      if (
        responses.data.status.errorCode != 0 &&
        responses.data.status.errorCode != 200
      )
        throw new ApiError(
          "An error has occured!",
          responses.data.status.errorCode,
          responses.data.status.mess
        );

      navigate("/game/" + game.id);
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 401) {
        setUser(null);
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getProduct(gameType)) {
      (async () => {
        await loadProductCodesAndPages();
      })();
    }
  }, []);

  useEffect(() => {
    if (games.length > 0) {
      const filteredGames = games.filter(
        (game) =>
          game.gameType === gameType &&
          (!productCode || game.productCode === productCode) &&
          game.gameName
            .replace(" ", "")
            .toLowerCase()
            .includes(searchText.replace(" ", "").toLowerCase())
        // && game.is_mobile === (isMobile ? "1" : "0")
      );
      if (
        isIntersecting &&
        lastAddedGames.filter(
          (game) =>
            game.gameType === gameType &&
            (!productCode || game.productCode === productCode) &&
            game.gameName
              .replace(" ", "")
              .toLowerCase()
              .includes(searchText.replace(" ", "").toLowerCase())
          // && game.is_mobile === (isMobile ? "1" : "0")
        ).length < 15
      )
        setTimeout(async () => await loadGames(), 100);
      setFilteredGames(filteredGames);
    }
  }, [games]);

  useEffect(() => {
    if (getProduct(gameType)) (async () => await loadGames())();
  }, [productCode]);

  useEffect(() => {
    setFilteredGames(
      games.filter(
        (game) =>
          game.gameType === gameType &&
          (!productCode || game.productCode === productCode) &&
          game.gameName
            .replace(" ", "")
            .toLowerCase()
            .includes(searchText.replace(" ", "").toLowerCase())
        // && game.is_mobile === (isMobile ? "1" : "0") &&
      )
    );
  }, [searchText]);

  // Setup intersection observer for infinite scroll
  const lastGameElementRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      setIsIntersecting(entries[0].isIntersecting);
    });

    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    if (isIntersecting && !loading) (async () => loadGames())();
    else setLoading(false);
  }, [isIntersecting, pages]);

  if (!user || !user.token) setActiveModal("login");

  if (!getProduct(gameType)) {
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
  }

  return (
    <div className="h-[calc(100vh-6.4rem)] xl:h-[calc(100vh-7.6rem)] mt-[6.4rem] xl:mt-[7.6rem] overflow-y-scroll xl:scrollbar-none">
      <div className="fixed top-0 w-full flex justify-between items-end z-50 glass-effect animate-fade-in px-6 py-4">
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 xl:gap-4">
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
              <span className="text-casino-silver font-semibold text-sm 2xl:text-lg">
                {(user && user.name) || t("register_login")}
              </span>
              <span className="text-casino-gold text-xs">
                {user && user.balance ? "$ " + user.balance : ""}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-casino-silver hover:text-white transition-colors mt-2 text-sm xl:text-base"
          >
            <ArrowLeft className="w-4 h-4 xl:w-5 xl:h-5" />
            <span>Back</span>
          </button>
        </div>
        {/* Provider productCodes */}
        <div className="flex flex-col items-center">
          <h1 className="2xl:text-2xl text-lg text-white font-semibold 2xl:font-bold capitalize text-center pb-4 hidden xl:block ">
            {gameType}
          </h1>
          <div className="flex items-center gap-2 overflow-scroll flex-wrap scrollbar-none justify-center px-4">
            {getProduct(gameType).productCodes.length > 0 &&
              getProduct(gameType).productCodes.map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setProductCode(tab == productCode ? "" : tab);
                  }}
                  className={`px-3 py-1 xl:px-4 xl:py-2 rounded-full whitespace-nowrap text-sm 2xl:text-base font-semibold ${
                    productCode === tab
                      ? "bg-casino-gold text-casino-deep-blue font-medium"
                      : "bg-gradient-to-r from-[#001] to-casino-deep-blue text-casino-silver"
                  }`}
                >
                  {tab}
                </button>
              ))}
          </div>
        </div>

        {/* search box */}
        <div className="flex flex-col items-center">
          <h1 className="2xl:text-2xl text-lg text-white font-semibold 2xl:font-bold capitalize text-center pb-4 hidden xl:block ">
            {gameType}
          </h1>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-12 pt-4 xl:pt-8"
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
                  // src=""
                  src={
                    (isMobile ? game.m_img : game.img) || "/login_modal_bg.png"
                  }
                  alt={game.gameName}
                  className="object-cover w-full h-44 2xl:h-60 bg-casino-deep-blue"
                />
                {parseInt(game.on_line) > 0 && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <span className="animate-pulse w-2 h-2 bg-white rounded-full"></span>
                      LIVE
                    </div>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 px-2 py-1 rounded text-xs 2xl:text-sm text-white">
                  {game.on_line} players
                </div>
              </div>
              <div className="p-4 2xl:pt-6 bg-gradient-to-t h-40 2xl:h-48 from-casino-deep-blue to-transparent flex flex-col justify-center">
                <h3 className="text-white text-xl 2xl:text-2xl font-semibold">
                  {game.gameName}
                </h3>
                <p className="text-casino-silver text-sm 2xl:text-lg mt-1">
                  {game.productCode}
                </p>
                <button
                  onClick={() => handlePlayNow(game)}
                  className="mt-3 2xl:mt-6 px-4 py-2 bg-casino-gold text-casino-deep-blue rounded-md font-medium hover:bg-opacity-90 transition-all 2xl:text-xl"
                >
                  Play Now
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {getPage(gameType, productCode) &&
        getPage(gameType, productCode).currentPage <
          getPage(gameType, productCode).lastPage &&
        filteredGames.length < 15 && (
          <div ref={lastGameElementRef} className="text-center py-6">
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
