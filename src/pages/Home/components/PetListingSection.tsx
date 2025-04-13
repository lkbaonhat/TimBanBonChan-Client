'use client';

import { useState, useRef } from 'react';
import {
  Heart,
  MapPin,
  Building,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const petCategories = [
  { id: 'dog', label: 'Chó' },
  { id: 'cat', label: 'Mèo' },
  { id: 'other', label: 'Khác' },
];

const pets = [
  {
    id: 1,
    name: 'Danny',
    image: 'Danny.png',
    gender: 'Đực',
    location: 'Trường thành',
    area: 'Đống Đa',
    category: 'dog',
  },
  {
    id: 2,
    name: 'Diva',
    image: 'Diva.png',
    gender: 'Cái',
    location: 'Trường thành',
    area: 'Đống Đa',
    category: 'dog',
  },
  {
    id: 3,
    name: 'Max',
    image: 'Max.png',
    gender: 'Đực',
    location: 'Trường thành',
    area: 'Đống Đa',
    category: 'dog',
  },
  {
    id: 4,
    name: 'Luna',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uoGzbpRTcDiKRvqkKdJ954sH9FCfVP.png',
    gender: 'Cái',
    location: 'Trường thành',
    area: 'Cầu Giấy',
    category: 'cat',
  },
  {
    id: 5,
    name: 'Milo',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uoGzbpRTcDiKRvqkKdJ954sH9FCfVP.png',
    gender: 'Đực',
    location: 'Trường thành',
    area: 'Hai Bà Trưng',
    category: 'cat',
  },
  {
    id: 6,
    name: 'Bunny',
    image:
      'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uoGzbpRTcDiKRvqkKdJ954sH9FCfVP.png',
    gender: 'Cái',
    location: 'Trường thành',
    area: 'Tây Hồ',
    category: 'other',
  },
];

const PetListingSection = () => {
  const [activeCategory, setActiveCategory] = useState('dog');
  const [currentPage, setCurrentPage] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const filteredPets = pets.filter((pet) => pet.category === activeCategory);
  const totalPages = Math.ceil(filteredPets.length / 3);

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      setActiveDot(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      setActiveDot(currentPage + 1);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentPage(index);
    setActiveDot(index);
  };

  return (
    <section className='py-16 px-10 bg-pink-50'>
      <div className='container mx-auto'>
        <h2 className='text-3xl font-bold text-center mb-10'>
          Làm quen với các bé
        </h2>

        {/* Category Tabs */}
        <div className='flex justify-center mb-8'>
          <div className='inline-flex rounded-full p-1 cursor-pointer  '>
            {petCategories.map((category) => (
              <button
                key={category.id}
                className={`px-15 py-3 rounded-full transition-all duration-300 cursor-pointer ${
                  activeCategory === category.id
                    ? 'bg-blue-200 text-blue-800 font-medium'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => {
                  setActiveCategory(category.id);
                  setCurrentPage(0);
                  setActiveDot(0);
                }}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className='flex justify-end mb-4'>
          <div className='flex space-x-2'>
            <button
              onClick={handlePrevious}
              className={`p-2 rounded-full shadow-sm transition-colors ${
                currentPage === 0
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              disabled={currentPage === 0}
              aria-label='Previous pets'
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className={`p-2 rounded-full shadow-sm transition-colors ${
                currentPage === totalPages - 1
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-blue-50'
              }`}
              disabled={currentPage === totalPages - 1}
              aria-label='Next pets'
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Pet Cards Slider */}
        <div className='relative'>
          <div className='overflow-hidden'>
            <div
              ref={sliderRef}
              className='flex transition-transform duration-500 ease-in-out'
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div key={pageIndex} className='w-full flex-shrink-0'>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {filteredPets
                      .slice(pageIndex * 3, (pageIndex + 1) * 3)
                      .map((pet) => (
                        <div
                          key={pet.id}
                          className=' bg-white rounded-xl  overflow-hidden h-full transition-transform transform hover:scale-99 '
                        >
                          <div className='h-100 overflow-hidden'>
                            <img
                              src={pet.image || '/placeholder.svg'}
                              alt={pet.name}
                              className='w-full h-150 object-cover pt-4'
                              style={{
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease-in-out',
                              }}
                            />
                          </div>
                          <div className='p-4'>
                            <div className='flex justify-between items-center mb-2'>
                              <h3 className='text-xl font-bold'>{pet.name}</h3>
                              <span className='bg-blue-500 text-white text-xs px-2 py-1 rounded-full'>
                                {pet.category === 'dog'
                                  ? 'Chó'
                                  : pet.category === 'cat'
                                  ? 'Mèo'
                                  : 'Khác'}
                              </span>
                            </div>
                            <div className='space-y-2 mb-4'>
                              <div className='flex items-center text-sm text-gray-600'>
                                <Heart size={16} className='mr-2' />
                                <span>{pet.gender}</span>
                              </div>
                              <div className='flex items-center text-sm text-gray-600'>
                                <Building size={16} className='mr-2' />
                                <span>{pet.location}</span>
                              </div>
                              <div className='flex items-center text-sm text-gray-600'>
                                <MapPin size={16} className='mr-2' />
                                <span>{pet.area}</span>
                              </div>
                            </div>
                            <button className='w-full py-2 bg-pink-300 text-white rounded-full hover:bg-pink-400 transition-colors'>
                              Nhận nuôi ngay
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className='flex justify-center mt-8 space-x-2'>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeDot === index ? 'bg-blue-500 w-6' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className='text-right mt-6'>
          <a
            href='/pets'
            className='inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors'
          >
            Xem tất cả
            <ChevronRight size={16} className='ml-1' />
          </a>
        </div>
      </div>
    </section>
  );
};

export default PetListingSection;
