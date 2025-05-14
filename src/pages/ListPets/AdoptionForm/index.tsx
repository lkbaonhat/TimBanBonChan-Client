"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ContentHeader from "@/components/ContentHeader/ContentHeader";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Họ và tên là bắt buộc" }),
  dateOfBirth: z.string(),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string(),
  address: z.string(),
  livingArrangement: z.string(),
  hasOtherPets: z.enum(["Có", "Không"]),
  hasPreviousPets: z.enum(["Rồi", "Chưa"]),
  previousExperience: z.string().optional(),
  petCareKnowledge: z.string().optional(),
  additionalInfo: z.string().optional(),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản",
  }),
});

export default function AdoptionForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      address: "",
      livingArrangement: "Chung cư",
      hasOtherPets: "Không",
      hasPreviousPets: "Chưa",
      previousExperience: "",
      petCareKnowledge: "",
      additionalInfo: "",
      termsAgreed: false,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission
  };

  // Define breadcrumb items for the Breadcrumb component
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Làm quen với các bé", path: "/pets" },
    { label: "Danny", path: "/pets/danny" },
    { label: "Thủ tục nhận nuôi" },
  ];

  return (
    <div className="min-h-screen pb-10">
      {/* Use Breadcrumb component */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-6">
        <ContentHeader title="Thủ tục nhận nuôi" level="h1" />

        {/* Pet Profile */}
        <div className="flex items-center gap-4 mb-8">
          <Avatar className="h-20 w-20 border-2 border-white">
            <AvatarImage
              src="/placeholder.svg?height=80&width=80"
              alt="Danny"
            />
            <AvatarFallback>DN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">Danny</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Chó | Trưởng thành | Đực</p>
              <p>Đã tiêm phòng | Thân thiện</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Adopter Information */}
          <div className="mb-8">
            <ContentHeader title="Thông tin người nhận nuôi" level="h2" />
            <p className="text-sm text-gray-500 mb-4">
              Sử dụng thông tin tài khoản của bạn
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  placeholder="Vd: Nguyễn Văn A"
                  {...register("fullName")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Ngày tháng năm sinh</Label>
                <Input
                  id="dateOfBirth"
                  placeholder="26/04/2000"
                  {...register("dateOfBirth")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Vd: nguyenvana@gmail.com"
                  {...register("email")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  placeholder="Vd: 09x xxx xxxx"
                  {...register("phone")}
                />
              </div>
            </div>
          </div>

          {/* New Home Information */}
          <div className="mb-8">
            <ContentHeader title="Thông tin nhà mới của bé" level="h2" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  placeholder="Vd: Số 02, Đường Thái Phiên, Bình Hòa, Nhà Trang"
                  {...register("address")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="livingArrangement">Loại nhà</Label>
                <Select defaultValue="Chung cư">
                  <SelectTrigger id="livingArrangement" size="sm">
                    <SelectValue placeholder="Chọn loại nhà" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Chung cư">Chung cư</SelectItem>
                    <SelectItem value="Nhà riêng">Nhà riêng</SelectItem>
                    <SelectItem value="Biệt thự">Biệt thự</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6">
              <Label className="mb-2 block">
                Nhà bạn hiện tại có sẵn vật/thú cưng nào không?
              </Label>
              <RadioGroup defaultValue="Không" className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Có"
                    id="hasPets-yes"
                    {...register("hasOtherPets")}
                  />
                  <Label htmlFor="hasPets-yes">Có</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Không"
                    id="hasPets-no"
                    {...register("hasOtherPets")}
                  />
                  <Label htmlFor="hasPets-no">Không</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Pet Care Experience */}
          <div className="mb-8">
            <ContentHeader title="Kinh nghiệm nuôi thú cưng" level="h2" />

            <div className="mb-4">
              <Label className="mb-2 block">
                Bạn từng nuôi thú cưng trước đây chưa?
              </Label>
              <RadioGroup defaultValue="Chưa" className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Rồi"
                    id="experience-yes"
                    {...register("hasPreviousPets")}
                  />
                  <Label htmlFor="experience-yes">Rồi</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="Chưa"
                    id="experience-no"
                    {...register("hasPreviousPets")}
                  />
                  <Label htmlFor="experience-no">Chưa</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="previousExperience">
                  Bạn có đang nuôi thú cưng không?
                </Label>
                <Textarea
                  id="previousExperience"
                  placeholder="Nếu có, bạn vui lòng mô tả (có ai giúp chăm mình không...)"
                  className="min-h-[100px]"
                  {...register("previousExperience")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="petCareKnowledge">
                  Bạn đã chuẩn bị hay có kiến thức gì về việc giúp nuôi chúa?
                </Label>
                <Textarea
                  id="petCareKnowledge"
                  placeholder="Nếu có, bạn vui lòng mô tả (có ai giúp chăm mình không...)"
                  className="min-h-[100px]"
                  {...register("petCareKnowledge")}
                />
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <Label htmlFor="additionalInfo">
                Bạn có thể chia sẻ lý do bạn muốn nuôi bé không?
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="Nếu có, bạn vui lòng mô tả (có ai giúp chăm mình không...)"
                className="min-h-[100px]"
                {...register("additionalInfo")}
              />
            </div>

            <div className="rounded-md  mb-4">
              <p className="text-sm mb-2">
                Khi đến nay được gửi đi, cũng đồng là gửi thêm vào đi cùng bạn
                có thể nuôi, những vấn đề buộc khi đến sẽ có nhà.
              </p>
            </div>
          </div>

          {/* Commitment */}
          <div className="mb-8">
            <ContentHeader title="Cam kết chăm sóc thú cưng" level="h2" />

            <div className="p-6 rounded-lg  mb-4">
              <p className="text-sm mb-3">Khi quá đơn này tôi cam kết:</p>
              <ol className="list-decimal pl-6 space-y-2 text-sm">
                <li>Chăm sóc đúng cách, đảm bảo dinh dưỡng và khỏe đời y tế</li>
                <li>
                  Tạo môi trường thoáng an toàn và yêu thương cho thú cưng
                </li>
                <li>
                  Không để bé hoặc đau thú cưng cho người khác mà không thông
                  báo
                </li>
                <li>
                  Chấp nhận và học các quy tắc thăm kiểm tra từ tổ chức trạm cứu
                  hộ
                </li>
              </ol>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox id="termsAgreed" {...register("termsAgreed")} />
              <Label htmlFor="termsAgreed" className="text-sm">
                Tôi xác nhận đã đọc và đồng ý với tất cả điều khoản nhận nuôi
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              variant="blue"
              shape="default"
              animation="none"
            >
              Hoàn tất và gửi đơn nhận nuôi
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
