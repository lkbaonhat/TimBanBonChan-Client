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
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-sW9TtLFsnCCyae6qgZYe14UKBOyUlP.png";

  useEffect(() => {
    // Add scroll animation classes
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");

      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight - 100) {
          element.classList.add("animate-fadeIn");
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
    { label: "Cộng đồng", path: "/community" },
    { label: "Tình nguyện viên" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FFEDFA]">
      <main className="flex-grow">
        <Breadcrumb items={breadcrumbItems} />

        <div className="px-12">
          <div className="bg-[#FFEDFA]">
            {" "}
            {/* Added explicit background container */}
            <HeroSection
              title="Trở thành tình nguyện viên"
              subtitle="Mỗi thú cưng đều xứng đáng có một mái ấm. Hãy cùng chúng tôi thay đổi cuộc sống của các bé"
              buttonText="Đăng ký ngay"
              buttonLink="/dang-ky"
              imageSrc="multipaws.png"
            />
          </div>

          <VolunteerRoles />

          <ServiceSection />

          <div className="py-12 px-4 md:px-8 bg-gradient-to-b to-[#FFEDFA] from-pink-50">
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

          <div className="bg-[#FFEDFA]">
            {" "}
            {/* Added explicit background container */}
            <ZeroSection
              title="Tham gia "
              subtitle="Mỗi thú cưng đều xứng đáng có một mái ấm. Hãy cùng chúng tôi thay đổi cuộc sống của các bé"
              buttonText="Đăng ký ngay"
              buttonLink="/dang-ky"
              imageSrc={petIllustration}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default VolunteerPage;
