import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { BANNER, LOGO } from "@/constants/global";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ROUTES from "@/constants/routes";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import { useSelector } from "react-redux";
import { selectorAuth } from "@/store/modules/auth/selector";
import { Link } from "react-router-dom";
import { userService } from "@/services/userService";

const donationSchema = z.object({
  amount: z.string().min(1, "Vui lòng chọn số tiền"),
  customAmount: z.string().optional(),
  fullName: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự"),
  agreeTerms: z
    .boolean()
    .refine((val) => val === true, "Bạn phải đồng ý với điều khoản"),
}).refine((data) => {
  if (data.amount === "custom") {
    if (!data.customAmount || data.customAmount.trim() === "") {
      return false;
    }
    const numVal = Number(data.customAmount.replace(/,/g, ''));
    if (isNaN(numVal) || numVal < 1000) {
      return false;
    }
  }
  return true;
}, {
  message: "Vui lòng nhập số tiền hợp lệ (tối thiểu 1,000 VNĐ)",
  path: ["customAmount"],
});

const contactSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ"),
});

export default function DonationPage() {
  const isAuthenticated = useSelector(selectorAuth.isAuthenticated);
  const userInfo: IRedux.UserInfo = useSelector(selectorAuth.userInfo)

  const donationForm = useForm<z.infer<typeof donationSchema>>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: "",
      customAmount: "",
      fullName: "",
      email: "",
      address: "",
      agreeTerms: false,
    },
  });

  const contactForm = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  // Add scroll animation classes with fadeInRight effect for Donation
  useEffect(() => {
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".animate-on-scroll");

      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementPosition < windowHeight - 100) {
          element.classList.add("animate-fadeInRight");
        }
      });
    };

    window.addEventListener("scroll", animateOnScroll);
    // Initial check for elements in view on page load
    animateOnScroll();

    return () => {
      window.removeEventListener("scroll", animateOnScroll);
    };
  }, []);

  const presetAmounts = ["20,000", "50,000", "200,000", "500,000", "1,000,000"];

  async function onDonationSubmit(values: z.infer<typeof donationSchema>) {
    // Process the final amount value
    const finalAmountString = values.amount === "custom"
      ? values.customAmount
      : values.amount;

    const finalAmount = Number(finalAmountString?.replace(/,/g, '') || '0');

    try {
      const response = await userService.createPayment({
        campaignId: 3,
        amount: finalAmount,
        message: "Ủng hộ chiến dịch",
        donorUserId: userInfo.userId,
      });
      if (response.status === 200) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Error create payment: ", error)
    }
  }

  function onContactSubmit(values: z.infer<typeof contactSchema>) {
    console.log("Contact form:", values);
  }

  const breadcrumbItems = [
    { label: "Trang chủ", path: ROUTES.PUBLIC.HOME },
    { label: "Quyên góp" },
  ];

  return (
    <div className="min-h-screen ">
      {/* Breadcrumb */}
      <div className="animate-on-scroll opacity-0">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {isAuthenticated ? (
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-36 pb-10">
            {/* Left Column */}
            <div className="animate-on-scroll opacity-0">
              {/* Main Content */}
              <div>
                <ContentHeader
                  title="Mỗi sự đóng góp là một hy vọng"
                  className="mb-12"
                />

                <div className="mb-6">
                  <img
                    src={BANNER.DOG_CIRCLE}
                    alt="Dogs looking down in a circle"
                    className="rounded-2xl w-full"
                  />
                </div>

                <div className=" text-gray-700">
                  <ContentHeader
                    title="Hãy cùng lan tỏa yêu thương!"
                    className="font-semibold text-[#0053A3]"
                    level="h2"
                  />
                  <p className="text-sm leading-relaxed">
                    Mỗi sự đóng góp của bạn đều mang lại ý nghĩa to lớn, giúu mang
                    đến hy vọng và sự sống cho những bé thú cưng bé bỏng rơi vào
                    cảnh khó khăn và được chăm sóc cẩn thận và tận tâm mỗi đêm mỗi
                    ngày cho đến khi chúng có thể tìm thấy đôi chủ cuộc đời của
                    mình.
                  </p>
                  <p className="text-sm">
                    💝{" "}
                    <span className="text-[#FF99C0] text-lg font-bold">
                      QUYÊN GÓP
                    </span>{" "}
                    ngay để cứu những chú chó với niềm nồng cầu chuyện hạnh phúc!
                  </p>
                </div>
              </div>

              {/* Contact Form */}
              <Card className="/80 backdrop-blur-sm bg-opacity border-none shadow-none">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                      <img src={LOGO.MESSAGE_PINK} alt="message-icon" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Bạn có câu hỏi về phần Quyên góp
                    </h3>
                  </div>

                  <Form {...contactForm}>
                    <form
                      onSubmit={contactForm.handleSubmit(onContactSubmit)}
                      className="space-y-4 "
                    >
                      <FormField
                        control={contactForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Địa chỉ email của bạn</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Ví dụ: nguyenvan@gmail.com"
                                {...field}
                                className=""
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={contactForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Câu hỏi của bạn</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Nhập câu hỏi của bạn"
                                {...field}
                                className=""
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        variant={"blue"}
                        type="submit"
                        className="w-full"
                        animation={"none"}
                      >
                        Gửi câu hỏi
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Donation Form */}
            <div className="animate-on-scroll opacity-0 pt-30">
              <Card className="/90 backdrop-blur-sm bg-opacity border-1px shadow-none rounded-2xl">
                <CardContent className="py-10 px-20">
                  <Form {...donationForm}>
                    <form
                      onSubmit={donationForm.handleSubmit(onDonationSubmit)}
                      className="space-y-14"
                    >
                      <div className="space-y-6">
                        {/* Preset Amounts */}
                        <FormField
                          control={donationForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2">
                                Chọn số tiền bạn muốn quyên góp
                              </FormLabel>
                              <FormControl>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-3">
                                    {presetAmounts.map((amount) => (
                                      <Button
                                        key={amount}
                                        type="button"
                                        variant={field.value === amount ? "blue" : "blueOutline"}
                                        animation={"none"}
                                        onClick={() => {
                                          field.onChange(amount);
                                          // Clear custom amount when selecting preset
                                          donationForm.setValue("customAmount", "");
                                        }}
                                        className={field.value === amount ? "shadow-md" : ""}
                                      >
                                        {amount}
                                      </Button>
                                    ))}
                                    <Button
                                      type="button"
                                      variant={field.value === "custom" ? "pink" : "pinkOutline"}
                                      animation={"none"}
                                      onClick={() => field.onChange("custom")}
                                      className={field.value === "custom" ? "shadow-md" : ""}
                                    >
                                      Nhập số tiền khác
                                    </Button>
                                  </div>

                                  {/* Custom Amount Input - Show when "custom" is selected */}
                                  {field.value === "custom" && (
                                    <div className="mt-4">
                                      <FormField
                                        control={donationForm.control}
                                        name="customAmount"
                                        render={({ field: customField }) => (
                                          <FormItem>
                                            <FormLabel className="text-sm">Nhập số tiền (VNĐ)</FormLabel>
                                            <FormControl>
                                              <Input
                                                {...customField}
                                                type="number"
                                                placeholder="Ví dụ: 100000"
                                                className="w-full"
                                                min="1000"
                                                step="1000"
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                  )}
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Thông tin của bạn</h3>

                        <FormField
                          control={donationForm.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2">Họ và tên</FormLabel>
                              <FormControl>
                                <Input {...field} className="" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={donationForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2">Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} className="" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={donationForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="mb-2">Địa chỉ</FormLabel>
                              <FormControl>
                                <Input {...field} className="" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={donationForm.control}
                          name="agreeTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <Label className="text-sm">
                                  Tôi đồng ý với các điều khoản
                                </Label>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        variant={"pink"}
                        animation={"none"}
                        className="w-full text-white font-semibold py-3"
                      >
                        QUYÊN GÓP
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-12 animate-on-scroll opacity-0">
              <ContentHeader
                title="Mỗi sự đóng góp là một hy vọng"
                className="mb-6"
              />
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Để có thể tham gia quyên góp và giúp đỡ những bé thú cưng cần được chăm sóc,
                bạn cần đăng nhập vào tài khoản của mình.
              </p>
            </div>

            {/* Main Content Card */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-blue-50 animate-on-scroll opacity-0">
              <CardContent className="p-12 text-center">
                {/* Icon */}
                <div className="flex justify-center mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-[#0053A3] to-[#FF99C0] rounded-full flex items-center justify-center">
                    <img
                      src={LOGO.MESSAGE_PINK}
                      alt="donation-icon"
                      className="w-12 h-12 filter brightness-0 invert"
                    />
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Đăng nhập để quyên góp
                </h2>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed">
                  Hãy đăng nhập để tham gia vào cộng đồng yêu thương và đóng góp
                  cho những bé thú cưng đang cần được chăm sóc.
                </p>

                {/* Benefits List */}
                <div className="grid md:grid-cols-3 gap-6 mb-10">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl">💝</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Quyên góp dễ dàng</h4>
                    <p className="text-sm text-gray-600 text-center">
                      Thực hiện quyên góp một cách nhanh chóng và an toàn
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl">🐕</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Giúp đỡ thú cưng</h4>
                    <p className="text-sm text-gray-600 text-center">
                      Mỗi đóng góp đều mang lại hy vọng cho các bé thú cưng
                    </p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl">🏠</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">Tìm mái ấm</h4>
                    <p className="text-sm text-gray-600 text-center">
                      Giúp các bé tìm được những gia đình yêu thương
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    asChild
                    variant="blue"
                    size="lg"
                    shape="pill"
                    className="min-w-[200px] text-lg font-semibold py-3 px-8 hover:shadow-lg transition-all duration-300"
                  >
                    <Link to={ROUTES.PUBLIC.SIGNIN}>
                      Đăng nhập ngay
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    shape="pill"
                    className="min-w-[200px] text-lg font-semibold py-3 px-8 border-2 border-[#0053A3] text-[#0053A3] hover:bg-[#0053A3] hover:text-white transition-all duration-300"
                  >
                    <Link to={ROUTES.PUBLIC.SIGNUP}>
                      Tạo tài khoản mới
                    </Link>
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Lưu ý:</span> Việc đăng nhập giúp chúng tôi đảm bảo
                    tính minh bạch và an toàn trong quá trình quyên góp. Tất cả thông tin của bạn
                    sẽ được bảo mật tuyệt đối.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preview Donation Info */}
            <div className="mt-12 animate-on-scroll opacity-0">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Sau khi đăng nhập, bạn có thể:
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Donation Preview */}
                <Card className="shadow-md border-0 overflow-hidden">
                  <div className="bg-gradient-to-r from-[#0053A3] to-[#FF99C0] p-4">
                    <h4 className="text-white font-semibold text-center">Quyên góp trực tiếp</h4>
                  </div>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Số tiền gợi ý:</span>
                        <span className="font-semibold">20,000 - 1,000,000 VNĐ</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Hình thức:</span>
                        <span className="font-semibold">Một lần</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Thanh toán:</span>
                        <span className="font-semibold">An toàn & Bảo mật</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Impact Preview */}
                <Card className="shadow-md border-0">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-900 mb-4 text-center">
                      Tác động của bạn
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🍖</span>
                        <span className="text-gray-600">Thức ăn cho thú cưng</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💊</span>
                        <span className="text-gray-600">Chăm sóc y tế</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🏥</span>
                        <span className="text-gray-600">Nơi ở tạm thời</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">❤️</span>
                        <span className="text-gray-600">Tình yêu thương</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
