import { useEffect } from "react";
import PetCareHandbook from "./components/PetCareHandbook";
import VeterinaryClinics from "./components/VeterinaryClinics";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

export default function PetCare() {
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Sổ tay chăm sóc thú cưng" },
  ];

  useEffect(() => {
    // Add scroll animation classes
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");

      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight - 100) {
          element.classList.add("animate-fadeInLeft");
        }
      });
    };

    window.addEventListener("scroll", animateOnScroll);
    // Initial check for elements in view on page load
    animateOnScroll();

    return () => {
      window.removeEventListener("scroll", animateOnScroll);
    };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="animate-on-scroll opacity-0">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Pet Care Handbook Section */}
      <div className="animate-on-scroll opacity-0">
        <PetCareHandbook />
      </div>

      {/* Veterinary Clinics Section */}
      <div className="animate-on-scroll opacity-0">
        <VeterinaryClinics />
      </div>
    </div>
  );
}
