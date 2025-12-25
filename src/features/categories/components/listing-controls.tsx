"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatRupiah, parseRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ProductWithAvailability } from "@/types";
import { Filter, SlidersHorizontal, ChevronDown, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface ListingControlsProps {
  searchQuery: string;
  onSearch: (q: string) => void;
  onFilter: (
    minPrice: string,
    maxPrice: string,
    availability: ProductWithAvailability
  ) => void;
  onResetFilter: () => void;
  initMinPrice?: string;
  initMaxPrice?: string;
}

export function ListingControls({
  onSearch,
  searchQuery,
  onFilter,
  onResetFilter,
  initMinPrice,
  initMaxPrice,
}: ListingControlsProps) {
  const [qPlaceholder, setQPlaceholder] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>(initMinPrice ?? "");
  const [maxPrice, setMaxPrice] = useState<string>(initMaxPrice ?? "");
  const [selectedAvailability, setSelectedAvailability] =
    useState<ProductWithAvailability>("in_stock");

  const timer = useRef<NodeJS.Timeout>(undefined);

  const search = (q: string) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onSearch(q);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQPlaceholder(query);
    search(query);
  };

  useEffect(() => {
    const decodedQuery = decodeURIComponent(searchQuery);
    setQPlaceholder(decodedQuery);
  }, [searchQuery]);

  const handleApply = () => {
    if (Number(minPrice) > Number(maxPrice)) {
      toast.error("Min price must be less than max price");
      return;
    }

    onFilter(minPrice, maxPrice, selectedAvailability);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-12 items-stretch md:items-center justify-between relative">
      <div className="absolute -top-6 -left-4 bg-yellow-300 border-2 border-black px-2 py-1 text-[10px] font-black uppercase -rotate-12 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20 pointer-events-none">
        New Items!
      </div>

      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1">
        <Sheet>
          <SheetTrigger asChild>
            <Button className="h-14 px-6 border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all bg-white text-black group">
              <Filter className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              <span className="font-black uppercase tracking-tight text-lg">
                Filters
              </span>
              <div className="ml-3 bg-black text-white px-2 py-0.5 text-xs rounded-full">
                3
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent className="border-l-4 border-black p-0 sm:max-w-md">
            <div className="h-full flex flex-col bg-[#FDFDFD]">
              <SheetHeader className="p-8 border-b-4 border-black bg-emerald-400">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 bg-black flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-black uppercase text-xs tracking-[0.2em]">
                    Refine Search
                  </span>
                </div>
                <SheetTitle className="text-5xl font-black uppercase italic leading-none tracking-tighter">
                  Filter
                  <br />
                  Products
                </SheetTitle>
                <SheetDescription className="text-black font-bold mt-2 opacity-80">
                  Narrow down your selection to find the perfect piece.
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-8 space-y-10">
                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase italic border-b-2 border-black pb-2 flex justify-between items-center">
                    Price Range
                    <span className="text-xs bg-black text-white px-2 py-1 not-italic">
                      Optional
                    </span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase">
                        Min Price
                      </label>
                      <input
                        type="string"
                        placeholder="Rp 0"
                        className="w-full h-12 border-2 border-black p-4 font-bold focus:outline-none focus:bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                        value={formatRupiah(minPrice)}
                        onChange={(e) => {
                          let newValue = e.target.value;
                          newValue.replace(/[^a-zA-Z]/g, "");
                          setMinPrice(parseRupiah(newValue).toString());
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase">
                        Max Price
                      </label>
                      <input
                        type="string"
                        placeholder="Rp +"
                        className="w-full h-12 border-2 border-black p-4 font-bold focus:outline-none focus:bg-yellow-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                        value={formatRupiah(maxPrice)}
                        onChange={(e) => {
                          let newValue = e.target.value;
                          newValue.replace(/[^a-zA-Z]/g, "");
                          setMaxPrice(parseRupiah(newValue).toString());
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase italic border-b-2 border-black pb-2">
                    Availability
                  </h3>
                  <div className="flex gap-4">
                    <label
                      className={cn(
                        "flex-1 flex items-center justify-center h-12 border-2 border-black font-bold uppercase cursor-pointer hover:bg-black hover:text-white transition-colors relative overflow-hidden group",
                        selectedAvailability === "in_stock" &&
                          "bg-black text-white"
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only p-2"
                        checked={selectedAvailability === "in_stock"}
                        onChange={(e) =>
                          setSelectedAvailability(
                            e.target.checked ? "in_stock" : "out_of_stock"
                          )
                        }
                      />
                      <span>In Stock</span>
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-black translate-y-full group-hover:translate-y-0 transition-transform" />
                    </label>
                    <label
                      className={cn(
                        "flex-1 flex items-center justify-center h-12 border-2 border-black font-bold uppercase cursor-pointer hover:bg-black hover:text-white transition-colors relative overflow-hidden group",
                        selectedAvailability === "out_of_stock" &&
                          "bg-black text-white"
                      )}
                    >
                      <input
                        type="checkbox"
                        className="sr-only p-2"
                        checked={selectedAvailability === "out_of_stock"}
                        onChange={(e) =>
                          setSelectedAvailability(
                            e.target.checked ? "out_of_stock" : "in_stock"
                          )
                        }
                      />
                      <span>Out of Stock</span>
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-black translate-y-full group-hover:translate-y-0 transition-transform" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t-4 border-black bg-white flex gap-4">
                <Button
                  className="flex-1 h-16 border-4 border-black rounded-none bg-black text-white font-black uppercase tracking-widest text-lg shadow-[6px_6px_0px_0px_rgba(255,51,153,1)] active:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  onClick={handleApply}
                >
                  Apply
                </Button>
                <Button
                  className="h-16 px-6 font-bold uppercase text-neutral-400 hover:text-black bg-transparent border-none shadow-none hover:translate-x-0 hover:translate-y-0 translate-x-0 translate-y-0"
                  onClick={onResetFilter}
                >
                  Reset
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        <div className="relative flex-1 group">
          <input
            type="text"
            placeholder="Search within category..."
            className="w-full h-14 border-4 border-black p-6 pl-14 font-bold focus:outline-none focus:bg-pink-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors italic"
            value={qPlaceholder}
            onChange={handleInputChange}
          />
          <svg
            className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 group-focus-within:rotate-90 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-14 px-8 border-4 border-black rounded-none bg-indigo-500 text-white font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all group">
            <SlidersHorizontal className="w-5 h-5 mr-3 group-hover:-rotate-90 transition-transform" />
            Sort By
            <ChevronDown className="w-5 h-5 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 border-4 border-black rounded-none p-0 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] translate-y-2">
          <DropdownMenuLabel className="font-black uppercase tracking-tighter text-xl p-4 bg-black text-white italic">
            Choosing Order
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="m-0 h-1 bg-black" />
          <div className="p-2 bg-white">
            <DropdownMenuItem className="focus:bg-yellow-300 focus:text-black p-4 font-bold uppercase cursor-pointer rounded-none border-b-2 border-transparent hover:border-black transition-all">
              Latest Arrivals
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-yellow-300 focus:text-black p-4 font-bold uppercase cursor-pointer rounded-none border-b-2 border-transparent hover:border-black transition-all">
              Price: Lowest First
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-yellow-300 focus:text-black p-4 font-bold uppercase cursor-pointer rounded-none border-b-2 border-transparent hover:border-black transition-all text-pink-500">
              Price: Highest First
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-yellow-300 focus:text-black p-4 font-bold uppercase cursor-pointer rounded-none border-b-2 border-transparent hover:border-black transition-all">
              Best Sellers
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
