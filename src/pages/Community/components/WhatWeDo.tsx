"use client";

import { Home, Shield, HelpCircle } from "lucide-react";
import { useEffect, useRef } from "react";

const WhatWeDo = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const serviceRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    serviceRefs.current.forEach((service) => {
      if (service) observer.observe(service);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const services = [
    {
      icon: <Home className="w-12 h-12 text-[#0053A3]" />,
      title: "Mái ấm",
      description:
        "Cộng đồng chúng tôi tạo ra một nơi làm mái ấm mới, an toàn cho các bé cưng",
    },
    {
      icon: <Shield className="w-12 h-12 text-[#0053A3]" />,
      title: "An toàn",
      description:
        "Đảm bảo đầu tiên về sự dày dạn và tình trạng sức khỏe tốt nhất cho các bé",
    },
    {
      icon: <HelpCircle className="w-12 h-12 text-[#0053A3]" />,
      title: "Hỗ trợ",
      description:
        "Cộng đồng luôn sát cánh bên bạn trong suốt quá trình nhận nuôi",
    },
  ];

  return (
    <section className="py-12 px-4 md:px-8 bg-pink-50 relative">
      <div className="container mx-auto">
        <h2
          ref={titleRef}
          className="text-3xl font-bold text-center mb-12 opacity-0 transition-all duration-700"
        >
          Chúng tôi làm gì?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              ref={(el) => (serviceRefs.current[index] = el)}
              className="flex flex-col items-center opacity-0 transition-all duration-700"
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className="bg-white rounded-full w-40 h-40 flex items-center justify-center mb-4 shadow-md">
                {service.icon}
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">
                {service.title}
              </h3>
              <p className="text-sm text-gray-700 text-center max-w-xs">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhatWeDo;
