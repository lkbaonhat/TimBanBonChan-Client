import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
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
import { useDispatch } from "react-redux";
import { toast } from "sonner";

// Define form schema with Zod
const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email là bắt buộc" })
    .email({ message: "Địa chỉ email không hợp lệ" }),
  password: z.string().min(1, { message: "Mật khẩu là bắt buộc" }),
  rememberMe: z.boolean().optional(),
});

// Define form data type from the schema
type SignInFormData = z.infer<typeof signInSchema>;

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Initialize react-hook-form with Zod resolver
  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Form submission handler
  const onSubmit = async (data: SignInFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);

      dispatch({
        type: "SIGN_IN",
        payload: data,
        callback: (isSuccess: boolean) => {
          console.log("zo ne");
          if (!isSuccess) {
            toast.error("Email hoặc mật khẩu không đúng.");
          } else {
            toast.success("Đăng nhập thành công.");
            navigate(ROUTES.PUBLIC.HOME);
          }
        },
      });
    } catch (error: any) {
      console.error("Login error:", error);
      // Handle API error response
      if (error.response && error.response.data) {
        setError(
          error.response.data.message || "Email hoặc mật khẩu không đúng."
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Địa chỉ email"
                      className="bg-[#C5E2F0] border-none rounded-[36px] py-4 md:py-6 text-base md:text-lg"
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
                        className="bg-[#C5E2F0] border-none rounded-[36px] py-4 md:py-6 text-base md:text-lg"
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

            <Button
              type="submit"
              className="w-full bg-[#0066cc] hover:bg-[#0055aa] text-white font-semibold text-base md:text-2xl py-4 md:py-6 rounded-[36px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
        </Form>

        <div className="flex items-center my-6 md:my-10">
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
        </div>

        <div className="flex justify-center items-center mt-4 md:mt-6">
          <Link to={""} className="text-[#0066cc] font-medium hover:underline">
            Bạn quên mật khẩu?
          </Link>
        </div>

        <div className="text-center text-sm md:text-base text-gray-500 mt-6 md:mt-8">
          <p>
            Bạn chưa có tài khoản?{" "}
            <Link
              to={ROUTES.PUBLIC.SIGNUP}
              className="text-[#0066cc] font-medium hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
