import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import clinicsData from "@/constants/data/clinicsData.json";
import ContentHeader from "@/components/ContentHeader/ContentHeader";

export default function VetClinicProfile() {
  const { id } = useParams();
  const [clinic, setClinic] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find clinic with matching id
    const foundClinic = clinicsData.find((clinic) => clinic.id === Number(id));

    if (foundClinic) {
      setClinic(foundClinic);
    }

    setLoading(false);
  }, [id]);

  // Handle if clinic not found
  if (!loading && !clinic) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy phòng khám</h1>
        <Link
          to="/clinics"
          className="text-blue-600 hover:underline flex items-center justify-center"
        >
          <ChevronLeft size={16} className="mr-1" />
          Quay lại danh sách phòng khám
        </Link>
      </div>
    );
  }

  // Render loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Sổ tay chăm sóc thú cưng", path: "/pet-care" },
    { label: "Danh sách phòng khám", path: "/clinics" },
    { label: clinic.name },
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="container mx-auto py-8">
        <div className=" overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:min-h-[600px]">
            {/* Left side - Image */}
            <div className="lg:w-1/2 lg:flex">
              <div className="w-full h-full relative overflow-hidden">
                <img
                  src={clinic.image || "/placeholder.svg"}
                  alt={clinic.name}
                  className="w-full h-full rounded-3xl lg:absolute inset-0 "
                  style={{ minHeight: "100%", borderRadius: "1.5rem" }}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/Diva.png";
                  }}
                />
              </div>
            </div>

            {/* Right side - Information */}
            <div className="lg:w-1/2 lg:pl-8">
              {/* Header with title and icons */}
              <div className="flex justify-between mb-6 items-center">
                <h2 className="text-2xl md:text-2xl font-bold">
                  {clinic.name}
                </h2>

                <div className="flex items-center">
                  <div className="text-[#ff99c0] font-medium">
                    {clinic.rating} <span className="text-[#ff99c0]">★</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                {clinic.description || "Không có mô tả."}
              </p>

              {/* Contact Information */}
              <div className="space-y-4 mb-6">
                <ContentHeader title="Thông tin liên hệ" level="h2" />

                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                    <span className="text-gray-700 text-sm font-bold">
                      Địa chỉ
                    </span>
                    <span className="text-gray-700 text-sm">
                      {clinic.address}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                    <span className="text-gray-700 text-sm font-bold">
                      Điện thoại
                    </span>
                    <span className="text-gray-700 text-sm">
                      {clinic.phone}
                    </span>
                  </div>

                  {/* 
                    <div className="grid grid-cols-2 gap-4 py-2 border-b border-gray-100">
                        <span className="text-gray-600 text-sm">Email</span>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-900 text-sm">
                                {clinic.email || "contact@example.com"}
                            </span>
                            <Facebook className="h-4 w-4 text-blue-600" />
                            <Instagram className="h-4 w-4 text-pink-600" />
                        </div>
                    </div> */}

                  <div className="grid grid-cols-2 gap-4 py-2">
                    <span className="text-gray-700 text-sm font-bold">
                      Giờ làm việc
                    </span>
                    <div className="text-gray-700 text-sm">{clinic.hours}</div>
                  </div>
                </div>
              </div>

              {/* Services */}
              <div className="mb-8">
                <ContentHeader title="Dịch vụ cung cấp" level="h2" />

                <div className="grid grid-cols-2 gap-4">
                  {/* First column */}
                  <ul className="space-y-2">
                    {clinic.services &&
                      clinic.services.slice(0, 5).map((service, index) => (
                        <li
                          key={index}
                          className="flex items-center text-sm text-gray-700"
                        >
                          <span className="w-1 h-1 bg-black rounded-full mr-3"></span>
                          {service}
                        </li>
                      ))}
                  </ul>

                  {/* Second column */}
                  <ul className="space-y-2">
                    {clinic.services &&
                      clinic.services.slice(5, 10).map((service, index) => (
                        <li
                          key={index + 5}
                          className="flex items-center text-sm text-gray-700"
                        >
                          <span className="w-1 h-1 bg-black rounded-full mr-3"></span>
                          {service}
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  asChild
                  shape="default"
                  variant="blue"
                  animation="none"
                  className="flex-1 "
                >
                  <Link
                    to={`https://maps.google.com/?q=${clinic.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    <Navigation size={16} className="mr-2" />
                    Chỉ đường
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
