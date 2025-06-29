import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ROUTES from "@/constants/routes";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { petService, cloudinaryService } from "@/services/petService";
import { useSelector } from "react-redux";
import { selectorAuth } from "@/store/modules/auth/selector";
import type { IREDUX } from "@/types/IRedux";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UpdatePetInfo() {
  const userInfo = useSelector(selectorAuth.userInfo) as IREDUX.UserInfo;
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [petImage, setPetImage] = useState("/placeholder-pet.png");
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [newCloudinaryUrl, setNewCloudinaryUrl] = useState("");
  const [imageChanged, setImageChanged] = useState(false);
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("1"); // Default to dog
  const [petGender, setPetGender] = useState("Đực");
  const [petAge, setPetAge] = useState<number>(0);
  const [petColor, setPetColor] = useState("");
  const [petDescription, setPetDescription] = useState("");
  const [petWeight, setPetWeight] = useState<number>(0);
  const [petPersonality, setPetPersonality] = useState("");
  const [isVaccinated, setIsVaccinated] = useState(false);
  const [isNeutered, setIsNeutered] = useState(false);
  const [isTrained, setIsTrained] = useState(false);
  const [petLocation, setPetLocation] = useState("");
  const [healthStatus, setHealthStatus] = useState("healthy");

  useEffect(() => {
    const fetchPetData = async () => {
      if (!id) return;

      try {
        setFetchLoading(true);
        const petId = parseInt(id);
        const response = await petService.getPetById(petId);
        const petData = response.data;
        setPetName(petData.petName || "");
        setPetBreed(petData.breedId?.toString() || "1");
        setPetGender(petData.gender || "Đực");
        setPetAge(parseInt(petData.age) || 0); // Convert string age to number
        setPetColor(petData.color || "");
        setPetDescription(petData.description || "");
        setPetWeight(petData.weight || 0);
        setPetPersonality(petData.personality || "");
        setIsVaccinated(petData.isVaccinated || false);
        setIsNeutered(petData.isNeutered || false);
        setIsTrained(petData.isTrained || false);
        setPetLocation(petData.location || "");
        setHealthStatus(petData.healthStatus || "healthy"); // Handle different image field names
        if (petData.primaryImageUrl) {
          setPetImage(petData.primaryImageUrl);
          setOriginalImageUrl(petData.primaryImageUrl);
          setImageChanged(false); // Reset the image changed flag
        } else if (petData.petImageUrls) {
          setPetImage(petData.petImageUrls);
          setOriginalImageUrl(petData.petImageUrls);
          setImageChanged(false); // Reset the image changed flag
        }
      } catch (error: unknown) {
        console.error("Error fetching pet data:", error);

        // Extract more specific error message if available
        const axiosError = error as {
          response?: { data?: { title?: string } };
        };
        const errorMessage =
          axiosError.response?.data?.title || "Vui lòng thử lại sau";

        toast.error("Không thể tải thông tin thú cưng", {
          description: errorMessage,
        });
      } finally {
        setFetchLoading(false);
      }
    };

    fetchPetData();
  }, [id]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInfo.userId || !id) {
      toast.error("Không thể cập nhật thú cưng", {
        description: "Thiếu thông tin cần thiết",
      });
      return;
    }

    setLoading(true);

    try {
      const petId = parseInt(id);
      // Build basic pet data without images first
      const petData = {
        petId: parseInt(id),
        petName,
        breedId: parseInt(petBreed),
        categoryId: parseInt(petBreed) <= 2 ? parseInt(petBreed) : 3,
        gender: petGender,
        age: petAge.toString(),
        ageUnit: "year", // Default to years
        color: petColor,
        description: petDescription || "",
        weight: petWeight,
        size: "medium", // Default size
        personality: petPersonality || "",
        isVaccinated,
        isNeutered,
        isTrained,
        healthStatus: healthStatus || "healthy",
        location: petLocation || "",
        adoptionStatus: "available", // Default status
        foodPreferences: "",
        toyPreferences: "",
        compatibleWith: "",
        notCompatibleWith: "",
        createdByUserId: userInfo.userId,
        additionalImageUrls: [],
        createAdoptionPost: false,
        userId: userInfo.userId,
        purpose: "Show", // Always set purpose to Show for user's own pets
      }; // Include image URL in the payload if available
      if (petImage !== "/placeholder-pet.png") {
        Object.assign(petData, {
          primaryImageUrl: petImage,
          petImageUrls: petImage, // For backward compatibility
        });
      } else {
        Object.assign(petData, {
          primaryImageUrl: "",
          petImageUrls: "",
        });
      }

      // If image was changed and we have an original different from the new one,
      // we should delete the old image after successful update
      const shouldDeleteOldImage =
        imageChanged &&
        originalImageUrl &&
        originalImageUrl !== petImage &&
        originalImageUrl.includes("cloudinary.com");

      await petService.updatePet(petId, petData);

      // After successful update, if we have a new image, clean up the old one
      if (shouldDeleteOldImage) {
        try {
          await cloudinaryService.deleteImage(originalImageUrl);
        } catch (deleteError) {
          console.error("Failed to delete old image:", deleteError);
          // We don't want to interrupt the flow if image deletion fails
        }
      }

      toast.success("Cập nhật thú cưng thành công");
      navigate(ROUTES.PUBLIC.PROFILE);
    } catch (error: unknown) {
      console.error("Error updating pet:", error); // Extract more specific error message if available
      const axiosError = error as {
        response?: { data?: { errors?: { $?: string[] }; title?: string } };
      };
      const errorMessage =
        axiosError.response?.data?.errors?.$?.[0] ||
        axiosError.response?.data?.title ||
        "Đã xảy ra lỗi khi cập nhật thông tin thú cưng";

      toast.error("Không thể cập nhật thú cưng", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  // Clean up new uploaded image if user leaves without saving
  useEffect(() => {
    return () => {
      if (
        newCloudinaryUrl &&
        imageChanged &&
        newCloudinaryUrl !== originalImageUrl
      ) {
        cloudinaryService.deleteImage(newCloudinaryUrl).catch((err) => {
          console.error("Failed to delete unused image:", err);
        });
      }
    };
  }, [newCloudinaryUrl, imageChanged, originalImageUrl]);

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tài khoản", path: ROUTES.PUBLIC.PROFILE },
    { label: "Chỉnh sửa thông tin thú cưng" },
  ];

  if (fetchLoading) {
    return (
      <div className="container mx-auto py-20 flex justify-center items-center">
        <p>Đang tải thông tin thú cưng...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto py-20">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-20 px-20">
            {" "}
            {/* Left side - Pet Photo and Cloudinary Upload */}
            <div className="w-full md:w-1/2">
              <div className="relative h-full mb-6">
                {petImage !== "/placeholder-pet.png" && (
                  <img
                    src={petImage}
                    alt="Ảnh thú cưng"
                    className="w-full h-full rounded-xl object-cover"
                    style={{ maxHeight: "300px", maxWidth: "600px" }}
                  />
                )}
                {petImage === "/placeholder-pet.png" && (
                  <div className="h-[300px] w-full border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                    <span>Chưa có ảnh thú cưng</span>
                  </div>
                )}
              </div>

              {/* Cloudinary upload component */}
              <div className="mb-6">
                <h3 className="text-gray-700 font-medium mb-2">Tải ảnh lên</h3>{" "}
                <CloudinaryUpload
                  onImageUploaded={(url) => {
                    if (url) {
                      setNewCloudinaryUrl(url);
                      setPetImage(url);
                      setImageChanged(true);
                    } else {
                      setPetImage("/placeholder-pet.png");
                      setImageChanged(true);
                    }
                  }}
                  defaultImage={
                    petImage !== "/placeholder-pet.png" ? petImage : undefined
                  }
                />
              </div>
            </div>
            {/* Right side - Form with 2x2 grid layout */}
            <div className="max-w-[750px] md:w-1/2 flex flex-col justify-center items-center">
              {/* Row 2 & 3 - Form fields */}
              <div className="w-full grid grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex items-center h-10">
                  <span className="text-gray-700 font-medium w-24">Tên</span>
                  <Input
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="flex-1 h-10"
                    placeholder="Nhập tên thú cưng"
                    required
                  />
                </div>

                {/* Breed */}
                <div className="flex items-center h-10">
                  <span className="text-gray-700 font-medium w-24">Loài</span>
                  <Select value={petBreed} onValueChange={setPetBreed}>
                    <SelectTrigger className="flex-1 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Chó</SelectItem>
                      <SelectItem value="2">Mèo</SelectItem>
                      <SelectItem value="3">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender */}
                <div className="flex items-center h-10">
                  <span className="text-gray-700 font-medium w-24">
                    Giới tính
                  </span>
                  <Select value={petGender} onValueChange={setPetGender}>
                    <SelectTrigger className="flex-1 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Đực">Đực</SelectItem>
                      <SelectItem value="Cái">Cái</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Age */}
                <div className="flex items-center h-10">
                  <span className="text-gray-700 font-medium w-24">Tuổi</span>
                  <Input
                    type="number"
                    value={petAge}
                    onChange={(e) => setPetAge(parseInt(e.target.value) || 0)}
                    className="flex-1 h-10"
                    placeholder="Nhập tuổi"
                    required
                  />
                </div>

                {/* Color */}
                <div className="flex items-center h-10">
                  <span className="text-gray-700 font-medium w-24">
                    Màu sắc
                  </span>
                  <Input
                    value={petColor}
                    onChange={(e) => setPetColor(e.target.value)}
                    className="flex-1 h-10"
                    placeholder="Nhập màu sắc"
                  />
                </div>

                {/* Weight */}
                <div className="flex items-center h-10">
                  <span className="text-gray-700 font-medium w-24">
                    Cân nặng
                  </span>
                  <Input
                    type="number"
                    value={petWeight}
                    onChange={(e) =>
                      setPetWeight(parseInt(e.target.value) || 0)
                    }
                    className="flex-1 h-10"
                    placeholder="Nhập cân nặng (kg)"
                  />
                </div>

                {/* Location */}
                <div className="flex items-center h-10">
                  <span className="text-gray-700 font-medium w-24">Vị trí</span>
                  <Input
                    value={petLocation}
                    onChange={(e) => setPetLocation(e.target.value)}
                    className="flex-1 h-10"
                    placeholder="Nhập vị trí hiện tại"
                  />
                </div>

                {/* Description */}
                <div className="flex items-start h-24 col-span-2">
                  <span className="text-gray-700 font-medium w-24 mt-2">
                    Mô tả
                  </span>
                  <Textarea
                    value={petDescription}
                    onChange={(e) => setPetDescription(e.target.value)}
                    className="flex-1"
                    placeholder="Mô tả về thú cưng"
                    rows={3}
                  />
                </div>

                {/* Personality */}
                <div className="flex items-center h-10 col-span-2">
                  <span className="text-gray-700 font-medium w-24">
                    Tính cách
                  </span>
                  <Input
                    value={petPersonality}
                    onChange={(e) => setPetPersonality(e.target.value)}
                    className="flex-1 h-10"
                    placeholder="Mô tả tính cách"
                  />
                </div>

                {/* Health Status */}
                <div className="flex items-center h-10 col-span-2">
                  <span className="text-gray-700 font-medium w-24">
                    Sức khỏe
                  </span>
                  <Select value={healthStatus} onValueChange={setHealthStatus}>
                    <SelectTrigger className="flex-1 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="healthy">Khỏe mạnh</SelectItem>
                      <SelectItem value="sick">Cần chăm sóc</SelectItem>
                      <SelectItem value="injured">Bị thương</SelectItem>
                      <SelectItem value="special-needs">
                        Có nhu cầu đặc biệt
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Checkboxes */}
                <div className="col-span-2 grid grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isVaccinated"
                      checked={isVaccinated}
                      onCheckedChange={(checked) => setIsVaccinated(!!checked)}
                    />
                    <Label htmlFor="isVaccinated">Đã tiêm phòng</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isNeutered"
                      checked={isNeutered}
                      onCheckedChange={(checked) => setIsNeutered(!!checked)}
                    />
                    <Label htmlFor="isNeutered">Đã triệt sản</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isTrained"
                      checked={isTrained}
                      onCheckedChange={(checked) => setIsTrained(!!checked)}
                    />
                    <Label htmlFor="isTrained">Đã huấn luyện</Label>
                  </div>
                </div>
              </div>

              {/* Row 4 - Save Button */}
              <div className="mt-10 w-full flex items-center justify-center">
                <Button
                  type="submit"
                  variant="blue"
                  className="py-2"
                  shape="pill"
                  animation="none"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
