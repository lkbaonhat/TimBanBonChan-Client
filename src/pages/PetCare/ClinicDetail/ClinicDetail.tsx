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
    <div className="bg-[#FFEDFA] min-h-screen pb-12">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Clinic Content */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm">
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

          {/* Clinic Info */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ContentHeader
                  title="Thông tin chi tiết"
                  level="h2"
                  className="mb-4"
                />

                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin
                      className="text-[#0053A3] mt-1 flex-shrink-0 mr-3"
                      size={20}
                    />
                    <div>
                      <h3 className="font-medium">Địa chỉ</h3>
                      <p className="text-gray-600">{clinic.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone
                      className="text-[#0053A3] mt-1 flex-shrink-0 mr-3"
                      size={20}
                    />
                    <div>
                      <h3 className="font-medium">Số điện thoại</h3>
                      <p className="text-gray-600">{clinic.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock
                      className="text-[#0053A3] mt-1 flex-shrink-0 mr-3"
                      size={20}
                    />
                    <div>
                      <h3 className="font-medium">Giờ làm việc</h3>
                      <p className="text-gray-600">{clinic.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {/* Services & Prices */}
                <ContentHeader title="Dịch vụ" level="h2" className="mb-4" />

                <div className=" rounded-lg ">
                  <ul className="">
                    {clinic.services &&
                      clinic.services.map((service, index) => (
                        <li
                          key={index}
                          className="py-3 px-2 flex items-start  transition-colors rounded-md group"
                        >
                          <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0053A3] mt-2 mr-3 "></div>
                          <div className="flex-grow">
                            <span className="text-gray-800 font-medium ">
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
