import PetCareHandbook from "./components/PetCareHandbook";
import VeterinaryClinics from "./components/VeterinaryClinics";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";

export default function PetCare() {
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Sổ tay chăm sóc thú cưng" },
  ];

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Pet Care Handbook Section */}
      <PetCareHandbook />

      {/* Veterinary Clinics Section */}
      <VeterinaryClinics />
    </div>
  );
}
