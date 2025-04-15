import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import ServiceSection from "@/components/ServiceSection";
import PetListingSection from "@/components/PetListingSection";
import AboutUsSection from "@/components/AboutUsSection";
import CommunitySection from "@/components/CommunitySection";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import VolunteerSection from "@/components/VolunteerSection";
import PetCareSection from "@/components/PetCareSection";
import PetSuppliesSection from "@/components/PetSuppliesSection";

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
    <div className="min-h-screen bg-pink-50 ">
      <main>
        <HeroSection />
        <ServiceSection />
        <PetListingSection />
        <AboutUsSection />
        <CommunitySection />
        <WhatWeDoSection />
        <VolunteerSection />
        <PetCareSection />
        <PetSuppliesSection />
      </main>
    </div>
  );
};

export default HomePage;
