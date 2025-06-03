"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { MessageCircle, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInRight");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ email, message });
    // Reset form
    setEmail("");
    setMessage("");
    // Show success message
    alert("Câu hỏi của bạn đã được gửi!");
  };

  return (
    <div
      ref={formRef}
      className="p-6 rounded-lg opacity-0 transition-all duration-700"
    >
      <MessageCircle
        className="text-[#FF99C0] w-10 h-10 mr-2"
        style={{
          display: "block",
          margin: "0 auto",
          marginBottom: "1rem",
          transform: "translateY(-50%)",
          transition: "transform 0.3s ease-in-out",
          animation: "bounce 2s infinite",
          animationTimingFunction: "cubic-bezier(0.5, 0, 0.5, 1)",
        }}
      />

      <div className="flex items-center mb-4 item-center justify-center">
        <h3
          className="font-medium"
          style={{
            fontSize: "1.5rem",
            marginRight: "0.5rem",
            fontWeight: "bold",
          }}
        >
          Bạn có câu hỏi khác
        </h3>
      </div>
      <p className="text-sm text-gray-600 mb-6 justify-center text-center">
        Trực tiếp liên hệ với chuyên viên của chúng tôi bằng cách để lại email
        hoặc thông qua trang xã hội của "Tìm bạn bốn chân"
      </p>
      <div className="flex justify-center mt-6 space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-full border border-gray-300"
          animation="none"
        >
          <Facebook className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-full border border-gray-300"
          animation="none"
        >
          <Instagram className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 rounded-full border border-gray-300"
          animation="none"
        >
          <Twitter className="w-5 h-5" />
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm text-gray-600 mb-1">
            Địa chỉ email của bạn
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Vd: nguyenvan@gmail.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="message" className="block text-sm text-gray-600 mb-1">
            Câu hỏi của bạn
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        <Button
          type="submit"
          variant="blue"
          className="w-full h-12tại sao bg và button của 2 phần này không hiện ra text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center"
        >
          Gửi câu hỏi
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
