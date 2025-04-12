'use client';

import { useState, useEffect } from 'react';

const PetCareSection = () => {
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

    const element = document.querySelector('.pet-care-section');
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
    <section className='py-20 px-20 bg-gradient-to-b from-white to-pink-50 pet-care-section'>
      <div className='container mx-auto'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-12'>
          <div
            className={`md:w-1/2 mb-10 md:mb-0 order-2 md:order-1 transition-all duration-1000 transform ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : '-translate-x-10 opacity-0'
            }`}
          >
            {/* <span className='inline-block px-4 py-2 bg-pink-200 text-pink-800 rounded-full text-sm font-medium mb-4'>
              Chăm sóc thú cưng
            </span> */}
            <h2 className='text-3xl md:text-4xl font-bold mb-6 leading-tight'>
              <span className='text-pink-500'>Chăm sóc</span> thú cưng
              <br />
              <span className='text-gray-900'>của bạn.</span>
            </h2>
            {/* <p className='text-gray-600 text-lg leading-relaxed mb-8'>
              Chúng tôi cung cấp thông tin và hướng dẫn về cách chăm sóc thú
              cưng của bạn một cách tốt nhất, từ dinh dưỡng đến sức khỏe và hạnh
              phúc.
            </p> */}

            {/* <div className='space-y-4 mb-8'>
              <div className='flex items-start'>
                <div className='bg-pink-100 p-2 rounded-full mr-4 mt-1'>
                  <Heart className='w-5 h-5 text-pink-500' />
                </div>
                <div>
                  <h3 className='font-semibold text-lg mb-1'>
                    Dinh dưỡng phù hợp
                  </h3>
                  <p className='text-gray-600'>
                    Hướng dẫn chi tiết về chế độ ăn uống cân bằng cho từng loại
                    thú cưng
                  </p>
                </div>
              </div>

              <div className='flex items-start'>
                <div className='bg-blue-100 p-2 rounded-full mr-4 mt-1'>
                  <CheckCircle className='w-5 h-5 text-blue-500' />
                </div>
                <div>
                  <h3 className='font-semibold text-lg mb-1'>
                    Chăm sóc sức khỏe
                  </h3>
                  <p className='text-gray-600'>
                    Lịch trình tiêm chủng, khám bệnh định kỳ và nhận biết dấu
                    hiệu bất thường
                  </p>
                </div>
              </div>

              <div className='flex items-start'>
                <div className='bg-green-100 p-2 rounded-full mr-4 mt-1'>
                  <Clock className='w-5 h-5 text-green-500' />
                </div>
                <div>
                  <h3 className='font-semibold text-lg mb-1'>
                    Chế độ vận động
                  </h3>
                  <p className='text-gray-600'>
                    Các hoạt động phù hợp giúp thú cưng phát triển khỏe mạnh và
                    hạnh phúc
                  </p>
                </div>
              </div>
            </div> */}

            <a
              href='/pet-care'
              className='px-8 py-4 bg-[#0053A3] from-[#0053A3]-400 to-[#0053A3]-500 text-white font-medium rounded-full hover:shadow-lg transition-all duration-300 inline-flex items-center'
            >
              Sổ tay chăm sóc thú cưng
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

          <div
            className={`md:w-1/2 order-1 md:order-2 transition-all duration-1000 delay-300 transform ${
              isVisible
                ? 'translate-x-0 opacity-100'
                : 'translate-x-10 opacity-0'
            }`}
          >
            <div className='relative'>
              <div className='absolute -top-6 -right-6 w-32 h-32 bg-pink-200 rounded-full opacity-70'></div>
              <div className='absolute -bottom-6 -left-6 w-24 h-24 bg-blue-200 rounded-full opacity-70'></div>
              <img
                src='cleanear.png'
                alt='Veterinarian examining a puppy'
                // className='rounded-2xl shadow-xl max-w-full h-auto relative z-10'
              />
              {/* <div className='absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-3 rounded-xl shadow-md'>
                <p className='text-pink-500 font-medium'>Chăm sóc tận tâm</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PetCareSection;
