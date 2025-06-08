import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BANNER } from "@/constants/global";

const PetCareSection = () => {
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

    const element = document.querySelector(".pet-care-section");
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
    <section className="py-20 px-20 bg-[#FFEDFA] pet-care-section">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div
            className={`md:w-1/2 mb-10 md:mb-0 order-2 md:order-1 transition-all duration-1000 transform ${isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 opacity-0"
              }`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              <span className="text-[#FF99C0]">Chăm sóc</span> thú cưng
              <br />
              <span className="text-gray-900">của bạn.</span>
            </h2>

            <Button
              asChild
              variant="blue"
              size="lg"
              shape="pill"
              className="hover:shadow-lg transition-all duration-300 px-8 py-4"
            >
              <Link to="/pet-care">
                Sổ tay chăm sóc thú cưng
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </Button>
          </div>

          <div
            className={`md:w-1/2 order-1 md:order-2 transition-all duration-1000 delay-300 transform ${isVisible
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0"
              }`}
          >
            <div className="relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-pink-200 rounded-full opacity-70"></div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-200 rounded-full opacity-70"></div>
              <img src={BANNER.TAKE_CARE_PET} alt="Veterinarian examining a puppy" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetCareSection;
