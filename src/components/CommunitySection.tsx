'use client';

import { Facebook, Instagram, Youtube } from 'lucide-react';
import { useState, useEffect } from 'react';

const socialLinks = [
  {
    name: 'Facebook',
    icon: <Facebook className='w-8 h-8' />,
    color: 'bg-blue-500 text-white',
    hoverColor: 'hover:bg-blue-600',
    url: 'https://facebook.com',
  },
  {
    name: 'TikTok',
    icon: (
      <svg className='w-8 h-8' viewBox='0 0 24 24' fill='currentColor'>
        <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z' />
      </svg>
    ),
    color: 'bg-black text-white',
    hoverColor: 'hover:bg-gray-800',
    url: 'https://tiktok.com',
  },
  {
    name: 'Youtube',
    icon: <Youtube className='w-8 h-8' />,
    color: 'bg-red-500 text-white',
    hoverColor: 'hover:bg-red-600',
    url: 'https://youtube.com',
  },
  {
    name: 'Instagram',
    icon: <Instagram className='w-8 h-8' />,
    color:
      'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white',
    hoverColor: 'hover:opacity-90',
    url: 'https://instagram.com',
  },
];

const CommunitySection = () => {
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

    const elements = document.querySelectorAll('.social-item');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <section className='py-20 px-10 bg-gradient-to-b from-pink-50 to-blue-50'>
      <div className='container mx-auto'>
        <div className='max-w-4xl mx-auto text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-bold mb-6'>
            Cộng đồng <span className='text-blue-500'>"Tìm bạn bốn chân"</span>
          </h2>
          {/* <p className='text-gray-600 text-lg'>
            Kết nối cộng đồng yêu thương thú cưng trên các nền tảng mạng xã hội.
            Hãy theo dõi và chia sẻ yêu thương!
          </p> */}
        </div>

        <div className='flex flex-wrap justify-center gap-25 md:gap-35'>
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target='_blank'
              rel='noopener noreferrer'
              data-index={index}
              className={`social-item flex flex-col items-center transition-all duration-500 transform hover:scale-110 ${
                visibleItems.includes(index)
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-10 opacity-0'
              }`}
              // style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div
                className={`p-4 bg-[#FF99C0] text-white rounded-2xl mb-4 transition-all duration-300`}
              >
                {social.icon}
              </div>
              <span className='text-gray-700 font-medium text-lg'>
                {social.name}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
