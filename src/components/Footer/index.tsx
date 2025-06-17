import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { BANNER, LOGO } from '@/constants/global';

export default function Footer() {
  return (
    <footer className='w-full bg-[#0053A3] text-white py-12 relative lg:pr-40'>
      <div className='container mx-auto px-4 sm:px-8 md:px-12 lg:px-40 flex flex-col md:flex-row items-start justify-between'>
        {/* Logo Section */}
        <div className='mb-8 md:mb-0'>
          <div className='w-48 h-48 relative'>
            <img
              src={LOGO.WITH_BG}
              alt='Tìm Bạn Bốn Chân Logo'
              className='object-contain w-full h-full absolute top-0 left-0'
            />
          </div>
          {/* <p className='text-xs mt-2'>GẶP GỠ, CHƠI ĐÙA, YÊU THƯƠNG</p> */}
        </div>

        {/* Community Section */}
        <div className='mb-8 md:mb-0'>
          <h3 className='font-bold text-lg mb-4'>Cộng đồng</h3>
          <ul className='space-y-2'>
            <li>
              <Link to='/nhan-nuoi' className='hover:underline'>
                Nhận nuôi
              </Link>
            </li>
            <li>
              <Link to='/cho-nuoi' className='hover:underline'>
                Cho nuôi
              </Link>
            </li>
            <li>
              <Link to='/tram-thuy' className='hover:underline'>
                Trạm thủy
              </Link>
            </li>
            <li>
              <Link to='/tim-ban-bon-chan' className='hover:underline'>
                "Tìm bạn bốn chân"
              </Link>
            </li>
          </ul>
        </div>

        {/* Support Section */}
        <div className='mb-8 md:mb-0'>
          <h3 className='font-bold text-lg mb-4'>Hỗ trợ</h3>
          <ul className='space-y-2'>
            <li>
              <Link to='/qa' className='hover:underline'>
                Q&A
              </Link>
            </li>
            <li>
              <Link to='/contact' className='hover:underline'>
                Liên hệ với chúng tôi
              </Link>
            </li>
            <li>
              <Link to='/privacy' className='hover:underline'>
                Điều khoản bảo mật
              </Link>
            </li>
            <li>
              <Link to='/terms' className='hover:underline'>
                Điều khoản dịch vụ
              </Link>
            </li>
          </ul>
        </div>

        {/* Connect Section */}
        <div className='mb-8 md:mb-0'>
          <h3 className='font-bold text-lg mb-4'>Kết nối</h3>
          <div className='flex space-x-4 mb-4'>
            <a
              href='https://facebook.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Facebook'
            >
              <Facebook className='w-5 h-5' />
            </a>
            <a
              href='https://tiktok.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Tiktok'
            >
              <svg className='w-5 h-5' viewBox='0 0 24 24' fill='currentColor'>
                <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z' />
              </svg>
            </a>
            <a
              href='https://instagram.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Instagram'
            >
              <Instagram className='w-5 h-5' />
            </a>
            <a
              href='https://youtube.com'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Youtube'
            >
              <Youtube className='w-5 h-5' />
            </a>
          </div>
        </div>

        {/* Image Section */}
        <div className='hidden md:block absolute bottom-0 right-0'>
          <img
            src={BANNER.HUMAN_WITH_DOG}
            alt='Woman with dog'
            className='object-cover'
            style={{ width: '240px', height: '220px' }}
          />
        </div>
      </div>
    </footer>
  );
}
