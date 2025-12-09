import { ShieldCheck, Truck, Zap } from "lucide-react";

export function FeatureHighlightSection() {
  return (
    <div className="border-t-4 border-border border-b-4">
      <section className="container mx-auto px-7 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-cyan-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
            <div className="bg-white border-2 border-black p-3 flex items-center justify-center">
              <Zap className="size-6" />
            </div>
            <div>
              <h3 className="font-black uppercase text-lg leading-tight">
                Fast Shipping
              </h3>
              <p className="text-sm font-medium">2-3 Days Delivery</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-pink-500 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
            <div className="bg-white border-2 border-black p-3 flex items-center justify-center">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h3 className="font-black uppercase text-lg leading-tight">
                100% Secure
              </h3>
              <p className="text-sm font-medium">Safe Payments</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-yellow-400 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer">
            <div className="bg-white border-2 border-black p-3 flex items-center justify-center">
              <Truck className="size-6" />
            </div>
            <div>
              <h3 className="font-black uppercase text-lg leading-tight">
                Free Returns
              </h3>
              <p className="text-sm font-medium">30 Days Policy</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
