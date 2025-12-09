import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <div className="bg-[#F5F5F5]">
      <section className="container mx-auto px-7 py-20 lg:py-32 ]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col items-start gap-6">
            <div className="bg-yellow-300 border-2 border-black px-3 py-1 text-xs font-bold uppercase -rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              New Collection 2025
            </div>
            <h1 className="text-6xl lg:text-8xl font-black uppercase leading-[0.9] tracking-tighter">
              Bold <br />
              Style. <br />
              <span className="text-cyan-400">No Limits.</span>
            </h1>
            <p className="text-lg font-medium max-w-md">
              Express yourself with products that don't compromise. Maximum
              impact, zero boring.
            </p>
            <div className="flex items-center gap-4">
              <Button className="bg-cyan-400 hover:bg-cyan-500 h-12 px-8 text-base">
                SHOP NOW <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button variant="neutral" className="h-12 px-8 text-base">
                VIEW COLLECTION
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video bg-pink-400 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden rotate-3 hover:rotate-0 transition-all duration-500">
              <Image
                src="/hero-brutal.jpg"
                alt="Hero Image"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
