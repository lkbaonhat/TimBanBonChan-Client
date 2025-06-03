"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const VolunteerSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.querySelector(".volunteer-section");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <section className="py-20 px-20 bg-[#C5E2F0] volunteer-section">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div
            className={`md:w-1/2 mb-10 md:mb-0 transition-all duration-1000 transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "-translate-x-10 opacity-0"
            }`}
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-200 rounded-full opacity-70"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full opacity-70"></div>
              <img
                src="hugging.png"
                alt="Volunteer with puppy"
                className="rounded-2xl max-w-full h-auto relative z-10"
              />
            </div>
          </div>

          <div
            className={`md:w-1/2 md:pl-12 transition-all duration-1000 delay-300 transform ${
              isVisible
                ? "translate-x-0 opacity-100"
                : "translate-x-10 opacity-0"
            }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-right">
              Trở thành
              <br />
              <span className="text-[#0053A3]">tình nguyện viên.</span>
            </h2>
            <div className="flex flex-wrap gap-4 justify-end">
              <Button
                asChild
                variant="pink"
                size="lg"
                shape="pill"
                className="hover:shadow-lg transition-all duration-300 px-8 py-4"
              >
                <a href="/volunteer">Khám phá thêm</a>
              </Button>
              <Button
                asChild
                variant="pink"
                size="lg"
                shape="pill"
                className="hover:shadow-lg transition-all duration-300 px-8 py-4"
              >
                <a href="/volunteer/registration">Đăng ký ngay</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerSection;
