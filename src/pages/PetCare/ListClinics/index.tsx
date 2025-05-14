import React from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ClinicGallery from "./ClinicGallery";

export default function ListClinics() {
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Sổ tay chăm sóc thú cưng", path: "/pet-care" },
    { label: "Danh sách phòng khám" },
  ];

  return (
    <main className="min-h-screen mb-10">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto">
        <ClinicGallery />
      </div>
    </main>
  );
}
