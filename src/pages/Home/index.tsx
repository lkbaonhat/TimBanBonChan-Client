import { useEffect } from "react";
import HeroSection from "@/pages/Home/components/HeroSection";
import ServiceSection from "@/pages/Home/components/ServiceSection";
import PetListingSection from "@/pages/Home/components/PetListingSection";
import AboutUsSection from "@/pages/Home/components/AboutUsSection";
import CommunitySection from "@/pages/Home/components/CommunitySection";
import WhatWeDoSection from "@/pages/Home/components/WhatWeDoSection";
import VolunteerSection from "@/pages/Home/components/VolunteerSection";
import PetCareSection from "@/pages/Home/components/PetCareSection";
import PetSuppliesSection from "@/pages/Home/components/PetSuppliesSection";

const HomePage = () => {
  useEffect(() => {
    // Add scroll animation
    const handleScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;
        if (isVisible) {
          element.classList.add("animate-fade-in");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger once on load
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <ServiceSection />
        <PetListingSection />
        <AboutUsSection />
        <CommunitySection />
        <WhatWeDoSection />
        <VolunteerSection />
        <PetCareSection />
        {/* <PetSuppliesSection /> */}
      </main>
    </div>
  );
};

export default HomePage;
