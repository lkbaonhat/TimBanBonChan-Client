import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  currentPath?: string;
}

const Breadcrumb = ({ items, currentPath }: BreadcrumbProps) => {
  // Use the current location if currentPath is not provided
  const location = useLocation();
  const path = currentPath || location.pathname;

  return (
    <nav className='flex py-4' aria-label='Breadcrumb'>
      <ol className='inline-flex items-center space-x-1 md:space-x-3'>
        <li className='inline-flex items-center'>
          <Link
            to='/'
            className={`text-gray-700 hover:text-gray-900 ${
              path === '/' ? 'font-bold' : ''
            }`}
          >
            Trang chủ
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className='flex items-center'>
              <ChevronRight className='w-4 h-4 text-gray-500' />
              <Link
                to={item.href}
                className={`ml-1 text-gray-700 hover:text-gray-900 md:ml-2 ${
                  path === item.href ? 'font-bold' : ''
                }`}
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
