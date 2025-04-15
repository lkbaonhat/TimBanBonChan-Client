import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className='flex py-4' aria-label='Breadcrumb'>
      <ol className='inline-flex items-center space-x-1 md:space-x-3'>
        <li className='inline-flex items-center'>
          <Link to='/' className='text-gray-700 hover:text-blue-600'>
            Trang chủ
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className='flex items-center'>
              <ChevronRight className='w-4 h-4 text-gray-500' />
              <Link
                to={item.href}
                className='ml-1 text-gray-700 hover:text-blue-600 md:ml-2'
              >
                {item.label}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
