"use client";

import { useEffect, useRef } from "react";
import CoreValues from "./components/CoreValues";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import WhatWeDoSection from "../Home/components/WhatWeDoSection";
import VolunteerSection from "../Home/components/VolunteerSection";
import { BANNER } from "@/constants/global";

const AboutUsPage = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Add scroll animation classes
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeIn");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    if (descriptionRef.current) {
      observer.observe(descriptionRef.current);
    }

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    if (taglineRef.current) {
      observer.observe(taglineRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Cộng đồng" },
  ];

  return (
    <div className="min-h-screen flex flex-col  bg-opacity-50 bg-stripes">
      <main className="flex-grow">
        <Breadcrumb items={breadcrumbItems} />

        <section className="py-12 px-20">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1
                  ref={titleRef}
                  className="text-4xl font-bold mb-4 opacity-0 transition-all duration-700"
                  style={{
                    transitionDelay: "300ms",
                    animation: "fadeIn 1s ease-in-out",
                    animationDelay: "0.3s",
                    animationFillMode: "forwards",
                    animationDuration: "1s",
                    animationTimingFunction: "ease-in-out",
                    animationName: "fadeIn",
                    fontSize: "2.5rem",
                    lineHeight: "1.2",
                    color: "#333",
                    textAlign: "left",
                    marginBottom: "1rem",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Tìm Bạn Bốn Chân
                </h1>
                <p
                  ref={descriptionRef}
                  className="text-gray-700 mb-6 opacity-0 transition-all duration-700 w-3/4"
                >
                  Tìm Bạn Bốn Chân là một cộng đồng được tạo ra để kết nối những
                  người yêu thương động vật, nhằm hướng đến mục tiêu tìm kiếm
                  những ngôi nhà mới yêu thương và an toàn cho thú cưng.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  ref={imageRef}
                  src={BANNER.CAT_TOUCH_DOG}
                  alt="Dog and cat together"
                  className="rounded-lg opacity-0 transition-all duration-700"
                />
              </div>
            </div>
          </div>
        </section>

        <div
          ref={taglineRef}
          className="py-12 px-4 md:px-8 text-center opacity-0 transition-all duration-700"
        >
          <h2 className="text-5xl font-bold">
            CHIA SẺ <span className="text-[#0053A3]">YÊU THƯƠNG,</span>
            <br />
            MANG LẠI <span className="text-[#FF99C0]">HẠNH PHÚC.</span>
          </h2>
        </div>

        <CoreValues />

        <WhatWeDoSection />

        <VolunteerSection />
      </main>
    </div>
  );
};

export default AboutUsPage;
