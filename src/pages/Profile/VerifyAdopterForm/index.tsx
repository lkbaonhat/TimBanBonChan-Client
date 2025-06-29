import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Heart } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";

import { userService } from "@/services/userService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectorAuth } from "@/store/modules/auth/selector";

// Cập nhật schema để phù hợp với API payload
const formSchema = z.object({
  fullName: z.string().min(2, {
    message: "Họ và tên phải có ít nhất 2 ký tự.",
  }),
  email: z.string().email({
    message: "Email không hợp lệ.",
  }),
  phoneNumber: z.string().min(10, {
    message: "Số điện thoại phải có ít nhất 10 số.",
  }),
  address: z.string().min(1, {
    message: "Địa chỉ là bắt buộc.",
  }),
  city: z.string().min(1, {
    message: "Thành phố là bắt buộc.",
  }),
  district: z.string().min(1, {
    message: "Quận/Huyện là bắt buộc.",
  }),
  idCardNumber: z.string().min(9, {
    message: "Số CCCD/CMND không hợp lệ.",
  }),
  occupation: z.string().min(1, {
    message: "Nghề nghiệp là bắt buộc.",
  }),
  income: z.string().min(1, {
    message: "Thu nhập là bắt buộc.",
  }),
  livingConditions: z.string().min(10, {
    message: "Điều kiện sống phải có ít nhất 10 ký tự.",
  }),
  housingType: z.string({
    required_error: "Vui lòng chọn loại hình nhà ở.",
  }),
  hasExperience: z.boolean(),
  previousExperience: z.string().optional(),
  otherPets: z.string().optional(),
  familySupport: z.string().min(10, {
    message: "Vui lòng mô tả chi tiết về sự đồng thuận của gia đình.",
  }),
  workSchedule: z.string().min(5, {
    message: "Vui lòng mô tả lịch làm việc của bạn.",
  }),
  reasonForAdoption: z.string().min(10, {
    message: "Vui lòng nêu lý do bạn muốn nhận nuôi thú cưng.",
  }),
  preferredPetTypes: z.string().min(1, {
    message: "Vui lòng cho biết loại thú cưng bạn muốn nhận nuôi.",
  }),
  idCardFrontImageUrl: z.string().min(1, {
    message: "Vui lòng tải lên ảnh mặt trước CCCD/CMND.",
  }),
  idCardBackImageUrl: z.string().min(1, {
    message: "Vui lòng tải lên ảnh mặt sau CCCD/CMND.",
  }),
  termsAgreed: z.boolean().refine((value) => value === true, {
    message: "Bạn phải đồng ý với điều khoản và điều kiện.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function AdopterVerificationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userInfo: IREDUX.UserInfo = useSelector(selectorAuth.userInfo);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: userInfo?.fullName || "",
      email: userInfo?.email || "",
      phoneNumber: userInfo?.phoneNumber || "",
      address: "",
      city: "",
      district: "",
      idCardNumber: "",
      occupation: "",
      income: "",
      livingConditions: "",
      housingType: "",
      hasExperience: false,
      previousExperience: "",
      otherPets: "",
      familySupport: "",
      workSchedule: "",
      reasonForAdoption: "",
      preferredPetTypes: "",
      idCardFrontImageUrl: "",
      idCardBackImageUrl: "",
      termsAgreed: false,
    },
  });

  async function onSubmit(values: FormData) {
    try {
      setIsSubmitting(true);

      // Chuẩn bị dữ liệu để gửi đến API
      const submitData = {
        userId: userInfo?.userId || 0,
        fullName: values.fullName,
        email: values.email,
        phoneNumber: values.phoneNumber,
        address: values.address,
        city: values.city,
        district: values.district,
        idCardNumber: values.idCardNumber,
        occupation: values.occupation,
        income: values.income,
        livingConditions: values.livingConditions,
        housingType: values.housingType,
        hasExperience: values.hasExperience,
        previousExperience: values.previousExperience || "",
        otherPets: values.otherPets || "",
        familySupport: values.familySupport,
        workSchedule: values.workSchedule,
        reasonForAdoption: values.reasonForAdoption,
        preferredPetTypes: values.preferredPetTypes,
        createdDate: new Date().toISOString(), // Sử dụng thời gian hiện tại
        idCardFrontImageUrl: values.idCardFrontImageUrl,
        idCardBackImageUrl: values.idCardBackImageUrl,
      };

      try {
        const response = await userService.createAdopterApplication(submitData);
        toast.success("Đơn đăng ký nhận nuôi đã được gửi thành công!");
        form.reset();
      } catch (apiError: any) {
        console.error("API Error Details:", {
          status: apiError?.response?.status,
          data: apiError?.response?.data,
          message: apiError?.message,
          stack: apiError?.stack,
        });

        throw apiError;
      }
    } catch (error: unknown) {
      console.error("Failed to submit adopter application:", error);

      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        (error as Error)?.message ||
        "Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng thử lại.";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Modified handlers to work with either prop name
  const handleCCCDFrontUpload = (url: string) => {
    form.setValue("idCardFrontImageUrl", url);
  };

  const handleCCCDBackUpload = (url: string) => {
    form.setValue("idCardBackImageUrl", url);
  };

  // Create adapter components that handle the prop name discrepancy
  const CloudinaryUploadAdapter = ({ onImageUploaded, previewUrl }) => {
    return (
      <CloudinaryUpload
        onUploadSuccess={onImageUploaded}
        onImageUploaded={onImageUploaded}
        previewUrl={previewUrl}
      />
    );
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Đăng ký nhận nuôi", path: "/verify-adopter" },
  ];

  return (
    <div className="min-h-screen pb-10">
      <Breadcrumb items={breadcrumbItems} />
      <div className="container mx-auto ">
        <ContentHeader title="Đăng ký trở thành người nhận nuôi" level="h1" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8  mx-auto"
          >
            {/* Thông tin cá nhân */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Thông tin cá nhân
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Vui lòng điền đầy đủ thông tin cá nhân của bạn
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập họ và tên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số điện thoại</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số điện thoại" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="occupation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nghề nghiệp</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập nghề nghiệp" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="income"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thu nhập</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập thu nhập" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idCardNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số CCCD/CMND</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập số CCCD/CMND" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Địa chỉ */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập địa chỉ" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thành phố</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập thành phố" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quận/Huyện</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập quận/huyện" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Loại hình nhà ở */}
              <FormField
                control={form.control}
                name="housingType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại hình nhà ở</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại hình nhà ở" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="apartment">
                          Căn hộ/Chung cư
                        </SelectItem>
                        <SelectItem value="house">Nhà riêng</SelectItem>
                        <SelectItem value="villa">Biệt thự</SelectItem>
                        <SelectItem value="other">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Điều kiện sống */}
              <FormField
                control={form.control}
                name="livingConditions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điều kiện sống</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả chi tiết về điều kiện sống của bạn..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Vui lòng mô tả chi tiết về môi trường sống, không gian và
                      điều kiện cho thú cưng.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Kinh nghiệm nuôi thú cưng */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-2">
                Kinh nghiệm nuôi thú cưng
              </h2>

              <FormField
                control={form.control}
                name="hasExperience"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#0053A3] data-[state=checked]:border-[#0053A3]"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Tôi đã có kinh nghiệm nuôi thú cưng trước đây
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("hasExperience") && (
                <FormField
                  control={form.control}
                  name="previousExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kinh nghiệm trước đây</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả về kinh nghiệm nuôi thú cưng trước đây..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="otherPets"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thú cưng hiện tại</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nếu bạn đang nuôi thú cưng, vui lòng liệt kê số lượng và loại thú..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Để trống nếu bạn không nuôi thú cưng nào khác.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="familySupport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sự đồng thuận của gia đình</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả về sự đồng thuận của gia đình với việc nhận nuôi..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="workSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lịch làm việc</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Mô tả lịch làm việc của bạn và thời gian có thể dành cho thú cưng..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thông tin về nhu cầu nhận nuôi */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-2">
                Thông tin về nhu cầu nhận nuôi
              </h2>

              <FormField
                control={form.control}
                name="reasonForAdoption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lý do muốn nhận nuôi</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nêu lý do bạn muốn nhận nuôi thú cưng..."
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preferredPetTypes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại thú cưng mong muốn</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: Chó, Mèo, ..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Thông tin CMND/CCCD */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-2">Xác minh danh tính</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Vui lòng tải lên hình ảnh CCCD/CMND để xác minh danh tính của
                bạn
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="idCardFrontImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ảnh mặt trước CCCD/CMND *</FormLabel>
                      <FormControl>
                        <div className="border rounded-md p-4 min-h-[180px]">
                          <CloudinaryUpload
                            onImageUploaded={handleCCCDFrontUpload}
                            defaultImage={field.value}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="idCardBackImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ảnh mặt sau CCCD/CMND *</FormLabel>
                      <FormControl>
                        <div className="border rounded-md p-4 min-h-[180px]">
                          <CloudinaryUpload
                            onImageUploaded={handleCCCDBackUpload}
                            defaultImage={field.value}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Điều khoản và điều kiện */}
            <div className="space-y-6">
              <div className="rounded-lg mb-6">
                <div className="flex md:flex-row gap-6">
                  <div className="flex flex-col   gap-2 my-4">
                    <p className="text-sm">
                      1. Bằng việc gửi đơn này, bạn cam kết sẽ chăm sóc, yêu
                      thương và có trách nhiệm với thú cưng.
                    </p>
                    <p className="text-sm">
                      2. Thông tin của bạn sẽ được sử dụng để đánh giá khả năng
                      nhận nuôi và có thể liên hệ xác minh.
                    </p>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="termsAgreed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="data-[state=checked]:bg-[#0053A3] data-[state=checked]:border-[#0053A3]"
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Tôi xác nhận đã đọc và đồng ý với tất cả điều khoản trên
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                animation="none"
                className="bg-[#0053A3] hover:bg-[#003b76]"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đơn đăng ký nhận nuôi"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
