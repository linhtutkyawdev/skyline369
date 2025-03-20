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

const Index = () => {
  const navigate = useNavigate();
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
      title: "SLOTS",
      icon: <img src="/slots.png" className={IMAGE_CLASS_NAME} />,
      path: "/slots",
      isLive: false,
    },
    {
      title: "ROULETTE",
      icon: <img src="/roulette.png" className={IMAGE_CLASS_NAME} />,
      path: "/roulette",
      isLive: false,
    },
    {
      title: "BLACKJACK",
      icon: <img src="/blackjack.png" className={IMAGE_CLASS_NAME} />,
      path: "/blackjack",
      isLive: true,
    },
    {
      title: "POKER",
      icon: <img src="/poker.png" className={IMAGE_CLASS_NAME} />,
      path: "/poker",
      isLive: true,
    },
    {
      title: "DRAGON TIGER",
      icon: <img src="/dragon_tiger.png" className={IMAGE_CLASS_NAME} />,
      path: "/dragon tiger",
      isLive: false,
    },
    {
      title: "SIC BO",
      icon: <img src="/sicbo.png" className={IMAGE_CLASS_NAME} />,
      path: "/sic bo",
      isLive: false,
    },
    {
      title: "TABLE",
      icon: <Table2 className={IMAGE_CLASS_NAME} />,
      path: "/table",
      isLive: false,
    },
    {
      title: "LOTTERY",
      icon: <Clover className={IMAGE_CLASS_NAME} />,
      path: "/lottery",
      isLive: false,
    },
    {
      title: "CARD",
      icon: <Spade className={IMAGE_CLASS_NAME} />,
      path: "/card",
      isLive: false,
    },
    {
      title: "Shan Koe Mee",
      icon: <Heart className={IMAGE_CLASS_NAME} />,
      path: "/skm",
      isLive: false,
    },
    {
      title: "Pai Gow",
      icon: <Dice5 className={IMAGE_CLASS_NAME} />,
      path: "/paigow",
      isLive: false,
    },
    {
      title: "POKER",
      icon: <img src="/poker.png" className={IMAGE_CLASS_NAME} />,
      path: "/poker",
      isLive: false,
    },
    {
      title: "BACCARAT",
      icon: <img src="/baccarat.png" className={IMAGE_CLASS_NAME} />,
      path: "/baccarat",
      isLive: false,
    },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar />
      <div className="flex flex-col items-center justify-center h-full -mt-12 lg:-mt-8">
        <Logo />
        <Carousel
          opts={{
            align: "center",
            loop: true,
            slidesToScroll: 1,
          }}
          setApi={setApi}
          className="w-full"
        >
          <CarouselContent>
            {items.map((item, index) => (
              <CarouselItem
                key={item.title + index}
                className="px-3 md:px-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
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
