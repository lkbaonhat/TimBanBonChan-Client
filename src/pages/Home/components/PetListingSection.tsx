"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/Card/Card";
import { Button } from "@/components/ui/button";
import DotPagination from "@/components/Pagination/DotPagination";
import { Link, useNavigate } from "react-router-dom";
import { axiosClient } from "@/config/axios";
import { API_ENDPOINT } from "@/constants/api";
import { Pet } from "@/types/Pet";

// Remove the Pet interface definition

const petCategories = [
  { id: 1, label: "Chó" },
  { id: 2, label: "Mèo" },
  { id: "other", label: "Khác" },
];

const PetListingSection = () => {
  const [activeCategory, setActiveCategory] = useState<number | string>(1);
  const [currentPage, setCurrentPage] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // New state for API data
  const [allPets, setAllPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pets from API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build parameters - only include category filter
        const params: Record<string, any> = {};
        if (typeof activeCategory === "number") {
          params.categoryId = activeCategory;
        }

        const response = await axiosClient.get(API_ENDPOINT.PET.LIST, {
          params,
        });

        console.log("API Response:", response.data);

        // Extract pets from the response based on the actual structure
        let pets: Pet[] = [];

        // Handle nested response format: { success, data: { items: [] } }
        if (response.data && response.data.success === true) {
          if (response.data.data && Array.isArray(response.data.data.items)) {
            // Standard format with items array
            pets = response.data.data.items;
            console.log(
              `Found ${pets.length} pets in response.data.data.items`
            );
          } else if (response.data.data && Array.isArray(response.data.data)) {
            // Alternative format with direct data array
            pets = response.data.data;
            console.log(`Found ${pets.length} pets in response.data.data`);
          }
        } else if (Array.isArray(response.data)) {
          // Direct array response
          pets = response.data;
          console.log(`Found ${pets.length} pets in direct array`);
        } else {
          // No recognizable format, log and throw error
          console.error("Unexpected response format:", response.data);
          throw new Error("Invalid response format");
        }

        if (pets.length === 0) {
          console.warn("No pets found in the response");
        }

        setAllPets(pets);
      } catch (err: any) {
        console.error("Error fetching pets:", err);
        setError("Không thể tải danh sách thú cưng. Vui lòng thử lại sau.");
        setAllPets([]); // Reset to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [activeCategory]);

  // Filter pets based on active category
  const filteredPets =
    typeof activeCategory === "number"
      ? allPets.filter((pet) => pet.categoryId === activeCategory)
      : allPets.filter(
          (pet) =>
            !petCategories.some(
              (c) => typeof c.id === "number" && c.id === pet.categoryId
            )
        );

  const totalPages = Math.ceil(filteredPets.length / 3);

  const handleButtonClick = (slug: string) => {
    navigate(`/pets/${slug}`);
  };

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
    <section className="py-16 px-10 bg-pink-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Làm quen với các bé
        </h2>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full p-1 cursor-pointer gap-2">
            {petCategories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "blue" : "ghost"}
                shape="pill"
                size="lg"
                animation="none"
                onClick={() => {
                  setActiveCategory(category.id);
                  setCurrentPage(0);
                  setActiveDot(0);
                }}
                className={
                  activeCategory === category.id
                    ? "bg-[#c5e2f0] text-grey hover:text-grey hover:bg-[#bae2f7] font-medium"
                    : " "
                }
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500">{error}</p>
          </div>
        ) : filteredPets.length === 0 ? (
          <div className="text-center py-8">
            <p>Không có thú cưng nào trong danh mục này.</p>
          </div>
        ) : (
          <>
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
                              key={pet.petId}
                              className="transition-transform transform hover:scale-[0.99]"
                            >
                              <Card
                                type="pet"
                                image={pet.petImageUrls || ""}
                                title={pet.petName}
                                badge={pet.categoryName}
                                gender={pet.gender}
                                location={
                                  pet.age < 12
                                    ? "Chưa trưởng thành"
                                    : "Trưởng thành"
                                }
                                area={pet.location || "Không xác định"}
                                buttonText="Thông tin chi tiết"
                                onButtonClick={() =>
                                  handleButtonClick(pet.slug)
                                }
                              />
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dot Pagination */}
            <DotPagination
              currentPage={activeDot}
              totalPages={totalPages}
              onPageChange={handleDotClick}
              className="mt-8"
            />
          </>
        )}

        <div className="text-right mt-6">
          <Button
            asChild
            variant="link"
            className="text-[#0053a3] font-medium transition-colors"
          >
            <Link to="/pets" className="inline-none items-center">
              Xem tất cả
              <ChevronRight size={16} className="ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PetListingSection;
