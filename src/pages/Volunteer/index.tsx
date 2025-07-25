"use client";

import { useEffect } from "react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import HeroSection from "./components/HeroSection";
import FAQ from "./components/FAQ";
import ContactForm from "./components/ContactForm";
import ZeroSection from "./components/ZeroSection";
import ServiceSection from "../Home/components/ServiceSection";
import VolunteerRoles from "./components/VolunteerRoles";

const VolunteerPage = () => {
  // Add the pet illustration image
  const petIllustration =
    "https://res.cloudinary.com/drcj6f81i/image/upload/v1749081484/cvierrvysd5zs3xcy22g.png";

  useEffect(() => {
    // Add scroll animation classes
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");

      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight - 100) {
          element.classList.add("animate-fadeInUp");
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

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tình nguyện viên" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFEDFA]">
      <main className="flex-grow">
        <div className="animate-on-scroll opacity-0">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        <div className="px-12">
          <div className="bg-[#FFEDFA] animate-on-scroll opacity-0">
            {/* Added explicit background container */}
            <HeroSection
              title="Trở thành tình nguyện viên"
              subtitle="Mỗi thú cưng đều xứng đáng có một mái ấm. Hãy cùng chúng tôi thay đổi cuộc sống của các bé"
              buttonText="Đăng ký ngay"
              buttonLink="/volunteer/registration"
              imageSrc={petIllustration}
            />
          </div>

          <div className="animate-on-scroll opacity-0">
            <VolunteerRoles />
          </div>

          <div className="animate-on-scroll opacity-0">
            <ServiceSection />
          </div>

          <div className="py-12 px-4 md:px-8 bg-gradient-to-b to-[#FFEDFA] from-pink-50 animate-on-scroll opacity-0">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="col-span-2">
                  <FAQ />
                </div>
                <div className="col-span-1">
                  <ContactForm />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFEDFA] animate-on-scroll opacity-0">
            {/* Added explicit background container */}
            <ZeroSection
              title="Tham gia "
              subtitle="Mỗi thú cưng đều xứng đáng có một mái ấm. Hãy cùng chúng tôi thay đổi cuộc sống của các bé"
              buttonText="Đăng ký ngay"
              buttonLink="/volunteer/registration"
              imageSrc={petIllustration}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default VolunteerPage;
