import { useNavigate } from "react-router-dom";
import { Spade, Dice5, Heart, Table2, Clover } from "lucide-react";
import NavBar from "@/components/NavBar";
import Logo from "@/components/Logo";
import FooterNav from "@/components/FooterNav";
import GameCategory from "@/components/GameCategory";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Import useTranslation

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(); // Get translation function
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<any>(null);

  // Update selected index when carousel changes
  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);

    // Call once to set initial index
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleCategoryClick = (path: string) => {
    navigate("/type" + path);
  };

  const isAdjacent = (index: number) => {
    const totalItems = items.length;
    const prevIndex = (currentIndex - 1 + totalItems) % totalItems;
    const nextIndex = (currentIndex + 1) % totalItems;
    return index === prevIndex || index === nextIndex;
  };

  // Reverted to original size for sm+
  const IMAGE_CLASS_NAME = "w-20 h-20 2xl:w-[6.5rem] 2xl:h-[6.5rem]";

  // 0: "roulette"
  // 1: "blackjack"
  // 2: "baccarat"
  // 3: "single poker"
  // 4: "dragon tiger"
  // 5: "sic bo"
  // 6: "table"
  // 7: "lottery"
  // 8: "poker"
  // 9: "slots"
  // 10: "card"
  // 11: "keno"
  // 12: "live dealer"
  // 13: "teen patti"
  // 14: "fish/shooting"
  // 15: "cluster"
  // 16: "other"
  // 17: "fruit game"
  // 18: "andar bahar"
  // 19: "arcade"
  // 20: "dragontiger"
  // 21: "fishing"
  // 22: "crash"
  // 23: "bingo"
  // 24: "instant win"
  // 25: "shooting"
  // 26: "сrash"
  // 27: "scratch card"
  // 28: "live diler"
  // 29: "casual"
  // 30: "dice"
  // 31: "plinko"
  // 32: "game_shows"

  const items = [
    {
      title: t("categorySlots"),
      icon: <img src="/slots.png" className={IMAGE_CLASS_NAME} />,
      path: "/slots",
      isLive: false,
    },
    {
      title: t("categoryRoulette"),
      icon: <img src="/roulette.png" className={IMAGE_CLASS_NAME} />,
      path: "/roulette",
      isLive: false,
    },
    {
      title: t("categoryBlackjack"),
      icon: <img src="/blackjack.png" className={IMAGE_CLASS_NAME} />,
      path: "/blackjack",
      isLive: true,
    },
    {
      title: t("categoryPoker"),
      icon: <img src="/poker.png" className={IMAGE_CLASS_NAME} />,
      path: "/poker",
      isLive: true,
    },
    {
      title: t("categoryDragonTiger"),
      icon: <img src="/dragon_tiger.png" className={IMAGE_CLASS_NAME} />,
      path: "/dragon tiger",
      isLive: false,
    },
    {
      title: t("categorySicBo"),
      icon: <img src="/sicbo.png" className={IMAGE_CLASS_NAME} />,
      path: "/sic bo",
      isLive: false,
    },
    {
      title: t("categoryTable"),
      icon: <Table2 className={IMAGE_CLASS_NAME} />,
      path: "/table",
      isLive: false,
    },
    {
      title: t("categoryLottery"),
      icon: <Clover className={IMAGE_CLASS_NAME} />,
      path: "/lottery",
      isLive: false,
    },
    {
      title: t("categoryCard"),
      icon: <Spade className={IMAGE_CLASS_NAME} />,
      path: "/card",
      isLive: false,
    },
    {
      title: t("categoryShanKoeMee"),
      icon: <Heart className={IMAGE_CLASS_NAME} />,
      path: "/skm",
      isLive: false,
    },
    {
      title: t("categoryPaiGow"),
      icon: <Dice5 className={IMAGE_CLASS_NAME} />,
      path: "/paigow",
      isLive: false,
    },
    {
      title: t("categoryPoker2"), // Using a different key for the second Poker entry
      icon: <img src="/poker.png" className={IMAGE_CLASS_NAME} />,
      path: "/poker",
      isLive: false,
    },
    {
      title: t("categoryBaccarat"),
      icon: <img src="/baccarat.png" className={IMAGE_CLASS_NAME} />,
      path: "/baccarat",
      isLive: false,
    },
  ];

  return (
    <div className="h-screen w-screen flex flex-col">
      <NavBar />
      {/* Reverted margin */}
      <div className="flex flex-col items-center justify-center h-full -mt-12 lg:-mt-8">
        <Logo />
        <Carousel
          opts={{
            align: "center",
            loop: true,
            slidesToScroll: 1,
          }}
          setApi={setApi}
          className="w-full mt-4 xl:mt-0"
        >
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem
                key={item.title + index}
                // Kept landscape adjustment
                className="px-3 md:px-4 basis-full sm:basis-1/3 lg:basis-1/4 xl:basis-1/5"
              >
                <GameCategory
                  title={item.title}
                  icon={item.icon}
                  onClick={() => handleCategoryClick(item.path)}
                  isSelected={index === currentIndex}
                  isAdjacent={isAdjacent(index)}
                  isLive={item.isLive}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Reverted gap, margin, and button sizes */}
          <div className="hidden xl:flex justify-center gap-6 lg:mt-8">
            <CarouselPrevious className="static bg-casino-deep-blue border-casino-silver hover:bg-casino-light-blue text-white w-6 h-6 2xl:w-8 2xl:h-8" />
            <CarouselNext className="static bg-casino-deep-blue border-casino-silver hover:bg-casino-light-blue text-white w-6 h-6 2xl:w-8 2xl:h-8" />
          </div>
        </Carousel>
      </div>
      <FooterNav />
    </div>
  );
};

export default Index;
