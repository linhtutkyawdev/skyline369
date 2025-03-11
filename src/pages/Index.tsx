import { useNavigate } from "react-router-dom";
import {
  Spade,
  Dice1,
  Smartphone,
  Layers,
  Dice5,
  Trophy,
  Heart,
  Gift,
  Club,
  Diamond,
  Square,
} from "lucide-react";
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
      icon: <Smartphone className="w-16 h-16 text-casino-silver" />,
      path: "/slots",
      isLive: false,
    },
    {
      title: "ROULETTE",
      icon: <Dice5 className="w-16 h-16 text-casino-silver" />,
      path: "/roulette",
      isLive: false,
    },
    {
      title: "BLACKJACK",
      icon: <Spade className="w-16 h-16 text-casino-silver" />,
      path: "/blackjack",
      isLive: true,
    },
    {
      title: "POKER",
      icon: (
        <div className="bg-casino-deep-blue p-3 rounded-full">
          <Spade className="w-12 h-12 text-casino-silver" />
        </div>
      ),
      path: "/poker",
      isLive: true,
    },
    {
      title: "DRAGON TIGER",
      icon: <Trophy className="w-16 h-16 text-casino-silver" />,
      path: "/dragon-tiger",
      isLive: false,
    },
    {
      title: "SIC BO",
      icon: (
        <div className="flex gap-2">
          <div className="bg-casino-blue p-2 rounded-md">
            <Dice1 className="w-8 h-8 text-red-500" />
          </div>
          <div className="bg-casino-blue p-2 rounded-md">
            <Dice1 className="w-8 h-8 text-red-500" />
          </div>
        </div>
      ),
      path: "/sic-bo",
      isLive: false,
    },
    {
      title: "BACCARAT",
      icon: <Layers className="w-16 h-16 text-casino-silver" />,
      path: "/baccarat",
      isLive: false,
    },
    {
      title: "TABLE",
      icon: <Diamond className="w-16 h-16 text-casino-silver" />,
      path: "/table",
      isLive: false,
    },
    {
      title: "LOTTERY",
      icon: <Gift className="w-16 h-16 text-casino-silver" />,
      path: "/lottery",
      isLive: false,
    },
    {
      title: "POKER",
      icon: <Club className="w-16 h-16 text-casino-silver" />,
      path: "/poker-game",
      isLive: false,
    },
    {
      title: "CARD",
      icon: <Heart className="w-16 h-16 text-casino-silver" />,
      path: "/card",
      isLive: false,
    },
    {
      title: "Shan Koe Mee",
      icon: <Spade className="w-16 h-16 text-casino-silver" />,
      path: "/skm",
      isLive: false,
    },
    {
      title: "Pai Gow",
      icon: <Square className="w-16 h-16 text-casino-silver" />,
      path: "/pg",
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
