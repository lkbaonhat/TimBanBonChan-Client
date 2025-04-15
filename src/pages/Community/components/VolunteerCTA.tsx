'use client';

import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const VolunteerCTA = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const buttonRefs = useRef<(HTMLAnchorElement | null)[]>([]);

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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    if (imageRef.current) {
      observer.observe(imageRef.current);
    }

    buttonRefs.current.forEach((button) => {
      if (button) observer.observe(button);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className='py-12 px-4 md:px-8 bg-blue-100 bg-opacity-50 opacity-0 transition-all duration-700'
    >
      <div className='container mx-auto'>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='md:w-1/2 mb-8 md:mb-0'>
            <img
              ref={imageRef}
              src='https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-d8MAHA7P4SruVD7jVmM1PSK7q78Z5P.png'
              alt='Woman with dog'
              className='rounded-lg shadow-lg w-full max-w-md mx-auto opacity-0 transition-all duration-700'
            />
          </div>

          <div
            ref={textRef}
            className='md:w-1/2 text-center md:text-right opacity-0 transition-all duration-700'
          >
            <h2 className='text-3xl font-bold mb-2'>
              Trở thành tình nguyện viên
            </h2>
            <h3 className='text-2xl font-bold text-blue-600 mb-6'>
              Cộng Đồng.
            </h3>

            <div className='flex justify-center md:justify-end space-x-4 mt-6'>
              <Link
                ref={(el) => (buttonRefs.current[0] = el)}
                to='/xem-gio-them'
                className='bg-pink-400 hover:bg-pink-500 text-white font-medium py-2 px-6 rounded-full inline-block opacity-0 transition-all duration-700'
              >
                Xem giờ thêm
              </Link>
              <Link
                ref={(el) => (buttonRefs.current[1] = el)}
                to='/dang-ky-ngay'
                className='bg-pink-400 hover:bg-pink-500 text-white font-medium py-2 px-6 rounded-full inline-block opacity-0 transition-all duration-700'
              >
                Đăng ký ngay
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VolunteerCTA;
