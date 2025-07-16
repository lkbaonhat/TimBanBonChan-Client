import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LOGO } from "@/constants/global";
import ROUTES from "@/constants/routes";

export default function DonationSuccess() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     navigate(ROUTES.PRIVATE.DONATION);
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [navigate]);

  return (
    <div className="flex justify-center items-center px-4 py-20">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="w-[184px] h-[60px] flex items-center justify-center">
              <img
                src={LOGO.NO_TEXT || "/placeholder.svg"}
                alt="logo"
                className="w-32 md:w-auto"
              />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-green-600 mb-2">
            Quyên góp thành công!
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center py-4">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-6">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Cảm ơn bạn đã quyên góp! 💝
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Sự đóng góp của bạn sẽ giúp chăm sóc những bé thú cưng cần được yêu thương.
            </p>
          </div>

          {/* Auto redirect notice */}
          <p className="text-sm text-gray-500">
            Bạn sẽ được chuyển về trang quyên góp sau 5 giây...
          </p>
        </CardContent>

        <CardFooter className="flex gap-3 justify-center pt-4">
          <Button
            asChild
            variant="blueOutline"
            className="px-6"
          >
            <Link to={ROUTES.PRIVATE.DONATION}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quyên góp thêm
            </Link>
          </Button>
          <Button
            asChild
            variant="blue"
            className="px-6"
          >
            <Link to={ROUTES.PUBLIC.HOME}>
              <Home className="h-4 w-4 mr-2" />
              Về trang chủ
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}