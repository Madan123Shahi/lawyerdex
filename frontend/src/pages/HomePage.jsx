import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import PracticeCategories from '../components/home/PracticeCategories';
import StatsSection from '../components/home/StatsSection';
import WhyLawyerDex from '../components/home/WhyLawyerDex';
import LegalArticles from '../components/home/LegalArticles';
import CTABanner from '../components/home/CTABanner';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <PracticeCategories />
      <StatsSection />
      <WhyLawyerDex />
      <LegalArticles />
      <CTABanner />
    </>
  );
}
