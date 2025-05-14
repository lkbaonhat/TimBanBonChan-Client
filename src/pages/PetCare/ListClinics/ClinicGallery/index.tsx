import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import Filter, { FilterConfig } from "@/components/Filter/Filter";
import Pagination from "@/components/Pagination/Pagination";
import Card from "@/components/Card/Card";
import clinicsData from "@/constants/data/clinicsData.json";
import styles from "./clinic-gallery.module.css";

export default function ClinicGallery() {
  const [currentPage, setCurrentPage] = useState(1);
  const [location, setLocation] = useState("all");
  const [rating, setRating] = useState("all");
  const navigate = useNavigate();

  // Define filter configurations
  const filterConfigs: FilterConfig[] = [
    {
      id: "location",
      placeholder: "Khu vực",
      value: location,
      onChange: setLocation,
      options: [
        { id: "all", label: "Vị trí", value: "all" },
        { id: "quan1", label: "Quận 1", value: "Quận 1" },
        { id: "quan2", label: "Quận 2", value: "Quận 2" },
        { id: "quan3", label: "Quận 3", value: "Quận 3" },
        { id: "quan5", label: "Quận 5", value: "Quận 5" },
        {
          id: "quanBinhThanh",
          label: "Quận Bình Thạnh",
          value: "Quận Bình Thạnh",
        },
        { id: "quanThuDuc", label: "TP. Thủ Đức", value: "TP. Thủ Đức" },
      ],
    },
    {
      id: "rating",
      placeholder: "Đánh giá",
      value: rating,
      onChange: setRating,
      options: [
        { id: "all", label: "Đánh giá", value: "all" },
        { id: "5star", label: "5 sao", value: "5" },
        { id: "4star", label: "4+ sao", value: "4" },
        { id: "3star", label: "3+ sao", value: "3" },
      ],
    },
  ];

  // Apply filters
  const filteredClinics = clinicsData.filter((clinic) => {
    if (location !== "all" && !clinic.location.includes(location)) return false;
    if (rating !== "all" && clinic.rating < parseInt(rating)) return false;
    return true;
  });

  // Calculate total pages for pagination - changed from 9 to 6 clinics per page (2 rows of 3)
  const clinicsPerPage = 6;
  const totalPages = Math.ceil(filteredClinics.length / clinicsPerPage);

  // Get current page clinics
  const indexOfLastClinic = currentPage * clinicsPerPage;
  const indexOfFirstClinic = indexOfLastClinic - clinicsPerPage;
  const currentClinics = filteredClinics.slice(
    indexOfFirstClinic,
    indexOfLastClinic
  );

  // Handle clinic detail navigation
  const handleClinicDetail = (id: number) => {
    navigate(`/clinics/${id}`);
  };

  return (
    <div className={styles.container}>
      <div className="flex justify-between items-center mb-8">
        <ContentHeader title="Danh sách phòng khám thú y" level="h1" />
        <Filter filters={filterConfigs} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {currentClinics.map((clinic) => (
          <div
            key={clinic.id}
            className="cursor-pointer transition-transform transform hover:scale-[0.99]"
            onClick={() => handleClinicDetail(clinic.id)}
          >
            <Card
              type="clinic"
              image={clinic.image || "/clinic-default.jpg"}
              title={clinic.name}
              location={clinic.location}
              rating={clinic.rating}
              phone={clinic.phone}
              hours={clinic.hours}
              price={clinic.price}
              buttonText="Chi tiết"
              onButtonClick={(e) => {
                e.stopPropagation();
                handleClinicDetail(clinic.id);
              }}
            />
          </div>
        ))}
      </div>

      {/* Show message if no clinics match filters */}
      {currentClinics.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">
            Không tìm thấy phòng khám phù hợp với tiêu chí
          </p>
          <p className="text-gray-500">Vui lòng thử lại với bộ lọc khác</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
