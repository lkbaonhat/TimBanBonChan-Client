'use client';

import { useState, useEffect } from 'react';

const AboutUsSection = () => {
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

    const element = document.querySelector('.about-section');
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
    <section className='py-20 px-10 bg-gradient-to-b from-white to-pink-50 about-section'>
      <div className='container mx-auto'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl md:text-4xl font-bold mb-10 relative inline-block'>
            Chúng tôi là ai?
            {/* <div className='absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-500'></div> */}
          </h2>

          <div className='flex flex-col items-center'>
            <div
              className={`mb-5 transition-all duration-1000 transform ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
            >
              <div className='relative'>
                <img
                  src='logo.png'
                  alt='Tìm Bạn Bốn Chân Logo'
                  className='w-80 h-50 mx-auto'
                />
                {/* <div className='absolute -bottom-2 -right-2 w-12 h-12 bg-pink-300 rounded-full'></div>
                <div className='absolute -top-2 -left-2 w-8 h-8 bg-blue-300 rounded-full'></div> */}
              </div>
            </div>

            <p
              className={`text-lg text-center text-gray-600 leading-relaxed mb-8 transition-all duration-1000 delay-300 transform ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
            >
              Cộng đồng "Tìm Bạn Bốn Chân" đã được tạo ra để kết nối giữa người
              cho và người nhận nuôi cũng như các trạm cứu hộ, mở ra nhiều cơ
              hội để tìm thấy ngôi nhà an toàn cho thú cưng.
            </p>

            {/* <div
              className={`transition-all duration-1000 delay-500 transform ${
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
            >
              <a
                href='/about'
                className='inline-flex items-center px-6 py-3 bg-blue-500 text-white font-medium rounded-full hover:bg-blue-600 transition-colors shadow-md'
              >
                Tìm hiểu thêm về chúng tôi
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
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
