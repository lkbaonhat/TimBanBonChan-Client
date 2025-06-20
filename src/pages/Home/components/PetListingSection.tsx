import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/Card/Card";
import { Button } from "@/components/ui/button";
import DotPagination from "@/components/Pagination/DotPagination";
import { Link, useNavigate } from "react-router-dom";
import { Pet } from "@/types/Pet";
import { petService } from "@/services/petService";
import { useDispatch, useSelector } from "react-redux";
import { selectorGlobal } from "@/store/modules/global/selector";

// Define the post structure based on your API response
interface AdoptionPost {
  postId: number;
  title: string;
  content: string;
  adoptionFee: number;
  location: string;
  city: string;
  district: string;
  postStatus: string;
  isUrgent: boolean;
  viewCount: number;
  createdByUserId: number;
  createdDate: string;
  pet: Pet & {
    categoryName: string;
    breedName: string;
    imageUrls: string[];
  };
}

const PetListingSection = () => {
  const [activeCategory, setActiveCategory] = useState<number | string>(6); // Default to "Chó"
  const [currentPage, setCurrentPage] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const petCate = useSelector(selectorGlobal.petCategories);

  // State for API data - using AdoptionPost array
  const [allPosts, setAllPosts] = useState<AdoptionPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch({ type: "GET_PET_CATE" });
  }, []);

  // Fetch pets from API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await petService.getAllAdoptionPost();
        let posts: AdoptionPost[] = [];

        if (response?.data?.success === true) {
          if (Array.isArray(response.data.data?.items)) {
            posts = response.data.data.items;
          } else if (Array.isArray(response.data.data)) {
            posts = response.data.data;
          }
        } else if (Array.isArray(response.data)) {
          posts = response.data;
        } else {
          console.error("Unexpected response format:", response.data);
          throw new Error("Invalid response format");
        }

        // Filter only posts with pets and approved status
        const validPosts = posts.filter(post =>
          post.pet &&
          post.postStatus !== 'Rejected' &&
          post.pet.adoptionStatus === 'Available'
        );

        setAllPosts(validPosts);
        console.log("Fetched posts:", validPosts);
      } catch (err: any) {
        console.error("Error fetching pets:", err);
        setError("Không thể tải danh sách thú cưng. Vui lòng thử lại sau.");
        setAllPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  // Get category ID by name (since your pet data has categoryName but we need to filter by ID)
  const getCategoryIdByName = (categoryName: string): number | null => {
    const category = petCate.find(cat => cat.categoryName === categoryName);
    return category ? category.categoryId : null;
  };

  // Filter posts based on active category
  const filteredPosts = allPosts.filter((post) => {
    if (activeCategory === "all") {
      return true;
    }

    if (typeof activeCategory === "number") {
      // Get the category ID that matches the pet's category name
      const petCategoryId = getCategoryIdByName(post.pet.categoryName);
      return petCategoryId === activeCategory;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredPosts.length / 3);

  const handleButtonClick = (postId: number) => {
    navigate(`/pets/${postId}`);
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      setActiveDot(newPage);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      setActiveDot(newPage);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentPage(index);
    setActiveDot(index);
  };

  // Add "Tất cả" option to categories
  const allCategories = [
    { categoryId: "all", categoryName: "Tất cả" },
    ...petCate
  ];

  // Reset pagination when category changes
  useEffect(() => {
    setCurrentPage(0);
    setActiveDot(0);
  }, [activeCategory]);

  return (
    <section className="py-16 px-10 bg-pink-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-10">
          Làm quen với các bé
        </h2>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full p-1 cursor-pointer gap-2 flex-wrap">
            {allCategories.map((category) => (
              <Button
                key={category.categoryId}
                variant={activeCategory === category.categoryId ? "blue" : "ghost"}
                shape="pill"
                size="lg"
                animation="none"
                onClick={() => setActiveCategory(category.categoryId)}
                className={
                  activeCategory === category.categoryId
                    ? "bg-[#c5e2f0] text-grey hover:text-grey hover:bg-[#bae2f7] font-medium"
                    : "hover:bg-gray-100"
                }
              >
                {category.categoryName}
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
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <p>Không có thú cưng nào trong danh mục này.</p>
          </div>
        ) : (
          <>
            {/* Show total count */}
            <div className="text-center mb-4">
              <p className="text-gray-600">
                Tìm thấy {filteredPosts.length} bé cần tìm chủ mới
              </p>
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
                  className={`rounded-full shadow-sm ${currentPage === 0
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
                  className={`rounded-full shadow-sm ${currentPage === totalPages - 1
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
                        {filteredPosts
                          .slice(pageIndex * 3, (pageIndex + 1) * 3)
                          .map((post) => {
                            const pet = post.pet;
                            const postId = post.postId
                            const displayAge = pet.age === "Test" ? "3 tháng" : `${pet.age} ${pet.ageUnit?.toLowerCase() || 'tháng'}`;

                            return (
                              <div
                                key={`${post.postId}-${pet.petId}`}
                                className="transition-transform transform hover:scale-[0.99]"
                              >
                                <Card
                                  type="pet"
                                  image={pet.imageUrls?.[0] || ""} // Use first image from array
                                  title={pet.petName || "Không có tên"}
                                  badge={pet.categoryName || "Khác"}
                                  gender={pet.gender || "Không rõ"}
                                  location={displayAge}
                                  area={`${post.district || ""} ${post.city || ""}`.trim() || post.location || "Không xác định"}
                                  buttonText="Thông tin chi tiết"
                                  onButtonClick={() => handleButtonClick(postId)}
                                />
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Dot Pagination */}
            {totalPages > 1 && (
              <DotPagination
                currentPage={activeDot}
                totalPages={totalPages}
                onPageChange={handleDotClick}
                className="mt-8"
              />
            )}
          </>
        )}

        <div className="text-right mt-6">
          <Button
            asChild
            variant="link"
            className="text-[#0053a3] font-medium transition-colors"
          >
            <Link to="/pets" className="inline-flex items-center">
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