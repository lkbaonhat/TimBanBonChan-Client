import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, ArrowRight } from "lucide-react";
import ROUTES from "@/constants/routes";
import { LOGO } from "@/constants/global";

export default function RegistrationSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  // If no email is provided, redirect to signup
  useEffect(() => {
    if (!email) {
      navigate(ROUTES.PUBLIC.SIGNUP);
    }
  }, [email, navigate]);

  if (!email) return null;

  return (
    <div className="flex justify-center items-center min-h-screen my-5 px-4 sm:px-6 md:my-10 md:px-0">
      <Card className="w-full max-w-[95%] md:max-w-[677px] p-6 md:p-12 bg-white rounded-2xl shadow-md">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-6">
            <div className="w-[184px] h-[60px] flex items-center justify-center">
              <img
                src={LOGO.NO_TEXT || "/placeholder.svg"}
                alt="logo"
                className="w-32 md:w-auto"
              />
            </div>
          </div>
          <CardTitle className="text-2xl md:text-3xl font-bold text-[#0066cc]">
            Đăng ký thành công!
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="bg-blue-50 rounded-full p-6 mb-6">
            <Mail className="h-16 w-16 text-[#0066cc]" />
          </div>

          <h2 className="text-xl font-semibold mb-2">
            Vui lòng xác nhận email của bạn
          </h2>

          <p className="text-center text-gray-600 mb-4">
            Chúng tôi đã gửi một email xác nhận đến
          </p>

          <p className="text-center font-medium text-lg mb-6">{email}</p>

          <p className="text-center text-gray-600 mb-8">
            Vui lòng kiểm tra hộp thư đến của bạn và nhấp vào liên kết xác nhận
            để hoàn tất quá trình đăng ký.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 mb-6 w-full">
            <p>
              Nếu bạn không nhận được email, vui lòng kiểm tra thư mục spam hoặc
              thử lại sau vài phút.
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="flex justify-between w-full mt-2">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.PUBLIC.SIGNUP)}
              className="text-gray-600"
            >
              Quay lại đăng ký
            </Button>

            <Button
              variant="ghost"
              onClick={() => navigate(ROUTES.PUBLIC.SIGNIN)}
              className="text-[#0066cc]"
            >
              Đến trang đăng nhập
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
