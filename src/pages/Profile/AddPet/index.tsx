import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { CloudinaryUpload } from "@/components/CloudinaryUpload";
/// <reference path="@/types/IRedux.d.ts" />
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddPet() {
  const userInfo = useSelector(selectorAuth.userInfo) as IREDUX.UserInfo;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [petImage, setPetImage] = useState("");
  const [newCloudinaryUrl, setNewCloudinaryUrl] = useState("");
  const [petName, setPetName] = useState("");
  const [petBreed, setPetBreed] = useState("1"); // Default to cat
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

  // Handler for CloudinaryUpload component
  const handleImageUploaded = (imageUrl: string) => {
    setPetImage(imageUrl);
    setNewCloudinaryUrl(imageUrl);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userInfo.userId) {
      toast.error("Không thể thêm thú cưng", {
        description: "Không tìm thấy ID người dùng",
      });
      return;
    }

    // Validate required fields
    if (!petName.trim()) {
      toast.error("Vui lòng nhập tên thú cưng");
      return;
    }

    if (!petAge || petAge <= 0) {
      toast.error("Vui lòng nhập tuổi hợp lệ");
      return;
    }

    setLoading(true);

    try {
      // Clean up and validate data before sending to backend
      const cleanedPetData = {
        petName: petName.trim(),
        categoryId: parseInt(petBreed),
        // Use a default breedId of 1 since we don't have breed data
        // TODO: Implement proper breed selection when breed API is available
        breedId: 1,
        gender: petGender,
        age: petAge.toString(),
        ageUnit: "year",
        color: petColor.trim() || "Không xác định",
        description: petDescription.trim() || "Chưa có mô tả",
        weight: petWeight > 0 ? petWeight : 1, // Default to 1kg if not provided
        size: "medium", // Default size
        personality: petPersonality.trim() || "Thân thiện",
        isVaccinated,
        isNeutered,
        isTrained,
        healthStatus: healthStatus || "healthy",
        location: petLocation.trim() || "Không xác định",
        adoptionStatus: "Available",
        foodPreferences: "Không có yêu cầu đặc biệt",
        toyPreferences: "Không có yêu cầu đặc biệt",
        compatibleWith: "Người có kinh nghiệm",
        notCompatibleWith: "Không có",
        createdByUserId: userInfo.userId,
        // Only send image URL if it's not the placeholder
        primaryImageUrl:
          petImage && petImage !== "/placeholder-pet.png" ? petImage : "",
        additionalImageUrls: [],
        createAdoptionPost: false,
        purpose: "Show", // Always set purpose to Show for user's own pets
      };

      console.log("Sending pet data:", cleanedPetData);
      console.log("Selected breed value:", petBreed);
      console.log("Category ID:", parseInt(petBreed));

      await petService.createPet(cleanedPetData);

      toast.success("Thêm thú cưng mới thành công");
      navigate(ROUTES.PUBLIC.PROFILE);
    } catch (error: unknown) {
      console.error("Error creating pet:", error);

      // Extract more specific error message if available
      const axiosError = error as {
        response?: {
          data?: {
            errors?: { $?: string[] };
            title?: string;
            message?: string;
          };
          status?: number;
        };
      };

      let errorMessage = "Đã xảy ra lỗi khi thêm thú cưng mới";

      if (axiosError.response?.data?.errors?.$?.[0]) {
        errorMessage = axiosError.response.data.errors.$[0];
      } else if (axiosError.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      } else if (axiosError.response?.data?.title) {
        errorMessage = axiosError.response.data.title;
      } else if (axiosError.response?.status === 400) {
        errorMessage = "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.";
      } else if (axiosError.response?.status === 500) {
        errorMessage = "Lỗi server. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.";
      }

      toast.error("Không thể thêm thú cưng", {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tài khoản", path: ROUTES.PUBLIC.PROFILE },
    { label: "Thêm thú cưng" },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto py-20">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-20 px-20">
            {/* Left side - Pet Photo */}
            <div className="w-full md:w-1/2 ">
              <div className="w-full mb-6 flex justify-end">
                {" "}
                <CloudinaryUpload
                  onImageUploaded={handleImageUploaded}
                  defaultImage={petImage}
                />
              </div>
              <div className="  items-start flex justify-center">
                <img
                  src={petImage || "/placeholder-pet.png"}
                  alt="Ảnh thú cưng"
                  className="w-full h-full rounded-xl object-cover"
                  style={{ maxHeight: "400px", maxWidth: "700px" }}
                />
                {/* {!petImage && (
                  <div className="absolute inset-0 flex items-center justify-start text-gray-400">
                    <span>Chưa có ảnh thú cưng</span>
                  </div>
                )} */}
              </div>
            </div>

            {/* Right side - Form with 2x2 grid layout */}
            <div className="max-w-[750px] md:w-1/2 flex flex-col justify-center items-center">
              {/* Row 1 - Photo upload */}
              {/* Row 2 & 3 - Form fields */}{" "}
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
                      <SelectItem value="1">Mèo</SelectItem>
                      <SelectItem value="6">Chó</SelectItem>
                      <SelectItem value="7">Khác</SelectItem>
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
                  />{" "}
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
                  shape="default"
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
