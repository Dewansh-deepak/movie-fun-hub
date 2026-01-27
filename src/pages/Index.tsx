import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import GenreSection from "@/components/GenreSection";
import TrendingSection from "@/components/TrendingSection";
import FreshReleasesSection from "@/components/FreshReleasesSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <GenreSection />
        <TrendingSection />
        <FreshReleasesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
