import { FeatureHighlightSection } from "@/components/homepage/feature-highlight-section";
import { FeaturedProductsSection } from "@/components/homepage/featured-products-section";
import { HeroSection } from "@/components/homepage/hero-section";
import { Navbar } from "@/components/layouts/navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <FeatureHighlightSection />
      <FeaturedProductsSection />
    </div>
  );
}
