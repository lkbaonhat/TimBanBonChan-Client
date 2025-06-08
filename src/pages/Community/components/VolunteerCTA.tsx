"use client";

import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { BANNER } from "@/constants/global";

const VolunteerCTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    buttonRefs.current.forEach((button) => {
      if (button) observer.observe(button);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-12 px-4 md:px-8 bg-blue-100 bg-opacity-50 opacity-0 transition-all duration-700"
    >
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <img
              ref={imageRef}
              src={BANNER.VOLUNTEER_WITH_PUPPY}
              alt="Woman with dog"
              className="rounded-lg shadow-lg w-full max-w-md mx-auto opacity-0 transition-all duration-700"
            />
          </div>

          <div
            ref={textRef}
            className="md:w-1/2 text-center md:text-right opacity-0 transition-all duration-700"
          >
            <h2 className="text-3xl font-bold mb-2">
              Trở thành tình nguyện viên
            </h2>
            <h3 className="text-2xl font-bold text-[#0053A3] mb-6">
              Cộng Đồng.
            </h3>

            <div className="flex justify-center md:justify-end space-x-4 mt-6">
              <Button
                asChild
                variant="pink"
                shape="pill"
                className="opacity-0 transition-all duration-700"
                ref={(el) => (buttonRefs.current[0] = el as HTMLAnchorElement)}
              >
                <Link to="/xem-gio-them">Xem giờ thêm</Link>
              </Button>

              <Button
                asChild
                variant="pink"
                shape="pill"
                className="opacity-0 transition-all duration-700"
                ref={(el) => (buttonRefs.current[1] = el as HTMLAnchorElement)}
              >
                <Link to="/dang-ky-ngay">Đăng ký ngay</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerCTA;
