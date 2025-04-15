'use client';

import { Dog, Heart, MessageCircle, Award } from 'lucide-react';
import { useEffect, useRef } from 'react';

const VolunteerBenefits = () => {
  const benefitRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    benefitRefs.current.forEach((benefit) => {
      if (benefit) observer.observe(benefit);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const benefits = [
    {
      icon: <Dog className='w-8 h-8 text-blue-600' />,
      title: 'Ai có thể tham gia',
      description: 'Các bạn trẻ có đam mê và mong muốn giúp đỡ thú cưng',
    },
    {
      icon: <Heart className='w-8 h-8 text-blue-600' />,
      title: 'Bạn cần gì',
      description: 'Yêu thương động vật và yêu tố tiền quyết nhé',
    },
    {
      icon: <MessageCircle className='w-8 h-8 text-blue-600' />,
      title: 'Bạn sẽ đạt được gì',
      description:
        'Bạn sẽ có được những kỹ năng và kiến thức cần thiết khi làm việc trong tổ chức xã hội',
    },
    {
      icon: <Award className='w-8 h-8 text-blue-600' />,
      title: 'Quyền lợi của bạn',
      description:
        'Chúng tôi sẽ cung cấp giấy chứng nhận và hỗ trợ các bạn trong quá trình chuyển và làm việc',
    },
  ];

  return (
    <section className='py-12 px-4 md:px-8 bg-white'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              ref={(el) => (benefitRefs.current[index] = el)}
              className='text-center opacity-0 transition-all duration-700'
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className='flex justify-center mb-4'>{benefit.icon}</div>
              <h3 className='font-bold mb-2'>{benefit.title}</h3>
              <p className='text-sm text-gray-700'>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolunteerBenefits;
