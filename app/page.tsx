import HeroBanner from "@/components/home/HeroBanner";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import TrendingProducts from "@/components/home/TrendingProducts";
import BestSellers from "@/components/home/BestSellers";
import LimitedEdition from "@/components/home/LimitedEdition";
import SaleOffers from "@/components/home/SaleOffers";
import PromoBanner from "@/components/home/PromoBanner";
import BrandStory from "@/components/home/BrandStory";
import InstagramGallery from "@/components/home/InstagramGallery";
import NewsletterSection from "@/components/home/NewsletterSection";

export default function Home() {
  return (
    <>
      <HeroBanner />
      <FeaturedCategories />
      <FeaturedCollections />
      <TrendingProducts />
      <BestSellers />
      <LimitedEdition />
      <SaleOffers />
      <PromoBanner />
      <BrandStory />
      <InstagramGallery />
      <NewsletterSection />
    </>
  );
}
