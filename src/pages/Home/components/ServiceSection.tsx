'use client';

import { useState, useEffect } from 'react';

const services = [
  {
    icon: <img src='dogblue.png' />,
    title: 'Bạn muốn nhận nuôi',
    description: 'Gặp gỡ và tìm hiểu quá trình hoàn thành thủ tục nhận nuôi',
  },
  {
    icon: <img src='heartblue.png' />,
    title: 'Bạn tìm chủ mới',
    description:
      'Tìm kiếm người nhận nuôi và tạm ngôi nhà mới an toàn cho bé yêu của bạn',
  },
  {
    icon: <img src='commuteblue.png' />,
    title: 'Cần sự giúp đỡ',
    description:
      'Để lại phương thức liên lạc và chúng tôi sẽ tìm đến bạn hoặc bạn tìm đến chúng tôi',
  },
  {
    icon: <img src='communityblue.png' />,
    title: 'Khám phá cộng đồng',
    description:
      'Khám phá cộng đồng của chúng tôi, nơi bạn và mọi người có thể chia sẻ tình yêu và bé cưng nhà bạn',
  },
];

const ServiceSection = () => {
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

    const elements = document.querySelectorAll('.service-item');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className='py-20 px-10 bg-gradient-to-b from-[#FFEDFA] to-pink-50'>
      <div className='container mx-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {services.map((service, index) => (
            <div
              key={index}
              data-index={index}
              className={`service-item flex flex-col items-center text-center p-8 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 ${
                visibleItems.includes(index)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className='  rounded-full'>{service.icon}</div>
              <h3 className='text-xl font-bold mb-3'>{service.title}</h3>
              <p className='text-gray-600 leading-relaxed'>
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
