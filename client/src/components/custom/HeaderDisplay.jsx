import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";

const HeaderDisplay = () => {
  const imagesData = [
    "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/6311391/pexels-photo-6311391.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/1667070/pexels-photo-1667070.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/1571458/pexels-photo-1571458.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/704569/pexels-photo-704569.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1400",
    "https://images.pexels.com/photos/115655/pexels-photo-115655.jpeg?auto=compress&cs=tinysrgb&w=1400",
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const totalSlides = imagesData.length;
  const intervalRef = useRef(null);

  // Autoplay
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % totalSlides);
    }, 4000);

    return () => clearInterval(intervalRef.current);
  }, [totalSlides]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  return (
    <div className="relative pt-16 my-10 mx-auto w-[93vw]">
      <div className="relative overflow-hidden rounded-3xl">
        <Carousel className="overflow-hidden">
          <CarouselContent
            style={{
              transform: `translateX(-${activeIndex * 100}%)`,
              transition: "transform 0.6s ease-in-out",
            }}
            className="flex"
          >
            {imagesData.map((image, index) => (
              <CarouselItem key={index} className="min-w-full">
                <div className="h-[60vh] w-full">
                  <img
                    src={image}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-105"
                    alt={`Slide ${index + 1}`}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {/* Custom Prev Button */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full bg-white/70 backdrop-blur-sm px-3 py-2 shadow-lg hover:bg-white/90 transition-all duration-200"
        >
          ◀
        </button>

        {/* Custom Next Button */}
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full bg-white/70 backdrop-blur-sm px-3 py-2 shadow-lg hover:bg-white/90 transition-all duration-200"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

export default HeaderDisplay;
