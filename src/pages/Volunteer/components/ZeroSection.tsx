"use client";

import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ZeroSectionProps {
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  imageSrc: string;
}

const ZeroSection = ({
  title,
  subtitle,
  buttonText,
  buttonLink,
  imageSrc,
}: ZeroSectionProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const titleElement = titleRef.current;
    const textElement = textRef.current;
    const buttonElement = buttonRef.current;
    const imageElement = imageRef.current;

    if (titleElement && textElement && buttonElement && imageElement) {
      titleElement.classList.add("animate-fadeInUp");

      setTimeout(() => {
        textElement.classList.add("animate-fadeInUp");
      }, 200);

      setTimeout(() => {
        buttonElement.classList.add("animate-fadeInUp");
      }, 400);

      setTimeout(() => {
        imageElement.classList.add("animate-fadeInRight");
      }, 300);
    }
  }, []);

  // Split the title to highlight "tình nguyện viên"
  const titleParts = title.split("tình nguyện viên");

  return (
    <section className="py-12 px-4 md:px-8 bg-[#FFEDFA]">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 flex justify-center items-center ">
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Pets illustration"
              className="rounded-lg transition-all duration-700" // Removed opacity-0
            />
          </div>
          <div className="md:w-1/2 mb-8 md:mb-0 text-right">
            <h1
              ref={titleRef}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              {titleParts[0]}
              <span className="text-[#0053A3]">
                Cộng đồng <br />{" "}
                <span className="text-black">ngay hôm nay</span>
              </span>
              {titleParts[1]}
            </h1>
            <p
              ref={textRef}
              className="text-gray-600 text-lg mb-10 max-w-lg ml-auto" // Added ml-auto to align text right
            >
              {subtitle}
            </p>
            <Button
              asChild
              variant="pink"
              shape="pill"
              size="lg"
              ref={buttonRef}
              className="transition-all duration-700"
            >
              <Link to={buttonLink}>{buttonText}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZeroSection;
