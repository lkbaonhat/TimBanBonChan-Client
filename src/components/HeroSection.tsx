'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className='py-16 md:py-24 px-20 bg-gradient-to-b from-pink-50 to-white'>
      <div className='container mx-auto'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-10'>
          {/* Text Content */}
          <div
            className={`md:w-1/2 mb-10 md:mb-0 transition-all duration-1000 transform ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : '-translate-x-10 opacity-0'
            }`}
          >
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight'>
              <span className='text-gray-900'>CHIA SẺ </span>
              <span className='text-blue-600 inline-block'>YÊU THƯƠNG,</span>
              <br />
              <span className='text-gray-900'>MANG LẠI </span>
              <span className='text-pink-400 inline-block'>HẠNH PHÚC.</span>
            </h1>
            <p className='text-gray-600 text-lg mb-10 max-w-lg leading-relaxed'>
              Mỗi thú cưng đều xứng đáng có một mái ấm. Hãy cùng chúng tôi thay
              đổi cuộc sống của các bé.
            </p>
            <div className='flex flex-wrap gap-4'>
              <Link
                to='/adopt'
                className='px-8 py-4 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg'
              >
                Nhận nuôi thú cưng
              </Link>
              <Link
                to='/search'
                className='px-8 py-4 bg-pink-300 text-white font-medium rounded-full hover:bg-pink-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg'
              >
                Tìm nhà mới cho bé
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div
            className={`md:w-1/2 transition-all duration-1000 transform ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-10 opacity-0'
            }`}
          >
            <div className='relative rounded-3xl overflow-hidden  transform hover:scale-102 transition-all duration-500'>
              <img
                src='highfive.png'
                alt='Dog with owner at sunset'
                className='w-full h-auto object-cover rounded-3xl'
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
