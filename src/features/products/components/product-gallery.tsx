"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ProductGalleryProps {
  images: {
    src: string;
    alt: string;
  }[];
}

function ZoomableImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority: boolean;
}) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePosition({ x, y });
  };

  return (
    <div
      className="relative aspect-square w-full overflow-hidden cursor-crosshair bg-neutral-100"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        className="object-cover transition-transform duration-200 ease-out"
        style={{
          transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
          transform: isHovering ? "scale(2)" : "scale(1)",
        }}
        priority={priority}
      />
    </div>
  );
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbnailApi, setThumbnailApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!mainApi) {
      return;
    }

    const onSelect = () => {
      const selectedIndex = mainApi.selectedScrollSnap();
      setCurrent(selectedIndex);
      thumbnailApi?.scrollTo(selectedIndex);
    };

    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);

    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, thumbnailApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi]
  );

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square w-full bg-neutral-100 flex items-center justify-center border-2 border-black">
        <span className="text-neutral-400 font-bold">No Image</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Carousel
        setApi={setMainApi}
        className="w-full bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <ZoomableImage
                src={image.src}
                alt={image.alt || "Product image"}
                priority={index === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 border-2" />
        <CarouselNext className="right-4 border-2" />
      </Carousel>
      <div className="mx-auto w-full">
        <Carousel
          setApi={setThumbnailApi}
          opts={{
            align: "start",
            containScroll: "keepSnaps",
            dragFree: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {images.map((image, index) => (
              <CarouselItem key={index} className="basis-1/4 pl-4 min-w-0">
                <button
                  type="button"
                  onClick={() => onThumbClick(index)}
                  className={cn(
                    "relative aspect-square w-full border-2 overflow-hidden transition-all",
                    current === index
                      ? "border-black border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] opacity-100"
                      : "border-neutral-200 opacity-60 hover:opacity-100 hover:border-black"
                  )}
                >
                  <Image
                    src={image.src}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <span className="sr-only">View image {index + 1}</span>
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
