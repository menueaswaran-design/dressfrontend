import HeroBanner from "@/components/home/HeroBanner";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedCollections from "@/components/home/FeaturedCollections";
import TrendingProducts from "@/components/home/TrendingProducts";
import NewArrivals from "@/components/home/NewArrivals";
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
      <NewArrivals />
      <BrandStory />
      <InstagramGallery />
      <NewsletterSection />
    </>
  );
}
