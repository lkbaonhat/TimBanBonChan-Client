import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Camera, Heart } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ROUTES from "@/constants/routes";
import { useSelector, useDispatch } from "react-redux";
import { selectorAuth } from "@/store/modules/auth/selector";
import AvatarUploadDialog from "./AvatarUpload";
import { userService } from "@/services/userService";
import { Input } from "@/components/ui/input";
import { setUserInfo } from "@/store/modules/auth/slice";
import { toast } from "sonner";
// Import the extracted components
import { MyPets, PetCareHistory } from "./components";

export default function ProfilePage() {
  const userInfo: IRedux.UserInfo = useSelector(selectorAuth.userInfo);
  const [activeTab, setActiveTab] = useState("personal-info");
  const [readyToAdopt, setReadyToAdopt] = useState(userInfo.isReadyToAdopt);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [pendingAdoptState, setPendingAdoptState] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Format dd/mm/yyyy to yyyy-mm-dd for date input
  const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return "";

    // Check if the date is already in yyyy-mm-dd format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }

    // Check if the date is in dd/mm/yyyy format
    const ddmmyyyyRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateString.match(ddmmyyyyRegex);

    if (match) {
      const [, day, month, year] = match;
      return `${year}-${month}-${day}`;
    }

    console.warn("Unsupported date format:", dateString);
    return "";
  };

  // Form state
  const [formData, setFormData] = useState({
    fullName: userInfo.fullName || "",
    birthDate: formatDateForInput(userInfo.birthDate) || "",
    email: userInfo.email || "",
    occupation: userInfo.occupation || "",
    gender: userInfo.gender || "",
    phoneNumber: userInfo.phoneNumber || "",
    address: userInfo.address || "",
    city: userInfo.city || "",
    district: userInfo.district || "",
    bio: userInfo.bio || "",
    hobby: userInfo.hobby || "",
    description: userInfo.description || "",
  });

  // Initialize current avatar
  useEffect(() => {
    if (userInfo.profilePicture) {
      setCurrentAvatar(userInfo.profilePicture);
    }
  }, [userInfo.profilePicture]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  // Handle textarea change
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }; // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Validate required fields
    const newErrors: { [key: string]: string } = {};
    let hasErrors = false;

    // Validate fullName (required field)
    if (!formData.fullName) {
      newErrors.fullName = "Họ và tên là bắt buộc";
      hasErrors = true;
    } // Validate birthDate (optional field, but must be in correct format if provided)
    if (formData.birthDate) {
      // Validate date format (should be YYYY-MM-DD from the date input)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.birthDate)) {
        newErrors.birthDate = "Định dạng ngày không hợp lệ";
        hasErrors = true;
        console.error("Invalid date format:", formData.birthDate);
      }
    }

    if (hasErrors) {
      setErrors(newErrors);
      setIsLoading(false);
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    try {
      // Handle date format or null value for .NET DateOnly compatibility
      console.log("Original date input:", formData.birthDate);

      // Create updated form data with userId and handle empty birthDate
      const updatedFormData = {
        ...formData,
        userId: userInfo.userId, // Đảm bảo userId nằm trong payload
        // Convert empty birthDate to null
        birthDate: formData.birthDate || null,
      };
      console.log("Updating user profile with ID:", userInfo.userId);
      console.log("Form data to be sent:", updatedFormData); // Send the updated form data directly
      console.log("Final payload:", updatedFormData);

      // userService.updateUserProfile expects userId as the first parameter
      const response = await userService.updateUserProfile(
        userInfo.userId || 0,
        updatedFormData
      );
      console.log("Profile update response:", response);

      // Update Redux store (note: keep original date format in Redux for input compatibility)
      dispatch(
        setUserInfo({
          ...userInfo,
          ...formData,
        })
      );

      // Clear any errors
      setErrors({});
      toast.success("Cập nhật thông tin thành công");
    } catch (error: unknown) {
      console.error("Error updating profile:", error);

      // Xử lý lỗi theo kiểu AxiosError
      const err = error as {
        message?: string;
        response?: { data?: unknown; status?: number };
      };
      console.error("Error details:", {
        message: err?.message,
        response: err?.response?.data,
        status: err?.response?.status,
      });

      toast.error("Không thể cập nhật thông tin", {
        description: "Đã xảy ra lỗi khi cập nhật thông tin cá nhân",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle adoption status
  const handleToggleAdoptionStatus = async (checked: boolean) => {
    // If we're already processing a request, don't allow another one
    if (pendingAdoptState) return;

    setPendingAdoptState(true);
    setShowConfirmDialog(false);

    if (checked) {
      // If turning on, just update the state
      setReadyToAdopt(true);
      try {
        await userService.updateAdopterStatus(userInfo.userId || 0, true);
        dispatch(
          setUserInfo({
            ...userInfo,
            isReadyToAdopt: true,
          })
        );
        toast.success("Bạn đã sẵn sàng nhận nuôi thú cưng");
      } catch (error) {
        console.error("Error updating adopter status:", error);
        setReadyToAdopt(false); // Revert on error
        toast.error("Không thể cập nhật trạng thái");
      }
    } else {
      // If turning off, show confirmation
      setShowConfirmDialog(true);
    }

    setPendingAdoptState(false);
  };

  // Confirm turning off adoption status
  const handleConfirmDisableAdopt = async () => {
    setPendingAdoptState(true);
    setShowConfirmDialog(false);
    try {
      await userService.updateAdopterStatus(userInfo.userId || 0, false);
      setReadyToAdopt(false);
      dispatch(
        setUserInfo({
          ...userInfo,
          isReadyToAdopt: false,
        })
      );
      toast.success("Đã cập nhật trạng thái");
    } catch (error) {
      console.error("Error updating adopter status:", error);
      toast.error("Không thể cập nhật trạng thái");
    } finally {
      setPendingAdoptState(false);
    }
  };

  // Update avatar
  const handleAvatarUploaded = async (avatarUrl: string) => {
    try {
      // Update avatar in the backend
      await userService.updateAvatarProfile(userInfo.userId || 0, {
        userId: userInfo.userId, // Đảm bảo userId nằm trong payload
        profilePicture: avatarUrl,
      });

      // Update locally
      setCurrentAvatar(avatarUrl);

      // Update in Redux
      dispatch(
        setUserInfo({
          ...userInfo,
          profilePicture: avatarUrl,
        })
      );

      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Không thể cập nhật ảnh đại diện");
    }
  };

  // Handle navigating to adopter form
  const handleNavigateToAdopterForm = () => {
    navigate(ROUTES.PUBLIC.VERIFY_ADOPTER);
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tài khoản" },
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto py-6 pb-20">
        {/* Profile header */}
        <div className="relative flex items-center mb-10">
          <div className="relative">
            <Avatar className="h-24 w-24 border-2 border-gray-100 rounded-full shadow-sm">
              <AvatarImage
                src={currentAvatar || userInfo.profilePicture}
                alt={userInfo.fullName}
              />
              <AvatarFallback className="bg-[#C5E2F0] text-[#0053A3] font-medium">
                {userInfo?.fullName
                  ?.split(" ")
                  .pop()
                  ?.charAt(0)
                  .toUpperCase() ||
                  userInfo?.fullName?.charAt(0).toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-1 bg-white border border-gray-200 hover:bg-gray-50"
              onClick={() => setShowAvatarDialog(true)}
            >
              <Camera size={16} className="text-gray-600" />
            </Button>
          </div>

          <div className="ml-6 flex-1">
            <h1 className="font-bold text-2xl md:text-3xl text-gray-800">
              {userInfo?.fullName || "User"}
            </h1>
            <div className="flex gap-2">
              <span className="text-gray-600 text-sm font-medium">
                Người nhận nuôi | Tình nguyện viên
              </span>
            </div>
          </div>

          {/* Conditional rendering based on verification status */}
          <div className="flex flex-col items-end max-w-xs">
            {userInfo.isVerifiedAdopter ? (
              // Show adoption toggle for verified adopters
              <div className="flex items-center gap-2 py-2">
                <Label
                  htmlFor="ready-to-adopt"
                  className="text-sm cursor-pointer order-1"
                >
                  <span className="flex items-center gap-1">
                    <Heart
                      size={14}
                      className={`${
                        readyToAdopt
                          ? "text-[#FF99C0] fill-[#FF99C0]"
                          : "text-gray-400"
                      }`}
                    />
                    <span className="text-gray-700">
                      {readyToAdopt
                        ? "Sẵn sàng nhận nuôi"
                        : "Chưa sẵn sàng nhận nuôi"}
                    </span>
                  </span>
                </Label>
                <Switch
                  checked={readyToAdopt || false}
                  onCheckedChange={handleToggleAdoptionStatus}
                  className={`${
                    readyToAdopt ? "bg-[#FF99C0]" : "bg-gray-300"
                  } order-2`}
                />
                <p className="text-xs text-gray-700 text-right mt-2 font-bold">
                  Bật nếu bạn sẵn sàng nhận nuôi thêm thú cưng
                </p>
              </div>
            ) : (
              <div>
                <Button
                  variant="pink"
                  onClick={handleNavigateToAdopterForm}
                  animation={"none"}
                >
                  Đăng ký nhận nuôi
                </Button>
                <p className="text-xs text-gray-700 text-left font-bold mt-2">
                  Hãy gửi đơn cho chúng tôi nếu bạn sẵn sàng nhận nuôi thêm thú
                  cưng
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Disable adoption dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xác nhận tắt trạng thái sẵn sàng</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn tắt trạng thái sẵn sàng nhận nuôi? Bạn sẽ
                không xuất hiện trong danh sách người có thể nhận nuôi.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowConfirmDialog(false);
                  setReadyToAdopt(true); // Revert switch state
                }}
              >
                Hủy
              </Button>
              <Button onClick={handleConfirmDisableAdopt}>Xác nhận</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Avatar dialog */}
        <AvatarUploadDialog
          open={showAvatarDialog}
          onOpenChange={setShowAvatarDialog}
          onAvatarUpdate={handleAvatarUploaded}
          currentAvatar={currentAvatar}
          userName={userInfo.fullName}
          userId={userInfo.userId}
        />
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            className={`py-4 px-6 text-base font-medium border-b-2 ${
              activeTab === "personal-info"
                ? "border-gray-700 text-gray-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            } transition-colors`}
            onClick={() => setActiveTab("personal-info")}
          >
            Thông tin cá nhân
          </button>
          <button
            className={`py-4 px-6 text-base font-medium border-b-2 ${
              activeTab === "my-pets"
                ? "border-gray-700 text-gray-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            } transition-colors`}
            onClick={() => setActiveTab("my-pets")}
          >
            Thú cưng của tôi
          </button>
          <button
            className={`py-4 px-6 text-base font-medium border-b-2 ${
              activeTab === "pet-criteria"
                ? "border-gray-700 text-gray-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            } transition-colors`}
            onClick={() => setActiveTab("pet-criteria")}
          >
            Tiểu sử nuôi thú cưng
          </button>
        </div>
        {/* Tab Content */}
        {activeTab === "personal-info" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info Tab Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => {
                    handleInputChange(e);
                    // Clear error when user enters a value
                    if (e.target.value) {
                      setErrors((prev) => ({ ...prev, fullName: "" }));
                    }
                  }}
                  className={`mt-1 ${errors.fullName ? "border-red-500" : ""}`}
                  placeholder="Nhập họ và tên"
                />
                {errors.fullName && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.fullName}
                  </span>
                )}
              </div>
              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled={true}
                  className="mt-1 bg-gray-50"
                  placeholder="name@example.com"
                />
              </div>
              <div>
                <Label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ngày sinh
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => {
                    handleInputChange(e);
                    // Clear error when user enters a value
                    if (e.target.value) {
                      setErrors((prev) => ({ ...prev, birthDate: "" }));

                      // Log selected date for debugging
                      console.log("Date selected:", e.target.value);

                      // Parse date parts to verify format
                      const parts = e.target.value.split("-");
                      if (parts.length === 3) {
                        console.log(
                          `Date parts: Year=${parts[0]}, Month=${parts[1]}, Day=${parts[2]}`
                        );
                      }
                    }
                  }}
                  className={`mt-1 ${errors.birthDate ? "border-red-500" : ""}`}
                />
                {errors.birthDate && (
                  <span className="text-red-500 text-xs mt-1">
                    {errors.birthDate}
                  </span>
                )}
                <span className="text-xs text-gray-500 mt-1 block">
                  Định dạng: dd/mm/yyyy
                </span>
              </div>
              <div>
                <Label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Giới tính
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, gender: val }))
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số điện thoại
                </Label>
                <Input
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <Label
                  htmlFor="occupation"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nghề nghiệp
                </Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Nhập nghề nghiệp"
                />
              </div>
              <div>
                <Label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Địa chỉ"
                />
              </div>
              <div>
                <Label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tỉnh/Thành phố
                </Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Tỉnh/Thành phố"
                />
              </div>
              <div>
                <Label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quận/Huyện
                </Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Quận/Huyện"
                />
              </div>
              <div className="md:col-span-2">
                <Label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tiểu sử
                </Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={handleTextareaChange}
                  rows={4}
                  className="mt-1"
                  placeholder="Một số thông tin về bạn"
                />
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <Button
                variant="blue"
                size="lg"
                animation={"none"}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu..." : "Lưu thông tin"}
              </Button>
            </div>
          </form>
        )}
        {activeTab === "my-pets" && (
          <MyPets userId={userInfo.userId as number} />
        )}
        {activeTab === "pet-criteria" && (
          <PetCareHistory userId={userInfo.userId as number} />
        )}
      </div>
    </div>
  );
}
