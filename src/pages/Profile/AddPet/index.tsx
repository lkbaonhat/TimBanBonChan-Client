import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ROUTES from "@/constants/routes";

export default function PetSearch() {
  const navigate = useNavigate();

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tài khoản", path: ROUTES.PUBLIC.PROFILE },
    { label: "Thêm thú cưng" },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Main Content */}
      <div className="container mx-auto py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left side - Illustration */}
            <div className="w-full md:w-1/2 pr-0 md:pr-8">
              <div className="bg-green-100 rounded-2xl p-6 flex justify-center items-center h-64">
                <img
                  src="/pets-illustration.png"
                  alt="Various pets illustration"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>

            {/* Right side - Form */}
            <div className="w-full md:w-1/2 pl-0 md:pl-8">
              <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                {/* Photo upload hint */}
                <div className="text-right mb-4">
                  <span className="text-xs text-gray-500">
                    Thêm ảnh thú cưng 📷
                  </span>
                </div>

                {/* Form fields */}
                <div className="space-y-6">
                  {/* First row */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 w-16">Tên</span>
                    <div className="flex space-x-4">
                      <span className="text-sm text-gray-500">Giống</span>
                      <Select defaultValue="cat">
                        <SelectTrigger className="w-20 h-8 text-xs border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cat">Mèo</SelectItem>
                          <SelectItem value="dog">Chó</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Second row */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 w-16">Tuổi</span>
                    <div className="flex space-x-4">
                      <span className="text-sm text-gray-500">Giới tính</span>
                      <Select defaultValue="male">
                        <SelectTrigger className="w-20 h-8 text-xs border-gray-200">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Đực</SelectItem>
                          <SelectItem value="female">Cái</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Third row */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700 w-16">
                      Năm hạn nuôi bé
                    </span>
                    <Select>
                      <SelectTrigger className="w-20 h-8 text-xs border-gray-200">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 năm</SelectItem>
                        <SelectItem value="2">2 năm</SelectItem>
                        <SelectItem value="long">Dài hạn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Submit button */}
                <div className="mt-8">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 text-sm">
                    Lưu thay đổi
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
