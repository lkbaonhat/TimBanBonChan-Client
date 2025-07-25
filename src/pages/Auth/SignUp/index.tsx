import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { LOGO } from "@/constants/global";
import { Link, useNavigate } from "react-router-dom";
import ROUTES from "@/constants/routes";
import { authService } from "@/services/authService";

// Define form schema with Zod
const signUpSchema = z
  .object({
    fullName: z.string().min(1, { message: "Họ và tên là bắt buộc" }),
    username: z
      .string()
      .min(3, { message: "Tên đăng nhập phải có ít nhất 3 ký tự" })
      .regex(
        /^[a-zA-Z0-9]+$/,
        {
          message:
            "Tên đăng nhập chỉ được chứa chữ cái, số, không chứa khoảng trắng hoặc ký tự đặc biệt",
        }
      ),
    email: z
      .string()
      .min(1, { message: "Email là bắt buộc" })
      .email({ message: "Địa chỉ email không hợp lệ" }),
    phoneNumber: z
      .string()
      .regex(/^\d+$/, { message: "Số điện thoại chỉ chứa số" })
      .min(10, { message: "Số điện thoại phải có ít nhất 10 ký tự" }),
    password: z
      .string()
      .min(6, { message: "Mật khẩu phải có ít nhất 6 ký tự" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Xác nhận mật khẩu là bắt buộc" }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

// Define form data type from the schema
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Initialize react-hook-form with Zod resolver
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Form submission handler
  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Call the authentication service to register the user
      await authService.signUp(data);

      // Redirect to registration success page
      navigate(ROUTES.PUBLIC.REGISTRATION_SUCCESS, {
        state: { email: data.email },
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      // Handle API error response
      if (error.response && error.response.data) {
        setError(
          error.response.data.message ||
          "Đã xảy ra lỗi trong quá trình đăng ký."
        );
      } else {
        setError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen my-5 px-4 sm:px-6 md:my-10 md:px-0">
      <div className="w-full max-w-[95%] md:max-w-[677px] p-6 md:p-12 bg-white rounded-2xl shadow-md">
        <div className="flex justify-center mb-10">
          <div className="w-[184px] h-[60px] flex items-center justify-center">
            <img
              src={LOGO.NO_TEXT || "/placeholder.svg"}
              alt="logo"
              className="w-32 md:w-auto"
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-10 px-0 sm:px-2 md:px-5"
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Họ và tên"
                      className="bg-[#C4E2EF] border-none rounded-[36px] py-4 md:py-6 text-base md:text-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Tên người dùng"
                      className="bg-[#C4E2EF] border-none rounded-[36px] py-4 md:py-6 text-base md:text-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Địa chỉ email cá nhân"
                      className="bg-[#C4E2EF] border-none rounded-[36px] py-4 md:py-6 text-base md:text-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      placeholder="Số điện thoại"
                      className="bg-[#C4E2EF] border-none rounded-[36px] py-4 md:py-6 text-base md:text-lg"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="Mật khẩu"
                        className="bg-[#C4E2EF] border-none rounded-[36px] py-4 md:py-6 text-base md:text-lg"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Xác nhận mật khẩu"
                        className="bg-[#C4E2EF] border-none rounded-[36px] py-4 md:py-6 text-base md:text-lg"
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                        onClick={toggleConfirmPasswordVisibility}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-500 text-sm mt-1" />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-[#0053A3] hover:bg-[#004890] text-white font-semibold text-base md:text-2xl py-4 md:py-6 rounded-[36px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </form>
        </Form>

        {/* <div className="flex items-center my-6 md:my-10">
          <Separator className="flex-1" />
          <span className="px-3 md:px-6 text-xl md:text-2xl font-bold">
            Hoặc
          </span>
          <Separator className="flex-1" />
        </div>

        <div className="flex justify-center gap-4 mb-6 md:mb-10">
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-3 md:mx-8">
            <img src={LOGO.APP_LOGO || "/placeholder.svg"} alt="app_logo" />
          </button>
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-3 md:mx-8">
            <img src={LOGO.GG_LOGO || "/placeholder.svg"} alt="gg_logo" />
          </button>
          <button className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center mx-3 md:mx-8">
            <img src={LOGO.FB_LOGO || "/placeholder.svg"} alt="fb_logo" />
          </button>
        </div> */}

        <div className="text-center text-sm md:text-base text-gray-500 mt-6 md:mt-8">
          <p>
            Bạn đã có tài khoản?{" "}
            <Link
              to={ROUTES.PUBLIC.SIGNIN}
              className="text-[#0053A3] font-medium hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
