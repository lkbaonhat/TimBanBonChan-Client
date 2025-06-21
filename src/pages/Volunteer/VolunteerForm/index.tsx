import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectorAuth } from "@/store/modules/auth/selector";

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
  birthDate: z.string().min(1, {
    message: "Ngày sinh là bắt buộc.",
  }),
  gender: z.string({
    required_error: "Vui lòng chọn giới tính.",
  }),
  occupation: z.string().min(1, {
    message: "Nghề nghiệp là bắt buộc.",
  }),
  facebookLink: z.string().optional(),
  preferredRole: z.string({
    required_error: "Vui lòng chọn vai trò mong muốn.",
  }),
  previousExperience: z.string().optional(),
  skills: z.string().optional(),
  motivation: z.string().min(10, {
    message: "Lý do tham gia phải có ít nhất 10 ký tự.",
  }),
  availableDays: z.string({
    required_error: "Vui lòng chọn ngày có thể tham gia.",
  }),
  availableHours: z.string({
    required_error: "Vui lòng chọn khung giờ có thể tham gia.",
  }),
  // Sửa lại định nghĩa termsAgreed để tránh lỗi TypeScript
  termsAgreed: z.boolean().refine((value) => value === true, {
    message: "Bạn phải đồng ý với điều khoản và điều kiện.",
  }),
});

type FormData = z.infer<typeof formSchema>;

export default function VolunteerPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userInfo: IRedux.UserInfo = useSelector(selectorAuth.userInfo);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      birthDate: "",
      gender: "",
      occupation: "",
      facebookLink: "",
      preferredRole: "",
      previousExperience: "",
      skills: "",
      motivation: "",
      availableDays: "",
      availableHours: "",
      termsAgreed: false, // Đặt default value rõ ràng
    },
  });

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    try {
      const { termsAgreed, ...apiData } = values;

      const submitData = {
        userId: userInfo.userId,
        applicationStatus: "pending",
        ...apiData,
      };

      const response = await userService.createVolunteerApplication(submitData);

      toast.success("Đơn đăng ký tình nguyện viên đã được gửi thành công!");

      form.reset();
    } catch (error: any) {
      console.error("Failed to submit volunteer application:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng thử lại.";

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Cộng đồng", path: "/community" },
    { label: "Tình nguyện viên", path: "/volunteer" },
    { label: "Đăng ký" },
  ];

  return (
    <div className="min-h-screen pb-10">
      <Breadcrumb items={breadcrumbItems} />
      <div className="container mx-auto">
        <ContentHeader title="Đăng ký làm tình nguyện viên" level="h1" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
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
                      <FormLabel>Họ và tên *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nguyễn Văn A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày sinh *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Nam">Nam</SelectItem>
                          <SelectItem value="Nữ">Nữ</SelectItem>
                          <SelectItem value="Khác">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="nguyenvana@gmail.com"
                          {...field}
                        />
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
                      <FormLabel>Số điện thoại *</FormLabel>
                      <FormControl>
                        <Input placeholder="0901234567" {...field} />
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
                      <FormLabel>Nghề nghiệp *</FormLabel>
                      <FormControl>
                        <Input placeholder="Sinh viên" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Số 01, Đường Võ Văn Ngân, Phường Linh Trung, Thủ Đức, TP.HCM"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="facebookLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link Facebook (tùy chọn)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://facebook.com/yourprofile"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Cung cấp link Facebook để chúng tôi có thể liên lạc dễ
                      dàng hơn
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Experience and Skills */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Kinh nghiệm và Kỹ năng
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Chia sẻ về kinh nghiệm và kỹ năng của bạn
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="previousExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kinh nghiệm làm việc với chúng tôi</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả kinh nghiệm của bạn (nếu có) với chúng tôi..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Nếu bạn đã từng tham gia hoặc hỗ trợ tổ chức trước đây
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kinh nghiệm tình nguyện khác</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Mô tả kinh nghiệm tình nguyện với các tổ chức khác..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Chia sẻ về các hoạt động tình nguyện bạn đã tham gia
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Role Preferences */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Vai trò và Thời gian
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Cho chúng tôi biết về vai trò bạn mong muốn và thời gian có
                  thể tham gia
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="preferredRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vai trò mong muốn *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn vai trò" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tình nguyện viên trực tiếp">
                            Tình nguyện viên trực tiếp
                          </SelectItem>
                          <SelectItem value="Tình nguyện viên từ xa">
                            Tình nguyện viên từ xa
                          </SelectItem>
                          <SelectItem value="Tình nguyện viên sự kiện">
                            Tình nguyện viên sự kiện
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày có thể tham gia *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn ngày" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Thứ 2 - Thứ 6">
                            Thứ 2 - Thứ 6
                          </SelectItem>
                          <SelectItem value="Thứ 7, Chủ nhật">
                            Thứ 7, Chủ nhật
                          </SelectItem>
                          <SelectItem value="Tất cả các ngày">
                            Tất cả các ngày
                          </SelectItem>
                          <SelectItem value="Linh hoạt">Linh hoạt</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="availableHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khung giờ có thể tham gia *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn khung giờ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Sáng (6:00 - 12:00)">
                          Sáng (6:00 - 12:00)
                        </SelectItem>
                        <SelectItem value="Chiều (12:00 - 18:00)">
                          Chiều (12:00 - 18:00)
                        </SelectItem>
                        <SelectItem value="Tối (18:00 - 22:00)">
                          Tối (18:00 - 22:00)
                        </SelectItem>
                        <SelectItem value="Cả ngày">Cả ngày</SelectItem>
                        <SelectItem value="Linh hoạt">Linh hoạt</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Lý do muốn trở thành tình nguyện viên *
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Chia sẻ lý do bạn muốn tham gia làm tình nguyện viên với chúng tôi..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Hãy cho chúng tôi biết động lực và mong muốn của bạn
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Điều khoản và Cam kết
                </h2>
              </div>

              <div className="rounded-lg border p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-medium">
                      Cam kết của tình nguyện viên:
                    </h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">1.</span>
                        Tuân thủ các nguyên tắc và quy định của tình nguyện viên
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">2.</span>
                        Đồng ý để tổ chức lưu trữ và sử dụng thông tin cá nhân,
                        hình ảnh
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="font-medium text-primary">3.</span>
                        Tự chịu trách nhiệm về các sự cố ngoài tầm kiểm soát của
                        tổ chức
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Heart
                        className="h-6 w-6 text-pink-400 mt-1 flex-shrink-0"
                        fill="currentColor"
                      />
                      <div>
                        <h3 className="font-medium mb-1">
                          Nguyên tắc tình nguyện viên "Tìm bạn bốn chân"
                        </h3>
                        <button
                          type="button"
                          className="text-sm text-primary hover:underline"
                          onClick={() => {
                            console.log("Show terms modal");
                          }}
                        >
                          Đọc chi tiết →
                        </button>
                      </div>
                    </div>
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
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-sm font-normal">
                        Tôi xác nhận đã đọc và đồng ý với tất cả điều khoản và
                        cam kết trên *
                      </FormLabel>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="min-w-[250px]"
                variant="blue"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Đang gửi...
                  </>
                ) : (
                  "Gửi đơn đăng ký tình nguyện viên"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
