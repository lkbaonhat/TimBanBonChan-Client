import { useState, useEffect } from "react";
import { PetCard } from "../PetCard";
import PageHeader from "@/components/ContentHeader/ContentHeader";
import Filter, { FilterConfig } from "@/components/Filter/Filter";
import Pagination from "@/components/Pagination/Pagination";
import styles from "./pet-gallery.module.css";
import { petService } from "@/services/petService";

export default function PetGallery() {
  const [currentPage, setCurrentPage] = useState(1);
  const [petCategory, setPetCategory] = useState("all");
  const [age, setAge] = useState("all");
  const [gender, setGender] = useState("all");
  const [location, setLocation] = useState("all");
  const [pageSize] = useState(6);

  // State for adoption posts data
  const [allPosts, setAllPosts] = useState<IEntities.AdoptionPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<IEntities.AdoptionPost[]>([]);
  const [displayPosts, setDisplayPosts] = useState<IEntities.AdoptionPost[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Define filter configurations
  const filterConfigs: FilterConfig[] = [
    {
      id: "petCategory",
      placeholder: "Loại thú cưng",
      value: petCategory,
      onChange: setPetCategory,
      options: [
        { id: "all", label: "Loại", value: "all" },
        { id: "Chó", label: "Chó", value: "Chó" },
        { id: "Mèo", label: "Mèo", value: "Mèo" },
        { id: "Chim", label: "Chim", value: "Chim" },
      ],
    },
    {
      id: "age",
      placeholder: "Độ tuổi",
      value: age,
      onChange: setAge,
      options: [
        { id: "all", label: "Độ tuổi", value: "all" },
        { id: "young", label: "Chưa trưởng thành", value: "Chưa trưởng thành" },
        { id: "adult", label: "Trưởng thành", value: "Trưởng thành" },
      ],
    },
    {
      id: "gender",
      placeholder: "Giới tính",
      value: gender,
      onChange: setGender,
      options: [
        { id: "all", label: "Giới tính", value: "all" },
        { id: "male", label: "Đực", value: "Đực" },
        { id: "female", label: "Cái", value: "Cái" },
      ],
    },
  ];

  // Function to filter posts based on current filter settings
  const filterPosts = (posts: IEntities.AdoptionPost[]) => {
    return posts.filter(post => {
      const pet = post.pet;

      // Category filter
      if (petCategory !== "all" && pet.categoryName !== petCategory) {
        return false;
      }

      // Age filter - chỉ sử dụng field age
      if (age !== "all") {
        if (age === "Chưa trưởng thành" && pet.age !== "Chưa trưởng thành") {
          return false;
        }
        if (age === "Trưởng thành" && pet.age !== "Trưởng thành") {
          return false;
        }
      }

      // Gender filter
      if (gender !== "all" && pet.gender !== gender) {
        return false;
      }

      // Only show available pets
      if (post.postStatus !== "Available" && post.postStatus !== "Pending") {
        return false;
      }

      return true;
    });
  };

  // Function to fetch adoption posts from the API
  useEffect(() => {
    const fetchAdoptionPosts = async () => {
      try {
        setLoading(true);
        setError(null);

        // Make the API call
        const response = await petService.getAllAdoptionPost();

        if (!response.data.success) {
          throw new Error(response.data.message || 'Failed to fetch adoption posts');
        }

        const posts = response.data.data.items;

        // Update state with all fetched posts
        setAllPosts(posts);

        // Apply current filters
        const filtered = filterPosts(posts);
        setFilteredPosts(filtered);

        // Calculate total pages based on filtered results
        setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));

        // Reset to first page when data changes
        setCurrentPage(1);

      } catch (err: any) {
        console.error("Error fetching adoption posts:", err);

        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);

          if (err.response.status === 404) {
            setError("Không tìm thấy bài đăng nhận nuôi nào.");
          } else if (err.response.status === 403) {
            setError("Bạn không có quyền truy cập danh sách này.");
          } else if (err.response.status === 401) {
            setError("Bạn cần đăng nhập để xem danh sách này.");
          } else {
            setError("Lỗi server. Vui lòng thử lại sau.");
          }
        } else if (err.request) {
          setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.");
        } else {
          setError(err.message || "Đã xảy ra lỗi không xác định.");
        }

        setAllPosts([]);
        setFilteredPosts([]);
        setDisplayPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptionPosts();
  }, []); // Only fetch once on component mount

  // Apply filters when filter values change
  useEffect(() => {
    const filtered = filterPosts(allPosts);
    setFilteredPosts(filtered);
    setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));
    setCurrentPage(1); // Reset to first page when filters change
  }, [petCategory, age, gender, location, allPosts, pageSize]);

  // Update display posts when page or filtered posts change
  useEffect(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, filteredPosts.length);
    setDisplayPosts(filteredPosts.slice(startIndex, endIndex));
  }, [currentPage, filteredPosts, pageSize]);

  // Handler for page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Convert AdoptionPost to PetCardData
  const convertToPetCardData = (post: IEntities.AdoptionPost): IEntities.PetCardData => {
    const pet = post.pet;

    // Get the main image
    const imageUrl = pet.imageUrls && pet.imageUrls.length > 0
      ? pet.imageUrls[0]
      : "/placeholder.svg?height=200&width=200";

    // Format location
    const displayLocation = post.city
      ? `${post.district ? post.district + ', ' : ''}${post.city}`
      : post.location || pet.location || "Không xác định";

    // Format status based on adoption status and urgency
    let status = pet.adoptionStatus === "Available" ? "Có thể nhận nuôi" : pet.adoptionStatus;
    if (post.isUrgent) {
      status = "🚨 Cần gấp - " + status;
    }

    return {
      id: pet.petId,
      name: pet.petName,
      gender: pet.gender,
      location: displayLocation,
      status: status,
      imageUrl: imageUrl,
      categoryName: pet.categoryName,
      slug: pet.slug,
      postId: post.postId, // Added postId for navigation
      adoptionFee: post.adoptionFee,
      isUrgent: post.isUrgent,
      age: pet.age,
      ageUnit: pet.ageUnit,
      breedName: pet.breedName,
    };
  };

  // Retry function
  const handleRetry = () => {
    setError(null);
    window.location.reload();
  };

  return (
    <div className={styles.container}>
      <div className="flex justify-between items-center mb-8">
        <PageHeader title="Làm quen với các bé" />
        <Filter filters={filterConfigs} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải danh sách thú cưng...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{error}</p>
              <p className="text-sm mt-1">Thời gian: {new Date().toLocaleString('vi-VN')}</p>
            </div>
            <button
              onClick={handleRetry}
              className="ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-500 text-xl mb-4">🐾 Không tìm thấy kết quả</div>
          <p className="text-lg text-gray-600 mb-2">
            Không tìm thấy thú cưng nào phù hợp với bộ lọc hiện tại.
          </p>
          <p className="mt-2 text-gray-500">Vui lòng thử với các tiêu chí khác.</p>
          <button
            onClick={() => {
              setPetCategory("all");
              setAge("all");
              setGender("all");
              setLocation("all");
            }}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Xóa tất cả bộ lọc
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {displayPosts.map((post) => (
              <div key={post.postId} className="relative">
                <PetCard
                  pet={convertToPetCardData(post)}
                />
              </div>
            ))}
          </div>

          {filteredPosts.length > pageSize && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}