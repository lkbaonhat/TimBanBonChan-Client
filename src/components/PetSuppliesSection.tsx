'use client';

import { useState, useEffect } from 'react';

const PetSuppliesSection = () => {
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

    const element = document.querySelector('.pet-supplies-section');
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
    <section className='py-20  bg-[#FF99C0] from-pink-300 to-pink-200 pet-supplies-section'>
      <div className='container mx-auto'>
        <div className='flex flex-col md:flex-row items-center justify-center gap-12'>
          <div
            className={`md:w-2/5 mb-10 md:mb-0 transition-all duration-1000 transform ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : '-translate-x-10 opacity-0'
            }`}
          >
            <div className='relative ml-0'>
              <div className='absolute -top-8 -left-8 w-20 h-20 bg-blue-300 rounded-full animate-pulse-slow'></div>
              <div className='absolute -bottom-8 -right-8 w-24 h-24 bg-yellow-200 rounded-full animate-bounce-slow'></div>
              <img
                src='cat&food.png'
                alt='Pet toys and food'
                className='rounded-2xl  max-w-full h-auto relative z-10 ml-0'
              />
            </div>
          </div>

          <div
            className={`md:w-3/5 md:pl-16 transition-all duration-1000 delay-300 transform ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-10 opacity-0'
            }`}
            style={{
              transitionDelay: '300ms',
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <h2
              className='text-3xl md:text-4xl font-bold text-white mb-6 leading-tight text-center md:text-left'
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              }}
            >
              Chiều chuộng
              <br />
              <span>bé yêu nhà bạn</span>
            </h2>

            <div className='flex justify-center md:justify-start'>
              <a
                href='/shop'
                className='px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 inline-flex items-center'
              >
                Ghé thăm cửa hàng
                <svg
                  className='w-5 h-5 ml-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
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
        </div>
      </div>
    </section>
  );
};

export default PetSuppliesSection;
