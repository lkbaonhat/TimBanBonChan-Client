import React from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import PetGallery from "./components/PetGallery";

export default function ListPets() {
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Làm quen với các bé" },
  ];
  return (
    <main className="min-h-screen mb-10">
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto">
        <PetGallery />
      </div>
    </main>
  );
}
