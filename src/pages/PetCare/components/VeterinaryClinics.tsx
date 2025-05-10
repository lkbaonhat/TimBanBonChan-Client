"use client";

import { useState, useRef } from "react";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/Card/Card";
import { Button } from "@/components/ui/button";

// Sample data for vet clinics
const vetClinics = [
  {
    id: 1,
    name: "Trạm thú y Bình An",
    location: "TP Thủ Đức - TP HCM",
    rating: 4.5,
    phone: "0901 234 567",
    hours: "8:00 - 19:00",
    price: "~250.000 VND",
    image: "/clinic1.jpg",
  },
  {
    id: 2,
    name: "Phòng khám PetCare",
    location: "Quận 1 - Hà Nội",
    rating: 5.0,
    phone: "0901 234 567",
    hours: "8:00 - 19:00",
    price: "~500.000 VND",
    image: "/clinic2.jpg",
  },
  {
    id: 3,
    name: "Trạm thú y Hạnh Phúc",
    location: "Quận 12 - Đà Nẵng",
    rating: 4.0,
    phone: "0901 234 567",
    hours: "8:00 - 19:00",
    price: "~300.000 VND",
    image: "/clinic3.jpg",
  },
  {
    id: 4,
    name: "Trạm thú y Bình An",
    location: "TP Thủ Đức - TP HCM",
    rating: 4.5,
    phone: "0901 234 567",
    hours: "8:00 - 19:00",
    price: "~250.000 VND",
    image: "/clinic1.jpg",
  },
  {
    id: 5,
    name: "Phòng khám PetCare",
    location: "Quận 1 - Hà Nội",
    rating: 5.0,
    phone: "0901 234 567",
    hours: "8:00 - 19:00",
    price: "~500.000 VND",
    image: "/clinic2.jpg",
  },
  {
    id: 6,
    name: "Trạm thú y Hạnh Phúc",
    location: "Quận 12 - Đà Nẵng",
    rating: 4.0,
    phone: "0901 234 567",
    hours: "8:00 - 19:00",
    price: "~300.000 VND",
    image: "/clinic3.jpg",
  },
];

// Clinic categories
const clinicCategories = [
  { id: "all", label: "Tất cả" },
  { id: "emergency", label: "Cấp cứu" },
  { id: "vaccination", label: "Tiêm phòng" },
];

export default function VeterinaryClinics() {
  const [locationSearchTerm, setLocationSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [selectedClinic, setSelectedClinic] = useState(vetClinics[0]);

  // Filter clinics based on category
  const filteredClinics =
    activeCategory === "all"
      ? vetClinics
      : vetClinics.filter(
          (clinic) => clinic.id % 2 === (activeCategory === "emergency" ? 0 : 1)
        );

  const totalPages = Math.ceil(filteredClinics.length / 3);

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

  // Handle clinic selection
  const handleSelectClinic = (clinic) => {
    setSelectedClinic(clinic);
  };

  // Handle call clinic
  const handleCallClinic = (id: number) => {
    console.log(`Calling clinic with id: ${id}`);
    // In a real app, you would implement the call functionality here
  };

  return (
    <div className="container mx-auto px-4 mb-12">
      <h2 className="text-2xl font-bold text-center mb-6">
        Liên hệ với phòng khám thú y gần nhất
      </h2>

      {/* Location Search */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Nhập địa chỉ của bạn..."
            className="w-full h-10 pl-4 pr-10 rounded-full bg-blue-50 border-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={locationSearchTerm}
            onChange={(e) => setLocationSearchTerm(e.target.value)}
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
            <MapPin size={16} />
          </button>
        </div>
      </div>

      {/* Featured Clinic and Map */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Featured Clinic */}
        <Card
          type="clinic"
          image={selectedClinic.image}
          title={selectedClinic.name}
          location={selectedClinic.location}
          rating={selectedClinic.rating}
          phone={selectedClinic.phone}
          hours={selectedClinic.hours}
          price={selectedClinic.price}
          buttonText="Gọi ngay"
          onButtonClick={() => handleCallClinic(selectedClinic.id)}
        />
        {/* <Button
          asChild
          variant="pink"
          shape="pill"
          animation="none"
          className="mt-2 w-full"
        >
          <a
            href={
              selectedClinic.website ||
              `https://maps.google.com/?q=${selectedClinic.address}`
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            Truy cập website
          </a>
        </Button> */}

        {/* Map */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm h-full">
          <img
            src="/map.jpg"
            alt="Map with veterinary clinics"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://via.placeholder.com/600x400?text=Map";
            }}
          />
        </div>
      </div>

      {/* Clinic List Section */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Danh sách phòng khám
        </h3>

        {/* Navigation Controls */}
        <div className="flex justify-end mb-4">
          <div className="flex space-x-2">
            <button
              onClick={handlePrevious}
              className={`p-2 rounded-full shadow-sm transition-colors ${
                currentPage === 0
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
              disabled={currentPage === 0}
              aria-label="Previous clinics"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className={`p-2 rounded-full shadow-sm transition-colors ${
                currentPage === totalPages - 1
                  ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-white text-gray-700 hover:bg-blue-50"
              }`}
              disabled={currentPage === totalPages - 1}
              aria-label="Next clinics"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Clinic Cards Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentPage * 100}%)` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <div key={pageIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredClinics
                      .slice(pageIndex * 3, (pageIndex + 1) * 3)
                      .map((clinic) => (
                        <div
                          key={clinic.id}
                          className="cursor-pointer transition-transform transform hover:scale-[0.99]"
                          onClick={() => handleSelectClinic(clinic)}
                        >
                          <Card
                            type="clinic"
                            image={clinic.image}
                            title={clinic.name}
                            location={clinic.location}
                            rating={clinic.rating}
                            phone={clinic.phone}
                            hours={clinic.hours}
                            price={clinic.price}
                            buttonText="Chi tiết"
                            onButtonClick={(e) => {
                              e.stopPropagation();
                              handleCallClinic(clinic.id);
                            }}
                          />
                          {/* <Button
                            asChild
                            variant="pink"
                            shape="pill"
                            animation="none"
                            className="mt-2 w-full"
                          >
                            <a
                              href={
                                clinic.website ||
                                `https://maps.google.com/?q=${clinic.address}`
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Truy cập website
                            </a>
                          </Button> */}
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
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeDot === index ? "bg-blue-500 w-6" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="text-right mt-6">
          <a
            href="/clinics"
            className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
          >
            Xem tất cả
            <ChevronRight size={16} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
