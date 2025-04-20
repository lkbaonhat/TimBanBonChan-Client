"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

import ROUTES from "@/constants/routes";
import { LOGO } from "@/constants/global";
import { authService } from "@/services/authService";

enum ConfirmationStatus {
  LOADING = "loading",
  SUCCESS = "success",
  ERROR = "error",
  EXPIRED = "expired",
}

export default function ConfirmEmailStatus() {
  const [status, setStatus] = useState<ConfirmationStatus>(
    ConfirmationStatus.LOADING
  );
  const [message, setMessage] = useState<string>("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const verifyEmail = async () => {
    if (!token) {
      setStatus(ConfirmationStatus.ERROR);
      setMessage(
        "Liên kết xác nhận không hợp lệ. Vui lòng kiểm tra lại email của bạn."
      );
      return;
    }

    try {
      // Call the API to verify the email
      await authService.confirmEmail(token);
      setStatus(ConfirmationStatus.SUCCESS);
      setMessage("Email của bạn đã được xác nhận thành công!");

      // Automatically redirect to login after 3 seconds
      setTimeout(() => {
        navigate(ROUTES.PUBLIC.SIGNIN);
      }, 3000);
    } catch (error: any) {
      console.error("Email confirmation error:", error);

      // Check if token is expired
      if (error.response?.status === 410) {
        setStatus(ConfirmationStatus.EXPIRED);
        setMessage(
          "Liên kết xác nhận đã hết hạn. Vui lòng yêu cầu liên kết mới."
        );
      } else {
        setStatus(ConfirmationStatus.ERROR);
        setMessage(
          error.response?.data?.message ||
            "Đã xảy ra lỗi khi xác nhận email. Vui lòng thử lại sau."
        );
      }
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token, navigate]);

  const renderContent = () => {
    switch (status) {
      case ConfirmationStatus.LOADING:
        return (
          <>
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
              <CardTitle className="text-2xl font-bold">
                Đang xác nhận email
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Loader2 className="h-16 w-16 text-[#0066cc] animate-spin mb-4" />
              <p className="text-center text-gray-600">
                Vui lòng đợi trong khi chúng tôi xác nhận email của bạn...
              </p>
            </CardContent>
          </>
        );

      case ConfirmationStatus.SUCCESS:
        return (
          <>
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
              <CardTitle className="text-2xl font-bold text-green-600">
                Xác nhận thành công
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="bg-green-50 rounded-full p-6 mb-6">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <p className="text-center text-gray-600 text-lg font-medium mb-4">
                {message}
              </p>
              <p className="text-center text-gray-500 mt-4">
                Bạn sẽ được chuyển hướng đến trang đăng nhập sau 3 giây...
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button
                className="bg-[#0066cc] hover:bg-[#0055aa] text-white font-semibold py-3 px-6 rounded-[36px]"
                onClick={() => navigate(ROUTES.PUBLIC.SIGNIN)}
              >
                Đến trang đăng nhập
              </Button>
            </CardFooter>
          </>
        );

      case ConfirmationStatus.EXPIRED:
        return (
          <>
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
              <CardTitle className="text-2xl font-bold text-amber-600">
                Liên kết đã hết hạn
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="bg-amber-50 rounded-full p-6 mb-6">
                <XCircle className="h-16 w-16 text-amber-500" />
              </div>
              <p className="text-center text-gray-600 text-lg font-medium mb-4">
                {message}
              </p>
            </CardContent>
            {/* <CardFooter className="flex justify-center gap-4">
              <Button
                className="bg-[#0066cc] hover:bg-[#0055aa] text-white font-semibold py-3 px-6 rounded-[36px]"
                onClick={() => {
                  if (email) {
                    authService
                      .resendConfirmation(email)
                      .then(() => {
                        setMessage(
                          "Một email xác nhận mới đã được gửi đến địa chỉ email của bạn."
                        );
                      })
                      .catch((error) => {
                        setMessage(
                          "Không thể gửi lại email xác nhận. Vui lòng thử lại sau."
                        );
                        console.error("Resend confirmation error:", error);
                      });
                  }
                }}
              >
                Gửi lại email xác nhận
              </Button>
            </CardFooter> */}
          </>
        );

      case ConfirmationStatus.ERROR:
      default:
        return (
          <>
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
              <CardTitle className="text-2xl font-bold text-red-600">
                Xác nhận thất bại
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <div className="bg-red-50 rounded-full p-6 mb-6">
                <XCircle className="h-16 w-16 text-red-500" />
              </div>
              <p className="text-center text-gray-600 text-lg font-medium mb-4">
                {message}
              </p>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.PUBLIC.SIGNUP)}
              >
                Đăng ký
              </Button>
              <Button
                className="bg-[#0066cc] hover:bg-[#0055aa] text-white font-semibold py-3 px-6 rounded-[36px]"
                onClick={() => navigate(ROUTES.PUBLIC.SIGNIN)}
              >
                Đăng nhập
              </Button>
            </CardFooter>
          </>
        );
    }
  };

  return (
    <div className="flex justify-center items-center my-5 px-4 sm:px-6 md:my-10 md:px-0">
      <Card className="w-full max-w-[95%] md:max-w-[677px] p-6 md:p-12 bg-white rounded-2xl shadow-md">
        {renderContent()}
      </Card>
    </div>
  );
}
