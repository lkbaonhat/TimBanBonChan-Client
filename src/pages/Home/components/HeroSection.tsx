"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BANNER } from "@/constants/global";

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="py-16 md:py-24 px-10 bg-[#FFEDFA]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          {/* Text Content */}
          <div
            className={`md:w-1/2 mb-10 md:mb-0 transition-all duration-1000 transform ${isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 opacity-0"
              }`}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-gray-900">CHIA SẺ </span>
              <span className="text-[#0053A3] inline-block">YÊU THƯƠNG,</span>
              <br />
              <span className="text-gray-900">MANG LẠI </span>
              <span className="text-[#FF99C0] inline-block">HẠNH PHÚC.</span>
            </h1>
            <p className="text-gray-600 text-lg mb-10 max-w-lg leading-relaxed">
              Mỗi thú cưng đều xứng đáng có một mái ấm. Hãy cùng chúng tôi thay
              đổi cuộc sống của các bé.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild variant="blue" size="lg" shape="pill">
                <Link to="/pets">Nhận nuôi thú cưng</Link>
              </Button>
              <Button asChild variant="pink" size="lg" shape="pill">
                <Link to="/find-new-home">Tìm nhà mới cho bé</Link>
              </Button>
            </div>
          </div>

          {/* Hero Image */}
          <div
            className={`md:w-1/2 transition-all duration-1000 transform ${isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
              }`}
          >
            <div className="relative rounded-3xl overflow-hidden  transform hover:scale-102 transition-all duration-500">
              <img
                src={BANNER.HIGH_FIVE}
                alt="Dog with owner at sunset"
                className="w-full h-auto object-cover rounded-3xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
