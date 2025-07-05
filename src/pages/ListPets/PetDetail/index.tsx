import { useState, useEffect } from "react";
import { Heart, Share2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./pet-detail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { PageLoading } from "@/components/Loading";
import { petService } from "@/services/petService";
import ContentHeader from "@/components/ContentHeader/ContentHeader";

// Updated interfaces to match the adoption post API response
interface Pet {
  petId: number;
  petName: string;
  age: string;
  ageUnit: string;
  gender: string;
  size: string;
  color: string | null;
  weight: number | null;
  isVaccinated: boolean;
  isNeutered: boolean;
  isTrained: boolean;
  healthStatus: string;
  personality: string;
  description: string;
  adoptionStatus: string;
  foodPreferences: string;
  toyPreferences: string | null;
  compatibleWith: string;
  notCompatibleWith: string | null;
  location: string;
  purpose: string;
  slug: string;
  categoryName: string;
  breedName: string;
  imageUrls: string[];
}

interface AdoptionPost {
  postId: number;
  title: string;
  content: string;
  adoptionFee: number;
  location: string;
  city: string | null;
  district: string | null;
  postStatus: string;
  isUrgent: boolean;
  viewCount: number;
  createdByUserId: number;
  createdDate: string;
  pet: Pet;
}

export default function PetDetail() {
  const navigate = useNavigate();
  const { postId } = useParams();

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // State for pet data only
  const [pet, setPet] = useState<Pet | null>(null);
  const [adoptionPost, setAdoptionPost] = useState<AdoptionPost | null>(null);

  // Current user and time info
  const currentUserLogin = "lkbaonhat";
  const currentDateTime = "2025-06-18 14:22:51";

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
  });

  // Fetch adoption post data on component mount
  useEffect(() => {
    const fetchAdoptionPostDetails = async () => {
      if (!postId) return;

      try {
        setLoading(true);
        setError(null);

        const response = await petService.getAdoptionPostDetail(postId);

        // Handle the API response format
        if (!response.data.success) {
          throw new Error(
            response.data.message || "Failed to fetch adoption post details"
          );
        }

        const postData = response.data.data;

        // Verify we have valid post data
        if (!postData || !postData.postId) {
          throw new Error("Invalid adoption post data received");
        }

        // Store both for navigation purposes
        setAdoptionPost(postData);
        setPet(postData.pet);

        // Update the display details with pet information only
        setPetDetails({
          breed: postData.pet.breedName || "Không xác định",
          healthStatus: postData.pet.healthStatus || "Khỏe mạnh",
          weight: postData.pet.weight
            ? `${postData.pet.weight} kg`
            : "Không xác định",
          size: postData.pet.size || "Không xác định",
          age: postData.pet.age,
          color: postData.pet.color || "Không xác định",
          personality: postData.pet.personality || "Không có thông tin",
          foodAndToys: postData.pet.foodPreferences,
          suitableWith: postData.pet.compatibleWith || "Không có thông tin",
          notSuitableWith:
            postData.pet.notCompatibleWith || "Không có thông tin",
          location: postData.pet.location || "Không xác định",
          vaccinationStatus: postData.pet.isVaccinated
            ? "Đã tiêm vắc-xin"
            : "Chưa tiêm vắc-xin",
          neuterStatus: postData.pet.isNeutered
            ? "Đã triệt sản"
            : "Chưa triệt sản",
          trainingStatus: postData.pet.isTrained
            ? "Đã huấn luyện"
            : "Chưa huấn luyện",
          categoryName: postData.pet.categoryName || "Không xác định",
          adoptionStatus: formatAdoptionStatus(postData.pet.adoptionStatus),
        });
      } catch (err: unknown) {
        console.error(
          `[${currentDateTime}] Error fetching adoption post details:`,
          err
        );

        if (err && typeof err === "object" && "response" in err) {
          const errorWithResponse = err as { response: { status: number } };
          const status = errorWithResponse.response.status;
          if (status === 404) {
            setError("Không tìm thấy thông tin thú cưng này.");
          } else if (status === 403) {
            setError("Bạn không có quyền xem thông tin này.");
          } else {
            setError("Lỗi server. Vui lòng thử lại sau.");
          }
        } else if (err && typeof err === "object" && "request" in err) {
          setError(
            "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
          );
        } else {
          setError("Không thể tải thông tin chi tiết. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdoptionPostDetails();
  }, [postId]);

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

  // Handle adoption form navigation - Updated to use pet slug
  const handleAdoptionFormClick = () => {
    if (pet && pet.slug) {
      const adoptionUrl = `/pets/${postId}/adoption-form`;

      navigate(adoptionUrl);
    } else {
      // Fallback: show error message or use postId
      if (adoptionPost) {
        const fallbackUrl = `/adoption-form/${adoptionPost.postId}`;
        navigate(fallbackUrl);
      }
    }
  };

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Làm quen với các bé", path: "/pets" },
    { label: pet?.petName || "Chi tiết thú cưng" },
  ];

  if (loading && !pet) {
    return <PageLoading text="Đang tải thông tin thú cưng..." />;
  }

  if (error && !pet) {
    return (
      <div className="container mx-auto px-4">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-col items-center justify-center h-96 p-4">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Đã xảy ra lỗi
          </h2>
          <p className="text-center mb-4">{error}</p>
          <p className="text-xs text-gray-500 mb-4">
            User: {currentUserLogin} | {currentDateTime}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate("/pets")}>
              Quay lại danh sách
            </Button>
            <Button variant="blue" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get main image from pet images
  const mainImage =
    pet?.imageUrls && pet.imageUrls.length > 0
      ? pet.imageUrls[0]
      : "/placeholder.svg?height=400&width=600";

  return (
    <div className="container mx-auto min-h-screen ">
      <Breadcrumb items={breadcrumbItems} />
      <div className={styles.container}>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}

        {/* Pet's basic info at the top */}
        <div className={styles.petHeader}>
          <div className={styles.titleRow}>
            <ContentHeader
              title={pet?.petName || "Không có tên"}
              className={styles.petName}
            />
            {/* <div className={styles.actions}>
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
            </div> */}
          </div>

          <div className={styles.petTags}>
            <span className={styles.tag}>{petDetails.categoryName}</span>
            <span className={styles.tagSeparator}>|</span>
            <span className={styles.tag}>{petDetails.age}</span>
            <span className={styles.tagSeparator}>|</span>
            <span className={styles.tag}>
              {pet?.gender || "Không xác định"}
            </span>
          </div>

          <p className={styles.description}>
            {pet?.description || "Chưa có mô tả chi tiết."}
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <div className={styles.mainImageWrapper}>
              <img
                src={mainImage}
                alt={`${pet?.petName} - ${pet?.breedName}`}
                className={styles.petImage}
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg?height=400&width=600";
                }}
              />
            </div>

            {/* Additional images if available */}
            {pet?.imageUrls && pet.imageUrls.length > 1 && (
              <div className="grid grid-cols-3 gap-2 mt-2 flex-shrink-0">
                {pet.imageUrls.slice(1, 4).map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative w-full h-0 pb-[75%] overflow-hidden rounded"
                  >
                    <img
                      src={imageUrl}
                      alt={`${pet.petName} - ảnh ${index + 2}`}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/placeholder.svg?height=200&width=200";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.details}>
            <div className={styles.infoGridScrollable}>
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
                  <div className={styles.infoLabel}>Giới tính</div>
                  <div className={styles.infoValue}>
                    {pet?.gender || "Không xác định"}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Kích thước</div>
                  <div className={styles.infoValue}>{petDetails.size}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Cân nặng</div>
                  <div className={styles.infoValue}>{petDetails.weight}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Màu lông</div>
                  <div className={styles.infoValue}>{petDetails.color}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Tình trạng sức khỏe</div>
                  <div className={styles.infoValue}>
                    {petDetails.healthStatus}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Tiêm vắc-xin</div>
                  <div className={styles.infoValue}>
                    <span
                      className={
                        pet?.isVaccinated ? "text-green-600" : "text-red-600"
                      }
                    >
                      {petDetails.vaccinationStatus}
                    </span>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Triệt sản</div>
                  <div className={styles.infoValue}>
                    <span
                      className={
                        pet?.isNeutered ? "text-green-600" : "text-red-600"
                      }
                    >
                      {petDetails.neuterStatus}
                    </span>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Huấn luyện</div>
                  <div className={styles.infoValue}>
                    <span
                      className={
                        pet?.isTrained ? "text-green-600" : "text-red-600"
                      }
                    >
                      {petDetails.trainingStatus}
                    </span>
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Tính cách</div>
                  <div className={styles.infoValue}>
                    {petDetails.personality}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>
                    Sở thích ăn uống & chơi
                  </div>
                  <div className={styles.infoValue}>
                    {petDetails.foodAndToys}
                  </div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Phù hợp với</div>
                  <div
                    className={styles.infoValue}
                    dangerouslySetInnerHTML={{
                      __html: petDetails.suitableWith,
                    }}
                  />
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Địa chỉ</div>
                  <div className={styles.infoValue}>{petDetails.location}</div>
                </div>

                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Trạng thái nhận nuôi</div>
                  <div className={styles.infoValue}>
                    <span
                      className={
                        pet?.adoptionStatus === "Available"
                          ? "text-green-600 "
                          : "text-yellow-600"
                      }
                    >
                      {petDetails.adoptionStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          {/* <Button
            variant="blue"
            shape="default"
            animation="none"
            className="mr-4"
          >
            Liên hệ trực tiếp
          </Button> */}
          <Button
            variant="pink"
            shape="default"
            animation="none"
            onClick={handleAdoptionFormClick}
            disabled={pet?.adoptionStatus !== "Available"}
          >
            {pet?.adoptionStatus === "Available"
              ? "Đăng ký thủ tục nhận nuôi"
              : "Không thể nhận nuôi"}
          </Button>
        </div>
      </div>
    </div>
  );
}
