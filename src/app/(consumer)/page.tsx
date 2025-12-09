import { FeatureHighlightSection } from "@/components/homepage/feature-highlight-section";
import { FeaturedProductsSection } from "@/components/homepage/featured-products-section";
import { HeroSection } from "@/components/homepage/hero-section";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <FeatureHighlightSection />
      <FeaturedProductsSection />
    </div>
  );
}
