import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
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
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Card from "@/components/Card/Card";
import ROUTES from "@/constants/routes";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import { useSelector, useDispatch } from "react-redux";
import { selectorAuth } from "@/store/modules/auth/selector";
import AvatarUploadDialog from "./AvatarUpload";
import { userService } from "@/services/userService";
import { Input } from "@/components/ui/input";
import { setUserInfo } from "@/store/modules/auth/slice";
import { toast } from "sonner";

export default function ProfilePage() {
  const userInfo: IREDUX.UserInfo = useSelector(selectorAuth.userInfo);
  const [activeTab, setActiveTab] = useState("personal-info");
  const [readyToAdopt, setReadyToAdopt] = useState(userInfo.isReadyToAdopt);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);
  const [pendingAdoptState, setPendingAdoptState] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Form state
  const [formData, setFormData] = useState({
    fullName: userInfo.fullName || "",
    birthDate: userInfo.birthDate || "",
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

  // Initialize current avatar from userInfo
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
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!userInfo.userId) {
      toast.error("Không thể cập nhật thông tin người dùng", {
        description: "Không tìm thấy ID người dùng",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Include userId in the payload as required by the API
      const updateData = {
        ...formData,
        userId: userInfo.userId,
        city: userInfo.city || "",
        district: userInfo.district || "",
        isReadyToAdopt: userInfo.isReadyToAdopt || false,
        profilePicture: currentAvatar || userInfo.profilePicture,
      };

      await userService.updateUserProfile(userInfo.userId, updateData);

      // Update the Redux store with new user info
      dispatch(
        setUserInfo({
          ...userInfo,
          ...formData,
        })
      );

      toast.success("Cập nhật thông tin thành công", {
        description: "Thông tin cá nhân của bạn đã được cập nhật",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Không thể cập nhật thông tin", {
        description: "Đã xảy ra lỗi khi cập nhật thông tin cá nhân",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle switch toggle with confirmation
  const handleToggleAdoptionStatus = async (newStatus: boolean) => {
    setPendingAdoptState(newStatus);
    setShowConfirmDialog(true);
  };
  // Handle confirmation dialog result
  const handleConfirmToggle = async (confirmed: boolean) => {
    if (confirmed && userInfo.userId) {
      setIsLoading(true);
      try {
        const payload = {
          userId: userInfo.userId,
          isReadyToAdopt: pendingAdoptState,
        };

        await userService.updateAvatarProfile(userInfo.userId, payload);
        setReadyToAdopt(pendingAdoptState);

        // Update Redux store
        dispatch(
          setUserInfo({
            ...userInfo,
            isReadyToAdopt: pendingAdoptState,
          })
        );

        toast.success(
          `Đã ${
            pendingAdoptState ? "bật" : "tắt"
          } trạng thái sẵn sàng nhận nuôi`
        );
      } catch (error) {
        console.error("Error updating adoption status:", error);
        toast.error("Không thể cập nhật trạng thái", {
          description:
            "Đã xảy ra lỗi khi cập nhật trạng thái sẵn sàng nhận nuôi",
        });
      } finally {
        setIsLoading(false);
      }
    }
    setShowConfirmDialog(false);
  };

  // Handle avatar update
  const handleAvatarUpdate = async (newAvatarUrl: string) => {
    if (!userInfo.userId) {
      toast.error("Không thể cập nhật ảnh đại diện", {
        description: "Không tìm thấy ID người dùng",
      });
      return;
    }
    setIsLoading(true);
    try {
      const payload = {
        userId: userInfo.userId,
        profilePicture: newAvatarUrl,
      };

      await userService.updateAvatarProfile(userInfo.userId, payload);
      setCurrentAvatar(newAvatarUrl);

      // Update Redux store
      dispatch(
        setUserInfo({
          ...userInfo,
          profilePicture: newAvatarUrl,
        })
      );

      toast.success("Cập nhật ảnh đại diện thành công");
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error("Không thể cập nhật ảnh đại diện", {
        description: "Đã xảy ra lỗi khi cập nhật ảnh đại diện",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tài khoản" },
  ];

  // Function to navigate to adopter verification form
  const handleNavigateToAdopterForm = () => {
    navigate(ROUTES.PUBLIC.VERIFY_ADOPTER);
  };

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
                </Label>{" "}
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
                <p className="text-xs text-gray-700 text-leftfont-bold mt-2">
                  Hãy gửi đơn cho chúng tôi nếu bạn sẵn sàng nhận nuôi thêm thú
                  cưng
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Avatar Upload Dialog */}
        <AvatarUploadDialog
          open={showAvatarDialog}
          onOpenChange={setShowAvatarDialog}
          currentAvatar={currentAvatar || userInfo.profilePicture}
          userName={userInfo.fullName}
          userId={userInfo.userId || 0}
          onAvatarUpdate={handleAvatarUpdate}
        />

        {/* Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Xác nhận thay đổi</DialogTitle>
              <DialogDescription>
                {pendingAdoptState ? (
                  <span>
                    Bạn có muốn đặt trạng thái thành{" "}
                    <strong>Sẵn sàng nhận nuôi</strong> không?
                  </span>
                ) : (
                  <span>
                    Bạn có muốn đặt trạng thái thành{" "}
                    <strong>Chưa sẵn sàng nhận nuôi</strong> không?
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="blue"
                animation="none"
                onClick={() => handleConfirmToggle(false)}
              >
                Hủy
              </Button>
              <Button
                variant="pink"
                animation="none"
                onClick={() => handleConfirmToggle(true)}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Xác nhận"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
                  Họ và tên
                </Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full rounded-md"
                />
              </div>
              <div>
                <Label
                  htmlFor="birthDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ngày tháng năm sinh
                </Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md"
                />
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
                  onChange={handleInputChange}
                  className="w-full rounded-md"
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
                  className="w-full rounded-md"
                />
              </div>
              <div>
                <Label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Giới tính
                </Label>
                <div className="relative">
                  <Input
                    id="gender"
                    value={formData.gender || ""}
                    onChange={handleInputChange}
                    className="w-full rounded-md pr-10"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
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
                  value={formData.phoneNumber || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md"
                />
              </div>{" "}
              <div>
                <Label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md"
                />
              </div>
              <div>
                <Label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Thành phố
                </Label>
                <Input
                  id="city"
                  value={formData.city || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md"
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
                  value={formData.district || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md"
                />
              </div>{" "}
              <div>
                <Label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mô tả bản thân
                </Label>
                <Input
                  id="bio"
                  value={formData.bio || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md"
                />
              </div>
              <div>
                <Label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Giới thiệu thêm
                </Label>
                <Input
                  id="description"
                  value={formData.description || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md"
                />
              </div>
              <div>
                <Label
                  htmlFor="hobby"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sở thích cá nhân
                </Label>
                <Input
                  id="hobby"
                  value={formData.hobby || ""}
                  onChange={handleInputChange}
                  className="w-full rounded-md"
                />
              </div>
            </div>
            <div className="flex justify-center mt-20">
              <Button
                type="submit"
                variant="blue"
                className="w-1/3"
                animation="none"
                shape={"pill"}
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        )}

        {activeTab === "my-pets" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Dog 1 */}
            <Card
              type="pet"
              image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8tzGZPvIid5Qe3xRaobyJwv8n7kYoh.png"
              title="Con Bơ"
              badge="Chó"
              gender="Cái"
              location="1 tuổi"
              className="h-full"
              buttonText="Xem chi tiết"
              onButtonClick={() =>
                navigate(`${ROUTES.PUBLIC.UPDATE_PET.replace(":id", "1")}`)
              }
            />

            {/* Dog 2 */}
            <Card
              type="pet"
              image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8tzGZPvIid5Qe3xRaobyJwv8n7kYoh.png"
              title="Bi"
              badge="Chó"
              gender="Đực"
              location="1 tuổi"
              className="h-full"
              buttonText="Xem chi tiết"
              onButtonClick={() =>
                navigate(`${ROUTES.PUBLIC.UPDATE_PET.replace(":id", "2")}`)
              }
            />

            {/* Add New Pet Card */}
            <div
              className="border-2 border-gray-400 rounded-xl overflow-hidden cursor-pointer h-full flex flex-col"
              onClick={() => navigate(ROUTES.PUBLIC.ADD_PET)}
            >
              <div className=" flex-grow flex items-center justify-center p-8">
                <div className="border-2 border-gray-400 w-16 h-16 rounded-full  flex items-center justify-center shadow-sm">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 5V19M5 12H19"
                      stroke="#6B7280"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "pet-criteria" && (
          <div className="space-y-8">
            <div className="space-y-4">
              <ContentHeader level="h2" title="Lịch sử nuôi thú cưng" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Cat 1 */}
                <Card
                  type="pet"
                  image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iqVxjNK7x1DWOMawOSw9OBgewjcpBG.png"
                  title="Hoàng tử Cát"
                  badge="Mèo"
                  gender="Đực"
                  location="1 tuổi"
                  className="h-full"
                />

                {/* Cat 2 */}
                <Card
                  type="pet"
                  image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iqVxjNK7x1DWOMawOSw9OBgewjcpBG.png"
                  title="Liu"
                  badge="Mèo"
                  gender="Đực"
                  location="1 tuổi"
                  className="h-full"
                />

                {/* Cat 3 */}
                <Card
                  type="pet"
                  image="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iqVxjNK7x1DWOMawOSw9OBgewjcpBG.png"
                  title="Điều"
                  badge="Mèo"
                  gender="Đực"
                  location="1 tuổi"
                  className="h-full"
                />
              </div>
            </div>

            <div className="rounded-xl">
              <ContentHeader title="Kỹ năng nuôi thú cưng" level="h2" />

              <div className="space-y-4 mt-6">
                <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                  <div className="rounded-xl">
                    <h2 className="text-lg font-medium mb-4">
                      Kỹ năng nuôi thú cưng
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-lg text-gray-800 mb-2">
                          Chăm sóc lông mao
                        </h3>
                        <p className="text-sm text-gray-600">
                          Tắm rửa, gỡ lông rụng
                        </p>
                      </div>
                      <Separator className="my-4" />
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                      <div>
                        <h3 className="font-medium text-lg text-gray-800 mb-2">
                          Đặt cún đi dạo
                        </h3>
                        <p className="text-sm text-gray-600">
                          Dắt chó đi dạo hàng ngày
                        </p>
                      </div>
                    </div>

                    <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all">
                      <div>
                        <h3 className="font-medium text-lg text-gray-800 mb-2">
                          Huấn luyện cơ bản
                        </h3>
                        <p className="text-sm text-gray-600">
                          Dạy các lệnh cơ bản như ngồi, nằm, đứng yên, không sủa
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
