import AIFeatureHighlight from "@/components/home/AIFeatureHighlight";
import BlogPreview from "@/components/home/BlogPreview";
import CategoriesSection from "@/components/home/CategoriesSection";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/home/FAQSection";
import FeaturedJobs from "@/components/home/FeaturedJobs";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import StatsSection from "@/components/home/StatsSection";
import Testimonials from "@/components/home/Testimonials";
import TopCompanies from "@/components/home/TopCompanies";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturedJobs />
      <HowItWorks />
      <AIFeatureHighlight />
      <TopCompanies />
      <Testimonials />
      <BlogPreview />
      <FAQSection />
      <CTASection />
    </div>
  );
}
