import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  MapPin,
  Phone,
  Clock,
  Star,
  Calendar,
  Navigation,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { Button } from "@/components/ui/button";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import clinicsData from "@/constants/data/clinicsData.json";

export default function ClinicDetail() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);
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
          to="/pet-care"
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
    <div className=" min-h-screen pb-12">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Clinic Content */}
      <div className="container mx-auto  mt-6">
        <div className="bg-white rounded-xl overflow-hidden shadow-md relative">
          {/* Decorative circles to match home page style */}
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#C5E2F0] opacity-70 rounded-full z-0 hidden md:block"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#FF99C0] opacity-60 rounded-full z-0 hidden md:block"></div>

          {/* Clinic Banner Image */}
          <div className="h-64 relative">
            <img
              src={clinic.image || "/clinic-default.jpg"}
              alt={clinic.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/1200x400?text=Clinic";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
              <div className="absolute bottom-4 left-6">
                <h1 className="text-white text-3xl font-bold">{clinic.name}</h1>
                <div className="flex items-center text-white mt-2">
                  <Star
                    className="text-yellow-400 fill-yellow-400 mr-1"
                    size={18}
                  />
                  <span className="text-lg font-medium mr-2">
                    {clinic.rating}
                  </span>
                  <span className="text-white/80 text-sm">
                    ({Math.floor(Math.random() * 50) + 20} đánh giá)
                  </span>
                </div>
              </div>
              <div className="absolute bottom-4 right-6">
                <Button
                  asChild
                  variant="blue"
                  shape="pill"
                  animation="none"
                  className="flex items-center"
                >
                  <a
                    href={`https://maps.google.com/?q=${clinic.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Navigation size={16} className="mr-1" />
                    Chỉ đường
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Clinic Description - Added section */}
          {clinic.description && (
            <div className="px-6 py-4 bg-blue-50 border-l-4 border-[#0053A3] rounded-r-lg mx-6 my-4 shadow-sm">
              <p className="text-[#0053A3] font-medium italic">
                {clinic.description}
              </p>
            </div>
          )}

          {/* Clinic Info */}
          <div className="p-6 md:p-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-pink-50 rounded-xl p-6 shadow-sm transform transition-transform hover:scale-[1.01]">
                <ContentHeader
                  title="Thông tin chi tiết"
                  level="h2"
                  className="mb-6 text-[#FF99C0]"
                />

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-[#FF99C0] p-2 rounded-full mr-4">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Địa chỉ</h3>
                      <p className="text-gray-600">{clinic.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#FF99C0] p-2 rounded-full mr-4">
                      <Phone className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Số điện thoại</h3>
                      <p className="text-gray-600">{clinic.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-[#FF99C0] p-2 rounded-full mr-4">
                      <Clock className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Giờ làm việc</h3>
                      <p className="text-gray-600">{clinic.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 shadow-sm transform transition-transform hover:scale-[1.01]">
                {/* Services & Prices */}
                <ContentHeader
                  title="Dịch vụ"
                  level="h2"
                  className="mb-6 text-[#0053A3]"
                />

                <div className="rounded-lg">
                  <ul className="divide-y divide-gray-200">
                    {clinic.services &&
                      clinic.services.map((service, index) => (
                        <li
                          key={index}
                          className="py-3 px-2 flex items-start transition-colors rounded-md group hover:bg-white"
                        >
                          <div className="flex-shrink-0 w-3 h-3 rounded-full bg-[#0053A3] mt-2 mr-3 group-hover:bg-[#0053A3] transition-colors"></div>
                          <div className="flex-grow">
                            <span className="text-gray-800 font-medium group-hover:text-[#0053A3] transition-colors">
                              {service}
                            </span>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
