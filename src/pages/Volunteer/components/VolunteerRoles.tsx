'use client';

import { useEffect, useRef } from 'react';

const VolunteerRoles = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const roles = [
    {
      image: 'takecare.png',
      title: 'Chăm sóc thú cưng tại trạm cứu hộ',
      description: 'Giúp chăm sóc, tắm rửa, chơi đùa với thú cưng',
    },
    {
      image: 'transport.png',
      title: 'Vận chuyển thú cưng',
      description: 'Giúp đưa thú cưng đến trạm hoặc nhà mới',
    },
    {
      image: 'survey.png',
      title: 'Hỗ trợ khảo sát địa điểm nhận nuôi',
      description:
        'Kiểm tra thông tin địa điểm bảo an toàn nhà ở mới của thú cưng',
    },
  ];

  return (
    <section className='py-12 px-4 md:px-8'>
      <div className='container mx-auto'>
        <h2
          ref={titleRef}
          className='text-3xl font-bold text-center mb-12 opacity-0 transition-all duration-700'
        >
          Vai trò của các tình nguyện viên
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {roles.map((role, index) => (
            <div
              key={index}
              ref={(el) => (cardRefs.current[index] = el)}
              className='hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 rounded-lg overflow-hidden opacity-0 transition-all duration-700'
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              <div className='p-4'>
                <img
                  src={role.image || '/placeholder.svg'}
                  alt={role.title}
                  className='w-full h-80 object-cover rounded-md mb-4'
                />
                <h3 className='font-bold text-lg mb-2'>{role.title}</h3>
                <p className='text-gray-700 text-sm'>{role.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VolunteerRoles;
