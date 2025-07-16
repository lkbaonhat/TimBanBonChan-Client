import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { XCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { LOGO } from "@/constants/global";
import ROUTES from "@/constants/routes";

export default function DonationFailed() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(ROUTES.PRIVATE.DONATION);
    }, 10000);

    return () => clearTimeout(timer);
  }, [navigate]);

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
          <CardTitle className="text-3xl font-bold text-red-600 mb-2">
            Thanh toán thất bại
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center py-4">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-6">
              <XCircle className="h-16 w-16 text-red-500" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Rất tiếc, thanh toán không thành công
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Vui lòng thử lại hoặc sử dụng phương thức thanh toán khác.
            </p>
          </div>

          {/* Auto redirect notice */}
          <p className="text-sm text-gray-500">
            Bạn sẽ được chuyển về trang quyên góp sau 10 giây...
          </p>
        </CardContent>

        <CardFooter className="flex gap-3 justify-center pt-4">
          <Button
            asChild
            variant="blueOutline"
            className="px-6"
          >
            <Link to={ROUTES.PRIVATE.DONATION}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Thử lại
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