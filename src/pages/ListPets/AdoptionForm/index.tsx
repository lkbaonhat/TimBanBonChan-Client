import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import { petService } from "@/services/petService";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useSelector } from "react-redux";
import { selectorAuth } from "@/store/modules/auth/selector";

// Updated form schema to match API fields
const formSchema = z.object({
  livingConditions: z.string().min(10, {
    message: "Vui lòng mô tả chi tiết điều kiện sống (ít nhất 10 ký tự)",
  }),
  experienceWithPets: z.string().min(10, {
    message: "Vui lòng mô tả kinh nghiệm nuôi thú cưng (ít nhất 10 ký tự)",
  }),
  reasonForAdoption: z.string().min(10, {
    message: "Vui lòng chia sẻ lý do nhận nuôi (ít nhất 10 ký tự)",
  }),
  otherPets: z
    .string()
    .min(1, { message: "Vui lòng chọn có hay không có thú cưng khác" }),
  workSchedule: z.string().min(10, {
    message:
      "Vui lòng mô tả lịch làm việc và thời gian chăm sóc (ít nhất 10 ký tự)",
  }),
  familyMembers: z.string().min(10, {
    message: "Vui lòng mô tả thành viên gia đình (ít nhất 10 ký tự)",
  }),
  termsAgreed: z.boolean().refine((val) => val === true, {
    message: "Bạn phải đồng ý với điều khoản",
  }),
});

// Form data type
type FormData = z.infer<typeof formSchema>;

// Updated Pet interface to match API response
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

export default function AdoptionForm() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [adoptionPost, setAdoptionPost] = useState<AdoptionPost | null>(null);
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userInfo: IREDUX.UserInfo = useSelector(selectorAuth.userInfo);

  // Current user and time context
  const currentUserLogin = "lkbaonhat";
  const currentDateTime = "2025-06-18 15:12:41";

  useEffect(() => {
    const fetchPetDetails = async () => {
      if (!postId) {
        setError("Không tìm thấy ID bài đăng.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch adoption post by postId
        const response = await petService.getAdoptionPostDetail(postId);

        // Process the response to extract pet data
        let postData;
        if (response.data && response.data.data) {
          postData = response.data.data;
        } else if (
          response.data &&
          typeof response.data === "object" &&
          "postId" in response.data
        ) {
          postData = response.data;
        } else {
          throw new Error("Invalid adoption post data received");
        }

        setAdoptionPost(postData);
        setPet(postData.pet);
      } catch (err: any) {
        console.error(`[${currentDateTime}] Error fetching pet details:`, err);

        if (err.response?.status === 404) {
          setError("Không tìm thấy bài đăng nhận nuôi này.");
        } else if (err.response?.status === 403) {
          setError("Bạn không có quyền truy cập bài đăng này.");
        } else {
          setError("Không thể tải thông tin thú cưng. Vui lòng thử lại sau.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [postId]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      livingConditions: "",
      experienceWithPets: "",
      reasonForAdoption: "",
      otherPets: "Không",
      workSchedule: "",
      familyMembers: "",
      termsAgreed: false,
    },
  });

  const onSubmit = async (data: FormData) => {
    if (!adoptionPost) {
      toast.error("Không tìm thấy thông tin bài đăng.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare payload exactly matching API specification
      const payload = {
        postId: adoptionPost.postId,
        applicantUserId: userInfo.userId, // This should be set by backend based on auth token
        applicationStatus: "Pending", // Default status for new applications
        livingConditions: data.livingConditions,
        experienceWithPets: data.experienceWithPets,
        reasonForAdoption: data.reasonForAdoption,
        otherPets: data.otherPets,
        workSchedule: data.workSchedule,
        familyMembers: data.familyMembers,
      };

      // Call adoption application API
      const response = await userService.createAdoptionApplication(payload);

      if (response.data && response.data.success) {
        toast.success("Đơn đăng ký nhận nuôi đã được gửi thành công!");

        // Redirect back to pet detail page with success message
        navigate(`/pets/${adoptionPost.postId}`, {
          state: {
            message:
              "Đơn đăng ký của bạn đã được gửi thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất có thể.",
            applicationId: response.data.data?.applicationId,
          },
        });
      } else {
        throw new Error(
          response.data?.message || "Failed to submit application"
        );
      }
    } catch (error: any) {
      console.error(
        `[${currentDateTime}] Error submitting adoption application:`,
        error
      );

      // Handle different types of errors
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error("Thông tin gửi không hợp lệ. Vui lòng kiểm tra lại.");
      } else if (error.response?.status === 401) {
        toast.error("Bạn cần đăng nhập để gửi đơn đăng ký.");
        navigate("/login");
      } else if (error.response?.status === 409) {
        toast.error("Bạn đã gửi đơn đăng ký cho thú cưng này rồi.");
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error("Có lỗi xảy ra khi gửi đơn đăng ký. Vui lòng thử lại sau.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Define breadcrumb items dynamically based on the pet
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Làm quen với các bé", path: "/pets" },
    { label: pet?.petName || "Thú cưng", path: `/pets/${postId}` },
    { label: "Thủ tục nhận nuôi" },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <Breadcrumb
          items={[
            { label: "Trang chủ", path: "/" },
            { label: "Làm quen với các bé", path: "/pets" },
            { label: "Đang tải...", path: "#" },
            { label: "Thủ tục nhận nuôi" },
          ]}
        />
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải thông tin thú cưng...</p>
            <p className="text-xs text-gray-500 mt-2">
              User: {currentUserLogin} | {currentDateTime}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4">
        <Breadcrumb
          items={[
            { label: "Trang chủ", path: "/" },
            { label: "Làm quen với các bé", path: "/pets" },
          ]}
        />
        <div className="text-center py-16">
          <p className="text-red-500 mb-4">{error}</p>
          <p className="text-xs text-gray-500 mb-4">
            User: {currentUserLogin} | {currentDateTime}
          </p>
          <div className="flex gap-2 justify-center">
            <Button variant="outline" onClick={() => navigate("/pets")}>
              Quay lại danh sách thú cưng
            </Button>
            <Button variant="blue" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Get pet image
  const petImage =
    pet?.imageUrls && pet.imageUrls.length > 0
      ? pet.imageUrls[0]
      : "/placeholder.svg?height=80&width=80";

  return (
    <div className="min-h-screen pb-10">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto">
        <ContentHeader title="Thủ tục nhận nuôi" level="h1" />

        {/* Pet Profile */}
        <div className="flex items-center gap-4 mb-8 p-4 rounded-lg">
          <Avatar className="h-20 w-20 border-2 border-white">
            <AvatarImage src={petImage} alt={pet?.petName || "Thú cưng"} />
            <AvatarFallback>
              {pet?.petName?.substring(0, 2) || "TC"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-bold">{pet?.petName || "Thú cưng"}</h2>
            <div className="text-sm text-gray-600 space-y-1">
              <p>
                {pet?.categoryName || "Thú cưng"} |{" "}
                {pet?.breedName || "Không rõ giống"} |{" "}
                {pet?.gender || "Không rõ"}
              </p>
              <p>
                {pet?.isVaccinated ? "Đã tiêm phòng" : "Chưa tiêm phòng"} |{" "}
                {pet?.personality || "Chưa có thông tin"}
              </p>
              <p className="text-blue-600 font-medium">
                Mã bài đăng: #{adoptionPost?.postId}
              </p>
            </div>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Living Conditions */}
            <div>
              <ContentHeader title="Điều kiện sống" level="h2" />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="livingConditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mô tả điều kiện sống hiện tại của bạn *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ví dụ: Nhà riêng 2 tầng có sân vườn rộng 100m2, khu vực an toàn, ít xe cộ qua lại..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Vui lòng mô tả chi tiết về nơi ở, không gian sống, và
                        môi trường xung quanh.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="familyMembers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thành viên trong gia đình *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ví dụ: Gia đình 4 người gồm vợ chồng và 2 con nhỏ (5 và 8 tuổi). Tất cả đều yêu thích động vật. Bà ngoại 65 tuổi cũng sống cùng và rất thích chó mèo..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Mô tả về số lượng thành viên, độ tuổi, và thái độ của họ
                        với thú cưng.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="workSchedule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Lịch làm việc và thời gian chăm sóc thú cưng *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ví dụ: Làm việc 8h-17h từ thứ 2-6, làm việc tại nhà 2-3 ngày/tuần. Cuối tuần hoàn toàn rảnh. Có thể dành 3-4 giờ/ngày để chăm sóc và vui chơi với thú cưng..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Mô tả lịch làm việc của bạn và thời gian có thể dành cho
                        việc chăm sóc thú cưng.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Pet Experience and Other Pets */}
            <div>
              <ContentHeader
                title="Kinh nghiệm và thú cưng hiện tại"
                level="h2"
              />
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="experienceWithPets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kinh nghiệm nuôi thú cưng của bạn *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ví dụ: Đã nuôi chó 5 năm từ khi còn con. Có kinh nghiệm chăm sóc chó bị ốm, biết cách huấn luyện cơ bản, đã từng cứu chữa và nuôi dưỡng chó mèo bị bỏ rơi..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Chia sẻ về kinh nghiệm nuôi dưỡng, chăm sóc, và huấn
                        luyện thú cưng.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="otherPets"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>
                        Hiện tại bạn có nuôi thú cưng khác không? *
                      </FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Có" id="other-pets-yes" />
                            <Label htmlFor="other-pets-yes">Có</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Không" id="other-pets-no" />
                            <Label htmlFor="other-pets-no">Không</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormDescription>
                        Thông tin này giúp chúng tôi hiểu về môi trường sống
                        hiện tại.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reasonForAdoption"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Lý do bạn muốn nhận nuôi thú cưng này *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ví dụ: Muốn có bạn đồng hành cho con trai 8 tuổi, giúp bé học cách yêu thương và chăm sóc động vật. Gia đình đã chuẩn bị đầy đủ không gian và kinh phí để chăm sóc..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Chia sẻ động lực và mục đích của bạn khi muốn nhận nuôi
                        thú cưng này.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Commitment */}
            <div>
              <ContentHeader title="Cam kết chăm sóc" level="h2" />
              <div className="py-6  rounded-lg mb-4">
                <p className="text-sm mb-3 font-medium">
                  Khi gửi đơn này, tôi cam kết:
                </p>
                <ol className="list-decimal pl-6 space-y-2 text-sm">
                  <li>
                    Chăm sóc thú cưng đúng cách, đảm bảo dinh dưỡng và chăm sóc
                    y tế
                  </li>
                  <li>
                    Tạo môi trường sống an toàn và yêu thương cho thú cưng
                  </li>
                  <li>
                    Không bỏ rơi hoặc chuyển nhượng thú cưng cho người khác mà
                    không thông báo
                  </li>
                  <li>
                    Chấp nhận việc tổ chức/người gửi thăm kiểm tra tình hình
                    chăm sóc
                  </li>
                  <li>
                    Thông báo ngay nếu có vấn đề về sức khỏe hoặc hành vi của
                    thú cưng
                  </li>
                </ol>
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
                      <FormLabel className="text-sm">
                        Tôi xác nhận đã đọc và đồng ý với tất cả điều khoản nhận
                        nuôi *
                      </FormLabel>
                      <FormDescription>
                        Bạn cần đồng ý với các điều khoản trên để tiếp tục.
                      </FormDescription>
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
                variant="blue"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? "Đang gửi đơn..."
                  : "Hoàn tất và gửi đơn nhận nuôi"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
