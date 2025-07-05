"use client";

import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/Card/Card";
import { Button } from "@/components/ui/button";
import DotPagination from "@/components/Pagination/DotPagination";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import clinicsData from "@/constants/data/clinicsData.json";

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
  const [selectedClinic, setSelectedClinic] = useState(clinicsData[0]);
  const navigate = useNavigate();

  // Filter clinics based on category and search term
  const filteredClinics = clinicsData.filter((clinic) => {
    // Apply category filter (for demo purposes)
    if (activeCategory !== "all") {
      // Simple filter based on ID for demonstration
      const isEmergency = clinic.id % 2 === 0;
      if (
        (activeCategory === "emergency" && !isEmergency) ||
        (activeCategory === "vaccination" && isEmergency)
      ) {
        return false;
      }
    }

    // Apply location search filter
    if (
      locationSearchTerm &&
      !clinic.location.toLowerCase().includes(locationSearchTerm.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

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

  // Handle clinic detail navigation
  const handleClinicDetail = (id: number) => {
    navigate(`/clinics/${id}`);
  };

  return (
    <div className="container mx-auto  mb-12">
      {/* Clinic List Section */}
      <div>
        <div className="animate-on-scroll opacity-0">
          <ContentHeader
            title="Danh sách phòng khám"
            level="h2"
            className="mb-4"
          />
        </div>

        {/* Clinic Cards Slider */}
        <div className="relative animate-on-scroll opacity-0">
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
                      .map((clinic, index) => (
                        <div
                          key={clinic.id}
                          className="cursor-pointer transition-transform transform hover:scale-[0.99] animate-on-scroll opacity-0"
                          style={{ animationDelay: `${index * 0.1}s` }}
                          onClick={() => handleClinicDetail(clinic.id)}
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
                              handleClinicDetail(clinic.id);
                            }}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots Pagination */}
        <div className="animate-on-scroll opacity-0">
          <DotPagination
            currentPage={activeDot}
            totalPages={totalPages}
            onPageChange={handleDotClick}
            className="mt-8"
          />
        </div>

        <div className="text-right mt-6 animate-on-scroll opacity-0">
          <Button
            asChild
            variant="link"
            className="text-[#0053a3] font-medium transition-colors"
          >
            <Link to="/clinics" className="inline-flex items-center">
              Xem tất cả
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
