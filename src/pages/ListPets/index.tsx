import React from "react";
import { Breadcrumb } from "./components/Breadcrumb";
import PetGallery from "./components/PetGallery";

export default function ListPets() {
  return (
    <main className="">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb />
        <PetGallery />
      </div>
    </main>
  );
}
