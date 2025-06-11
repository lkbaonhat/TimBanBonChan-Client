"use client";

import { BANNER, LOGO } from "@/constants/global";
import { Heart, Award, Share2 } from "lucide-react";
import { useEffect, useRef } from "react";

const CoreValues = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const valueRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    valueRefs.current.forEach((value) => {
      if (value) observer.observe(value);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const values = [
    {
      icon: <img src={LOGO.HEART_PINK} className="w-8 h-auto" />,
      title: "Nhân ái",
      description:
        "Cộng đồng chúng tôi luôn đặt niềm yêu thương thú cưng lên trên hết",
    },
    {
      icon: <img className="w-8 h-auto" src={LOGO.COMMUNICATE_PINK} />,
      title: "Chân thành",
      description:
        "Chúng tôi luôn sử dụng hết khả năng của mình để hoàn thành sứ mệnh của mình",
    },
    {
      icon: <img className="w-8 h-auto " src={LOGO.COMMUNITY_PINK} />,
      title: "Lan tỏa",
      description:
        "Cộng đồng chúng tôi trao đi tình yêu và thực hiện trách nhiệm với cộng đồng",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className=" px-4 md:px-8 bg-blue-100 bg-opacity-50 relative"
    >
      <div className="container mx-auto px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
          {values.map((value, index) => (
            <div
              key={index}
              ref={(el) => (valueRefs.current[index] = el)}
              className="text-center opacity-0 transition-all duration-700"
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex justify-center mb-4">{value.icon}</div>
              <h3 className="font-bold mb-2">{value.title}</h3>
              <p className="text-sm text-gray-700 w-3/4 mx-auto">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <img
            src={BANNER.FIVE_DOG}
            alt="Different dog breeds"
            className="rounded-lg w-full max-w-3xl"
          />
        </div>
      </div>
    </section>
  );
};

export default CoreValues;
