import { useState } from "react";
import { PetCard } from "../PetCard";
import { PetFilters } from "../PetFilter";
import { Pagination } from "../Pagination";
import styles from "./pet-gallery.module.css";

// Import pet images
import dannyImg from "../../../../../public/Danny.png";
import divaImg from "../../../../../public/Danny.png";
import maxImg from "../../../../../public/Danny.png";
import hildaImg from "../../../../../public/Danny.png";
import fritzImg from "../../../../../public/Danny.png";
import beautyImg from "../../../../../public/Danny.png";

export default function PetGallery() {
  const [currentPage, setCurrentPage] = useState(1);

  const pets: Pet[] = [
    {
      id: 1,
      name: "Danny",
      gender: "Đực",
      location: "Đồng Nai",
      status: "Trưởng thành",
      imageUrl: dannyImg,
    },
    {
      id: 2,
      name: "Diva",
      gender: "Cái",
      location: "Đồng Nai",
      status: "Trưởng thành",
      imageUrl: divaImg,
    },
    {
      id: 3,
      name: "Max",
      gender: "Đực",
      location: "Đồng Nai",
      status: "Trưởng thành",
      imageUrl: maxImg,
    },
    {
      id: 4,
      name: "Hilda",
      gender: "Cái",
      location: "Đồng Nai",
      status: "Trưởng thành",
      imageUrl: hildaImg,
    },
    {
      id: 5,
      name: "Fritz",
      gender: "Đực",
      location: "Đồng Nai",
      status: "Trưởng thành",
      imageUrl: fritzImg,
    },
    {
      id: 6,
      name: "Beauty",
      gender: "Cái",
      location: "Đồng Nai",
      status: "Trưởng thành",
      imageUrl: beautyImg,
    },
  ];

  return (
    <div className={styles.container}>
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-8">Làm quen với các bé</h1>

        <PetFilters />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {pets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={3}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
