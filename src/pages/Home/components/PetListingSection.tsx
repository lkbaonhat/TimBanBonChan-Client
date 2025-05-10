"use client";

import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/Card/Card";
import { Button } from "@/components/ui/button";

const petCategories = [
  { id: "dog", label: "Chó" },
  { id: "cat", label: "Mèo" },
  { id: "other", label: "Khác" },
];

const pets = [
  {
    id: 1,
    name: "Danny",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JFCjG2KbbkZoqphrmPABDKSrnZSwTn.png",
    gender: "Đực",
    location: "Trường thành",
    area: "Đống Đa",
    category: "dog",
  },
  {
    id: 2,
    name: "Diva",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JFCjG2KbbkZoqphrmPABDKSrnZSwTn.png",
    gender: "Cái",
    location: "Trường thành",
    area: "Đống Đa",
    category: "dog",
  },
  {
    id: 3,
    name: "Max",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JFCjG2KbbkZoqphrmPABDKSrnZSwTn.png",
    gender: "Đực",
    location: "Trường thành",
    area: "Đống Đa",
    category: "dog",
  },
  {
    id: 4,
    name: "Luna",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JFCjG2KbbkZoqphrmPABDKSrnZSwTn.png",
    gender: "Cái",
    location: "Trường thành",
    area: "Cầu Giấy",
    category: "cat",
  },
  {
    id: 5,
    name: "Milo",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JFCjG2KbbkZoqphrmPABDKSrnZSwTn.png",
    gender: "Đực",
    location: "Trường thành",
    area: "Hai Bà Trưng",
    category: "cat",
  },
  {
    id: 6,
    name: "Bunny",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JFCjG2KbbkZoqphrmPABDKSrnZSwTn.png",
    gender: "Cái",
    location: "Trường thành",
    area: "Tây Hồ",
    category: "other",
  },
];

const PetListingSection = () => {
  const [activeCategory, setActiveCategory] = useState("dog");
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

  const handleAdopt = (id: number) => {
    console.log(`Adopting pet with id: ${id}`);
    // Handle adoption logic
  };

  // Function to get category label
  const getCategoryLabel = (categoryId: string) => {
    switch (categoryId) {
      case "dog":
        return "Chó";
      case "cat":
        return "Mèo";
      default:
        return "Khác";
    }
  };

  return (
    <section className="py-16 px-10 bg-pink-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Làm quen với các bé
        </h2>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full p-1 cursor-pointer">
            {petCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "blue" : "ghost"}
                shape="pill"
                size="sm"
                animation="none"
                onClick={() => {
                  setActiveCategory(category.id);
                  setCurrentPage(0);
                  setActiveDot(0);
                }}
                className={
                  activeCategory === category.id
                    ? "bg-blue-200 text-blue-800 font-medium"
                    : "text-gray-600 hover:text-blue-600"
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-end mb-4">
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="icon"
              shape="pill"
              onClick={handlePrevious}
              disabled={currentPage === 0}
              aria-label="Previous pets"
              className={`rounded-full shadow-sm ${
                currentPage === 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              <ChevronLeft size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              shape="pill"
              onClick={handleNext}
              disabled={currentPage === totalPages - 1}
              aria-label="Next pets"
              className={`rounded-full shadow-sm ${
                currentPage === totalPages - 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-700 hover:bg-blue-50"
              }`}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>

        {/* Pet Cards Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPets
                      .slice(pageIndex * 3, (pageIndex + 1) * 3)
                      .map((pet) => (
                        <div
                          key={pet.id}
                          className="transition-transform transform hover:scale-[0.99]"
                        >
                          <Card
                            type="pet"
                            image={pet.image}
                            title={pet.name}
                            badge={getCategoryLabel(pet.category)}
                            gender={pet.gender}
                            location={pet.location}
                            area={pet.area}
                            buttonText="Nhận nuôi ngay"
                            onButtonClick={() => handleAdopt(pet.id)}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              animation="none"
              onClick={() => handleDotClick(index)}
              className={`p-0 h-3 min-w-0 ${
                activeDot === index ? "bg-blue-500 w-6" : "bg-gray-300 w-3"
              } rounded-full transition-all duration-300`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="text-right mt-6">
          <Button
            asChild
            variant="link"
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            <a href="/pets" className="inline-flex items-center">
              Xem tất cả
              <ChevronRight size={16} className="ml-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PetListingSection;
