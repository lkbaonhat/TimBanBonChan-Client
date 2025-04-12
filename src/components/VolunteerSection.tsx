'use client';

import { useState, useEffect } from 'react';

const VolunteerSection = () => {
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

    const element = document.querySelector('.volunteer-section');
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
    <section className='py-20 px-20 bg-gradient-to-r from-blue-50 to-blue-100 volunteer-section'>
      <div className='container mx-auto'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-12'>
          <div
            className={`md:w-1/2 mb-10 md:mb-0 transition-all duration-1000 transform ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : '-translate-x-10 opacity-0'
            }`}
          >
            <div className='relative'>
              <div className='absolute -top-6 -left-6 w-24 h-24 bg-pink-200 rounded-full opacity-70'></div>
              <div className='absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full opacity-70'></div>
              <img
                src='hugging.png'
                alt='Volunteer with puppy'
                className='rounded-2xl max-w-full h-auto relative z-10'
              />
            </div>
          </div>

          <div
            className={`md:w-1/2 md:pl-12 transition-all duration-1000 delay-300 transform ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-10 opacity-0'
            }`}
          >
            {/* <span className='inline-block px-4 py-2 bg-blue-200 text-blue-800 rounded-full text-sm font-medium mb-4'>
              Tình nguyện viên
            </span> */}
            <h2 className='text-3xl md:text-4xl font-bold mb-6 leading-tight text-right'>
              Trở thành
              <br />
              <span className='text-blue-600'>tình nguyện viên.</span>
            </h2>
            {/* <p className='text-gray-600 text-lg leading-relaxed mb-8'>
              Hãy tham gia cộng đồng của chúng tôi và giúp đỡ các bé thú cưng
              tìm được mái ấm mới. Bạn có thể đóng góp thời gian, kỹ năng hoặc
              tài nguyên để hỗ trợ sứ mệnh của chúng tôi.
            </p> */}
            {/* <ul className='mb-8 space-y-3'>
              <li className='flex items-center'>
                <svg
                  className='w-5 h-5 text-green-500 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                <span>Chăm sóc các bé tại trạm cứu hộ</span>
              </li>
              <li className='flex items-center'>
                <svg
                  className='w-5 h-5 text-green-500 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                <span>Hỗ trợ tại các sự kiện nhận nuôi</span>
              </li>
              <li className='flex items-center'>
                <svg
                  className='w-5 h-5 text-green-500 mr-3'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M5 13l4 4L19 7'
                  ></path>
                </svg>
                <span>Đóng góp kỹ năng chuyên môn</span>
              </li>
            </ul> */}
            <div className='flex flex-wrap gap-4 justify-end'>
              <a
                href='/volunteer/explore'
                className='px-8 py-4 bg-[#FF99C0] from-blue-500 to-blue-600 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300'
              >
                Khám phá thêm
              </a>
              <a
                href='/volunteer/register'
                className='px-8 py-4 bg-[#FF99C0] from-blue-500 to-blue-600 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300'
              >
                Đăng ký ngay
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerSection;
