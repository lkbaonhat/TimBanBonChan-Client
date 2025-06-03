import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';

export default function DefaultLayout() {
  return (
    <div>
      <Header />
      <div className='flex flex-col min-h-screen bg-[#FFEDFA]'>
        {/* Main content area */}
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
