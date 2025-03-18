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

  const items = [
    {
      title: "SLOTS",
      icon: (
        <img
          src="/slots.png"
          className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]"
        />
      ),
      path: "/slots",
      isLive: false,
    },
    {
      title: "ROULETTE",
      icon: (
        <img
          src="/roulette.png"
          className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]"
        />
      ),
      path: "/roulette",
      isLive: false,
    },
    {
      title: "BLACKJACK",
      icon: (
        <img
          src="/blackjack.png"
          className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]"
        />
      ),
      path: "/blackjack",
      isLive: true,
    },
    {
      title: "POKER",
      icon: (
        <img
          src="/poker.png"
          className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]"
        />
      ),
      path: "/poker",
      isLive: true,
    },
    {
      title: "DRAGON TIGER",
      icon: (
        <img
          src="/dragon_tiger.png"
          className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]"
        />
      ),
      path: "/dragon-tiger",
      isLive: false,
    },
    {
      title: "SIC BO",
      icon: (
        <img
          src="/sicbo.png"
          className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]"
        />
      ),
      path: "/sic-bo",
      isLive: false,
    },
    {
      title: "TABLE",
      icon: <Table2 className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]" />,
      path: "/table",
      isLive: false,
    },
    {
      title: "LOTTERY",
      icon: <Clover className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]" />,
      path: "/lottery",
      isLive: false,
    },
    {
      title: "CARD",
      icon: <Spade className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]" />,
      path: "/card",
      isLive: false,
    },
    {
      title: "Shan Koe Mee",
      icon: <Heart className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]" />,
      path: "/skm",
      isLive: false,
    },
    {
      title: "Pai Gow",
      icon: <Dice5 className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]" />,
      path: "/paigow",
      isLive: false,
    },
    {
      title: "POKER",
      icon: (
        <img
          src="/poker.png"
          className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]"
        />
      ),
      path: "/poker-game",
      isLive: false,
    },
    {
      title: "BACCARAT",
      icon: (
        <img
          src="/baccarat.png"
          className="w-20 h-20 lg:w-[6.5rem] lg:h-[6.5rem]"
        />
      ),
      path: "/baccarat",
      isLive: false,
    },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <NavBar />
      <div className="flex flex-col items-center justify-center h-full -mt-8 md:pt-0">
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

          <div className="hidden lg:flex justify-center gap-6 lg:mt-8">
            <CarouselPrevious className="static bg-casino-deep-blue border-casino-silver hover:bg-casino-light-blue text-white" />
            <CarouselNext className="static bg-casino-deep-blue border-casino-silver hover:bg-casino-light-blue text-white" />
          </div>
        </Carousel>
      </div>
      <FooterNav />
    </div>
  );
};

export default Index;
