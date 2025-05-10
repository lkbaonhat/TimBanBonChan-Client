"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const faqItemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

    if (subtitleRef.current) {
      observer.observe(subtitleRef.current);
    }

    faqItemRefs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const faqItems: FAQItem[] = [
    {
      question: "Tôi có cần kinh nghiệm trước khi tham gia không?",
      answer:
        "Không, bạn không cần kinh nghiệm trước khi tham gia. Chúng tôi sẽ đào tạo và hướng dẫn bạn mọi thứ cần thiết.",
    },
    {
      question: "Tôi có thể tham gia tình nguyện trong bao lâu?",
      answer:
        "Bạn có thể tham gia trong thời gian linh hoạt tùy theo khả năng của bạn. Có thể là vài giờ mỗi tuần hoặc nhiều hơn nếu bạn có thời gian.",
    },
    {
      question: "Tôi có thể tham gia tình nguyện trực tuyến không?",
      answer:
        "Có, chúng tôi có các vị trí tình nguyện trực tuyến như hỗ trợ truyền thông, thiết kế đồ họa, hoặc tư vấn qua điện thoại.",
    },
    {
      question: "Tôi cần chuẩn bị gì khi tham gia tình nguyện?",
      answer:
        "Bạn cần mang theo tinh thần nhiệt huyết, sự kiên nhẫn và tình yêu dành cho động vật. Về trang phục, hãy mặc thoải mái và phù hợp với công việc bạn sẽ làm.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 px-4 md:px-8">
      <div className="container mx-auto">
        <h2
          ref={titleRef}
          className="text-3xl font-bold text-center mb-8 opacity-0 transition-all duration-700"
        >
          Bạn có câu hỏi gì không?
        </h2>
        <p
          ref={subtitleRef}
          className="text-center mb-12 opacity-0 transition-all duration-700"
        >
          Nếu có thắc mắc gì đừng ngại ngùng hãy trực tiếp hỏi chúng mình nhé XD
        </p>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div
              key={index}
              ref={(el) => (faqItemRefs.current[index] = el)}
              className="border-b border-gray-200 opacity-0 transition-all duration-700"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <Button
                variant="ghost"
                animation="none"
                className="flex justify-between items-center w-full py-4 text-left font-medium"
                onClick={() => toggleFAQ(index)}
              >
                {item.question}
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </Button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-40 pb-4" : "max-h-0"
                }`}
              >
                <p className="text-gray-700">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
