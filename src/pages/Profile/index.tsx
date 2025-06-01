"use client";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Camera, Heart } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Card from "@/components/Card/Card";
import ROUTES from "@/constants/routes";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("personal-info");
  const [readyToAdopt, setReadyToAdopt] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingAdoptState, setPendingAdoptState] = useState(false);
  const navigate = useNavigate();

  // Handle switch toggle with confirmation
  const handleToggleAdoptionStatus = (newStatus: boolean) => {
    setPendingAdoptState(newStatus);
    setShowConfirmDialog(true);
  };

  // Handle confirmation dialog result
  const handleConfirmToggle = (confirmed: boolean) => {
    if (confirmed) {
      setReadyToAdopt(pendingAdoptState);
    }
    setShowConfirmDialog(false);
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tài khoản" },
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto py-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10">
          <div className="relative">
            <Avatar className="w-24 h-24 rounded-full  overflow-hidden">
              <AvatarImage
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-cWmsl3NJQaxCzyM5otgH7Sp2EPh3fT.png"
                alt="Siriana Pham"
              />
              <AvatarFallback className="bg-[#C5E2F0] text-[#0053A3] font-medium">
                SP
              </AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="icon"
              className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-1 bg-white border border-gray-200"
            >
              <Camera size={16} className="text-gray-600" />
            </Button>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold">Siriana Pham</h1>
            <p className="text-gray-600 text-sm">
              Người nhận nuôi | Tình nguyện viên
            </p>
          </div>

          {/* Adoption Readiness Toggle - Moved to right side */}
          <div className="flex items-center ml-auto flex-col max-w-xs">
            <div className="flex items-left  gap-2  px-4 py-2 rounded-full ">
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
                checked={readyToAdopt}
                onCheckedChange={handleToggleAdoptionStatus}
                className={`${
                  readyToAdopt ? "bg-[#FF99C0]" : "bg-gray-300"
                } order-2`}
              />
            </div>
            <p className="text-xs text-gray-700">
              Nếu bạn sẵn sàng nhận nuôi thêm thú cưng và muốn chúng tôi liên hệ
              khi có bé phù hợp với bạn.
            </p>
          </div>
        </div>

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
              >
                Xác nhận
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Tabs */}
        <Tabs
          defaultValue="personal-info"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="flex w-full  mb-8 bg-transparent">
            <TabsTrigger
              value="personal-info"
              className={`p-4 text-sm font-medium rounded-none border-0 ${
                activeTab === "personal-info"
                  ? "border-b-1 border-black text-black"
                  : ""
              }`}
            >
              Thông tin cá nhân
            </TabsTrigger>
            <TabsTrigger
              value="my-pets"
              className={` p-4 text-sm font-medium rounded-none border-0 ${
                activeTab === "my-pets"
                  ? "border-b-1 border-black text-black"
                  : ""
              }`}
            >
              Thú cưng của tôi
            </TabsTrigger>
            <TabsTrigger
              value="pet-criteria"
              className={` p-4 text-sm font-medium rounded-none border-0 ${
                activeTab === "pet-criteria"
                  ? "border-b-1 border-black text-black"
                  : ""
              }`}
            >
              Tiểu sử nuôi thú cưng
            </TabsTrigger>
          </TabsList>

          {/* Personal Info Tab */}
          <TabsContent value="personal-info" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Họ và tên
                </Label>
                <Input
                  id="fullname"
                  defaultValue="Phạm Thị Phương Diệp"
                  className="w-full rounded-md "
                />
              </div>
              <div>
                <Label
                  htmlFor="birthdate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ngày tháng năm sinh
                </Label>
                <Input
                  id="birthdate"
                  defaultValue="09/04/2001"
                  className="w-full rounded-md "
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
                  defaultValue="sirianapham@gmail.com"
                  className="w-full rounded-md "
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
                  defaultValue="Sinh viên"
                  className="w-full rounded-md "
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
                    defaultValue="Nữ"
                    className="w-full rounded-md  pr-10"
                    readOnly
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
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  defaultValue="09.xxx.xxx"
                  className="w-full rounded-md "
                />
              </div>
              <div className="md:col-span-2">
                <Label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  defaultValue="58/01, Origami Vinhome GrandPark, Long Bình, Thủ Đức, TP.HCM"
                  className="w-full rounded-md "
                />
              </div>
              <div>
                <Label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Mô tả bản thân
                </Label>
                <Input
                  id="bio"
                  defaultValue="Yêu màu hồng, ghét sự giả dối"
                  className="w-full rounded-md "
                />
              </div>
              <div>
                <Label
                  htmlFor="interests"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Sở thích cá nhân
                </Label>
                <Input
                  id="interests"
                  defaultValue="Ô mai, đọc sách, nấu ăn"
                  className="w-full rounded-md "
                />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Button variant="blue" className="px-10 py-2" animation="none">
                Lưu thay đổi
              </Button>
            </div>
          </TabsContent>

          {/* My Pets Tab */}
          <TabsContent value="my-pets">
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
              <Card
                type="pet"
                image="/placeholder.svg"
                title="Thêm thú cưng mới"
                buttonText="Thêm thú cưng mới"
                onButtonClick={() => navigate(ROUTES.PUBLIC.ADD_PET)}
                className="h-full"
              />
            </div>
          </TabsContent>

          {/* Pet Criteria Tab */}
          <TabsContent value="pet-criteria">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Lịch sử nuôi thú cưng</h2>
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

              <div className=" rounded-xl ">
                <h2 className="text-lg font-medium mb-4">
                  Kỹ năng nuôi thú cưng
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-md font-medium mb-2">
                      Chăm sóc lông mao
                    </h3>
                    <p className="text-sm text-gray-600">
                      Tắm rửa, gỡ lông rụng
                    </p>
                    <Separator className="my-4" />
                  </div>

                  <div>
                    <h3 className="text-md font-medium mb-2">Đặt cún đi dạo</h3>
                    <p className="text-sm text-gray-600">
                      Dắt chó đi dạo hàng ngày
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
