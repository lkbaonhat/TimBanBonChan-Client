"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Họ và tên là bắt buộc" }),
  dateOfBirth: z.string(),
  gender: z.string(),
  email: z.string().email({ message: "Email không hợp lệ" }),
  phone: z.string().min(10, { message: "Số điện thoại không hợp lệ" }),
  occupation: z.string(),
  address: z.string(),
  experience: z.string(),
  skills: z.string(),
  rolePreference: z.string(),
  timeCommitment: z.string(),
  additionalInfo: z.string(),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản",
  }),
});

export default function VolunteerPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      gender: "Nam",
      email: "",
      phone: "",
      occupation: "",
      address: "",
      experience: "",
      skills: "",
      rolePreference: "",
      timeCommitment: "",
      additionalInfo: "",
      termsAgreed: false,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    // Handle form submission
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Cộng đồng", path: "/community" },
    { label: "Tình nguyện viên", path: "/volunteer" },
    { label: "Đăng ký" },
  ];

  return (
    <div className="min-h-screen pb-10">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Main content */}
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-2xl font-bold mb-6">
          Đăng ký làm tình nguyện viên
        </h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Personal Information */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-2">Thông tin cá nhân</h2>
            <p className="text-sm text-gray-500 mb-4">
              Sử dụng thông tin tài khoản của bạn
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  type="date"
                  placeholder="DD/MM/YYYY"
                  {...register("dateOfBirth")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Giới tính</Label>
                <Select defaultValue="Nam">
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Chọn giới tính" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nam">Nam</SelectItem>
                    <SelectItem value="Nữ">Nữ</SelectItem>
                    <SelectItem value="Khác">Khác</SelectItem>
                  </SelectContent>
                </Select>
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
                <Label htmlFor="occupation">Nghề nghiệp</Label>
                <Input
                  id="occupation"
                  placeholder="Sinh viên"
                  {...register("occupation")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  placeholder="Vd: 0901234567"
                  {...register("phone")}
                />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                placeholder="Vd: Số 01, Đường Võ Văn Ngân, Phường Linh Trung, Thủ Đức, TP.HCM"
                {...register("address")}
              />
            </div>
          </div>

          {/* Experience and Skills */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Kinh nghiệm và Kỹ năng</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="experience">
                  Bạn có sở hữu kinh nghiệm làm việc với chúng mình chưa?
                </Label>
                <Textarea
                  id="experience"
                  placeholder="Mô tả kinh nghiệm của bạn (nếu có) với chúng mình (nếu có)"
                  className="min-h-[100px]"
                  {...register("experience")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">
                  Bạn đã từng tham gia tình nguyện chưa?
                </Label>
                <Textarea
                  id="skills"
                  placeholder="Mô tả kinh nghiệm của bạn (nếu có) với các tổ chức khác (nếu có)"
                  className="min-h-[100px]"
                  {...register("skills")}
                />
              </div>
            </div>
          </div>

          {/* Role Preferences */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Vai trò mong muốn</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="rolePreference">
                  Bạn muốn tham gia ở vai trò?
                </Label>
                <Select>
                  <SelectTrigger id="rolePreference" className="w-full">
                    <SelectValue placeholder="Tình nguyện viên trực tiếp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">
                      Tình nguyện viên trực tiếp
                    </SelectItem>
                    <SelectItem value="remote">
                      Tình nguyện viên từ xa
                    </SelectItem>
                    <SelectItem value="event">
                      Tình nguyện viên sự kiện
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeCommitment">
                  Cho chúng tôi nghĩa về giờ làm việc của bạn nhé
                </Label>
                <Select>
                  <SelectTrigger id="timeCommitment" className="w-full">
                    <SelectValue placeholder="Thứ 2, Chủ nhật" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekdays">Thứ 2 - Thứ 6</SelectItem>
                    <SelectItem value="weekends">Thứ 7, Chủ nhật</SelectItem>
                    <SelectItem value="flexible">Linh hoạt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="additionalInfo">
                Bạn có thể chia sẻ lý do bạn muốn trở thành tình nguyện viên
                không?
              </Label>
              <Textarea
                id="additionalInfo"
                placeholder="Mô tả lý do bạn muốn tham gia (nếu có) với chúng mình (nếu có)"
                className="min-h-[100px]"
                {...register("additionalInfo")}
              />
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4">Điều khoản và Cam kết</h2>

            <div className=" p-6 rounded-lg  mb-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left side - Commitment list */}
              <div>
                <ol className="list-decimal pl-6 space-y-2 text-sm">
                  <li>
                    Tôi cam kết tuân thủ các nguyên tắc của tình nguyện viên
                  </li>
                  <li>
                    Tôi đồng ý để tổ chức lưu trữ và sử dụng thông tin hoặc hình
                    ảnh
                  </li>
                  <li>
                    Tôi đồng ý tự chịu sự cố xảy ra trong quá trình hoạt động
                    ngoài quyền hạn của tổ chức
                  </li>
                </ol>
              </div>

              {/* Right side - Title and Read more */}
              <div>
                <div className="flex items-start gap-2 mb-4">
                  <div className="flex-shrink-0 mt-1">
                    <Heart
                      className="h-5 w-5 text-[#FF99C0]"
                      fill="currentColor"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Nguyên tắc và điều khoản khi tham gia tình nguyện viên của
                      "Tìm bạn bốn chân"
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      <a href="#" className="text-[#0053A3] hover:underline">
                        Đọc thêm
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="termsAgreed"
                {...register("termsAgreed")}
                className="data-[state=checked]:bg-[#0053A3] data-[state=checked]:border-[#0053A3]"
              />
              <Label htmlFor="termsAgreed" className="text-sm">
                Tôi xác nhận đã đọc và đồng ý với tất cả điều khoản trên
              </Label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" variant="blue">
              Gửi đơn đăng ký tình nguyện viên
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
