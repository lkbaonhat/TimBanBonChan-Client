'use client';

import { useState, useEffect } from 'react';
import { Heart, Shield, HelpingHand } from 'lucide-react';

const services = [
  {
    icon: <Heart className='w-12 h-12 text-[#0053A3]' />,
    title: 'Mái ấm',
    description:
      'Cộng đồng chúng tôi tạng cơ hội tìm mái ấm mới, an toàn cho các bé cưng',
  },
  {
    icon: <Shield className='w-12 h-12 text-[#0053A3]' />,
    title: 'An toàn',
    description:
      'Đảm bảo điều kiện tốt đầy đủ và tình trạng sức khỏe thể chất và tinh thần của các bé',
  },
  {
    icon: <HelpingHand className='w-12 h-12 text-[#0053A3]' />,
    title: 'Hỗ trợ',
    description:
      'Cộng đồng luôn sát cánh bên bạn trong suốt quá trình nhận nuôi',
  },
];

const WhatWeDoSection = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number.parseInt(
              entry.target.getAttribute('data-index') || '0'
            );
            setVisibleItems((prev) => [...prev, index]);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.service-card');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className='py-16 px-20 bg-pink-50 '>
      <div className='container mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-16'>
          Chúng tôi làm gì?
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {services.map((service, index) => (
            <div
              key={index}
              data-index={index}
              className={`service-card relative bg-white rounded-b-full pt-24 pb-20 px-4  max-w-xs mx-auto text-center shadow-lg transition-all duration-700 transform ${
                visibleItems.includes(index)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 150}ms`, width: '300px' }}
            >
              <div className='text-[#0053A3] absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg'>
                {service.icon}
              </div>
              <h3 className='text-xl font-bold mb-4 text-[#0053A3]'>
                {service.title}
              </h3>
              <p className='text-gray-600'>{service.description}</p>
            </div>
          ))}
        </div>

        <div className='text-center mt-12'>
          <a
            href='/about'
            className='inline-flex items-center px-6 py-3 bg-pink-300 text-white rounded-full hover:bg-pink-400 transition-colors'
          >
            Hiểu thêm về chúng tôi
            <svg
              className='w-5 h-5 ml-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M14 5l7 7m0 0l-7 7m7-7H3'
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhatWeDoSection;
