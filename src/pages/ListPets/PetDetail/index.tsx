import { useState, useEffect } from "react";
import { Heart, Share2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./pet-detail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "@/constants/routes";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { axiosClient } from "@/config/axios";
import { API_ENDPOINT } from "@/constants/api";
import { Pet } from "@/types/Pet";

// Remove the Pet interface definition as it's now imported

export default function PetDetail() {
  const navigate = useNavigate();
  const { slug } = useParams();

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for pet data
  const [pet, setPet] = useState<Pet | null>(null);

  // Formatted pet details for display
  const [petDetails, setPetDetails] = useState({
    breed: "",
    healthStatus: "",
    weight: "",
    size: "",
    age: "",
    color: "",
    personality: "",
    foodAndToys: "",
    suitableWith: "",
    notSuitableWith: "",
    location: "",
    vaccinationStatus: "",
    neuterStatus: "",
    trainingStatus: "",
    categoryName: "",
    adoptionStatus: "",
    createdDate: "",
  });

  // Fetch pet data on component mount
  useEffect(() => {
    const fetchPetDetails = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);
        console.log(`Fetching pet details for: ${slug}`);

        // Replace :slug parameter instead of appending the slug
        const endpoint = API_ENDPOINT.PET.DETAIL.replace(":slug", slug);
        const response = await axiosClient.get(endpoint);

        console.log("Pet details full response:", response);
        console.log("Pet details response data:", response.data);

        // Handle the API response format with better validation
        let petData;
        if (response.data && response.data.data) {
          // The API returns { statusCode, success, message, data: Pet, detailErrors }
          console.log("Found nested data property:", response.data.data);
          petData = response.data.data;
        } else if (
          response.data &&
          typeof response.data === "object" &&
          "petId" in response.data
        ) {
          // Direct pet object with expected properties
          console.log("Found direct pet object");
          petData = response.data;
        } else {
          // Handle unexpected response format
          console.error("Unexpected response format:", response.data);
          throw new Error("Invalid response format from server");
        }

        // Verify we have valid pet data before updating state
        if (!petData || !petData.petId) {
          throw new Error("Invalid pet data received");
        }

        setPet(petData);

        // Update the display details with all available pet information
        setPetDetails({
          breed: petData.breed || "",
          healthStatus: petData.healthStatus || "Khỏe mạnh",
          weight: `${petData.weight} kg`,
          size: petData.size || "",
          age: petData.age,
          color: petData.color || "",
          personality: petData.personality || "",
          foodAndToys: petData.foodPreferences,
          suitableWith: petData.compatibleWith || "",
          notSuitableWith: petData.notCompatibleWith || "",
          location: petData.location || "",
          vaccinationStatus: petData.isVaccinated
            ? "Đã tiêm vắc-xin"
            : "Chưa tiêm vắc-xin",
          neuterStatus: petData.isNeutered ? "Đã triệt sản" : "Chưa triệt sản",
          trainingStatus: petData.isTrained
            ? "Đã huấn luyện"
            : "Chưa huấn luyện",
          categoryName: petData.categoryName || "",
          adoptionStatus: formatAdoptionStatus(petData.adoptionStatus),
          createdDate: formatDate(petData.createdDate),
        });
      } catch (err: any) {
        console.error("Error fetching pet details:", err);
        console.error("Error details:", {
          message: err.message,
          status: err.response?.status,
          data: err.response?.data,
          url: err.config?.url,
          method: err.config?.method,
        });

        setError(
          "Không thể tải thông tin chi tiết của thú cưng. Vui lòng thử lại sau."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [slug]);

  // Format age string
  const formatAge = (ageInMonths: number | undefined): string => {
    if (!ageInMonths) return "Không xác định";

    if (ageInMonths < 12) {
      return `${ageInMonths} tháng`;
    } else {
      const years = Math.floor(ageInMonths / 12);
      const months = ageInMonths % 12;

      if (months === 0) {
        return `${years} năm`;
      } else {
        return `${years} năm ${months} tháng`;
      }
    }
  };

  // Format date string
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "Không xác định";

    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch (error) {
      return dateString;
    }
  };

  // Format adoption status
  const formatAdoptionStatus = (status: string | undefined): string => {
    if (!status) return "Không xác định";

    switch (status.toLowerCase()) {
      case "available":
        return "Sẵn sàng nhận nuôi";
      case "pending":
        return "Đang xử lý hồ sơ";
      case "adopted":
        return "Đã có chủ";
      default:
        return status;
    }
  };

  // Format health status string
  const formatHealthStatus = (pet: Pet): string => {
    let status = pet.healthStatus || "Khỏe mạnh";
    if (pet.isVaccinated) status += ", tiêm vắc xin đầy đủ";
    if (pet.isNeutered) status += ", đã triệt sản";
    if (pet.isTrained) status += ", đã được huấn luyện";
    return status;
  };

  // Format food and toy preferences
  const formatPreferences = (
    food: string | null,
    toys: string | null
  ): string => {
    if (!food && !toys) return "Thông tin chưa cập nhật";

    let result = "";
    if (food) result += `Thức ăn: ${food}`;
    if (food && toys) result += "; ";
    if (toys) result += `Đồ chơi: ${toys}`;

    return result;
  };

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Làm quen với các bé", path: "/pets" },
    { label: pet?.petName || "Chi tiết thú cưng" },
  ];

  if (loading && !pet) {
    return (
      <div className="container mx-auto">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error && !pet) {
    return (
      <div className="container mx-auto">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col items-center justify-center h-96 p-4">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Đã xảy ra lỗi
          </h2>
          <p className="text-center">{error}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate("/pets")}
          >
            Quay lại danh sách thú cưng
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <Breadcrumb items={breadcrumbItems} />
      <div className={styles.container}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        <div className={styles.content}>
          <div className={styles.imageContainer}>
            {pet?.petImageUrls ? (
              <div className="relative w-full h-0 pb-[75%] overflow-hidden rounded-lg">
                <img
                  src={pet.petImageUrls}
                  alt={`${pet.petName} - ${pet.breed}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative w-full h-0 pb-[75%] bg-gray-200 rounded-lg">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-500">Chưa có hình ảnh</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.details}>
            <div className={styles.titleRow}>
              <h1 className={styles.petName}>
                {pet?.petName || "Không có tên"}
              </h1>
              <div className={styles.actions}>
                <Button
                  variant="ghost"
                  size="icon"
                  className={styles.actionButton}
                  animation="none"
                >
                  <Heart className={styles.actionIcon} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={styles.actionButton}
                  animation="none"
                >
                  <Share2 className={styles.actionIcon} />
                </Button>
              </div>
            </div>

            <div className={styles.petTags}>
              <span className={styles.tag}>
                {pet?.categoryName || "Không xác định"}
              </span>
              <span className={styles.tagSeparator}>|</span>
              <span className={styles.tag}>
                {pet?.age}
              </span>
              <span className={styles.tagSeparator}>|</span>
              <span className={styles.tag}>
                {pet?.gender || "Không xác định"}
              </span>
            </div>

            <p className={styles.description}>
              {pet?.description || "Chưa có mô tả chi tiết."}
            </p>

            <h2 className={styles.sectionTitle}>Thông tin chi tiết</h2>

            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Loại thú cưng</div>
                <div className={styles.infoValue}>
                  {petDetails.categoryName}
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Giống</div>
                <div className={styles.infoValue}>{petDetails.breed}</div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Tuổi</div>
                <div className={styles.infoValue}>{petDetails.age}</div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Kích thước</div>
                <div className={styles.infoValue}>{petDetails.size}</div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Tình trạng Sức khỏe</div>
                <div className={styles.infoValue}>
                  {petDetails.healthStatus}
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Tiêm vắc-xin</div>
                <div className={styles.infoValue}>
                  {petDetails.vaccinationStatus}
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Triệt sản</div>
                <div className={styles.infoValue}>
                  {petDetails.neuterStatus}
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Huấn luyện</div>
                <div className={styles.infoValue}>
                  {petDetails.trainingStatus}
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Tính cách</div>
                <div className={styles.infoValue}>{petDetails.personality}</div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Thức ăn và đồ chơi</div>
                <div className={styles.infoValue}>{petDetails.foodAndToys}</div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Phù hợp với</div>
                <div className={styles.infoValue} dangerouslySetInnerHTML={{ __html: petDetails.suitableWith }} />
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Địa chỉ</div>
                <div className={styles.infoValue}>
                  {petDetails.location || "Không có thông tin"}
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Trạng thái</div>
                <div className={styles.infoValue}>
                  {petDetails.adoptionStatus}
                </div>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <Button
                variant="blue"
                shape="default"
                animation="none"
                className="mr-4"
              >
                Liên hệ trực tiếp
              </Button>
              <Button
                variant="pink"
                shape="default"
                animation="none"
                onClick={() => {
                  if (pet?.slug) {
                    // Use slug instead of ID for navigation
                    console.log(
                      `Navigating to adoption form for pet: ${pet.petName} (${pet.slug})`
                    );
                    const adoptionUrl = `/pets/${pet.slug}/adoption-form`;
                    console.log(`Navigation URL: ${adoptionUrl}`);
                    navigate(adoptionUrl);
                  } else {
                    console.error("Cannot navigate: Pet slug is undefined");
                  }
                }}
              >
                Đăng ký thủ tục nhận nuôi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
