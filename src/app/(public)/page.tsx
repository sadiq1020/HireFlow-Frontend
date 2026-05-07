import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import FeaturedJobs from "@/components/home/FeaturedJobs";
import HowItWorks from "@/components/home/HowItWorks";
import TopCompanies from "@/components/home/TopCompanies";
import Testimonials from "@/components/home/Testimonials";
import AIFeatureHighlight from "@/components/home/AIFeatureHighlight";
import BlogPreview from "@/components/home/BlogPreview";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";

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
