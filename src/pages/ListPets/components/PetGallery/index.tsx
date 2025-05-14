import { useState } from "react";
import { PetCard } from "../PetCard";
import PageHeader from "@/components/ContentHeader/ContentHeader";
import Filter, { FilterConfig } from "@/components/Filter/Filter";
import Pagination from "@/components/Pagination/Pagination";
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
  const [petType, setPetType] = useState("all");
  const [age, setAge] = useState("all");
  const [gender, setGender] = useState("all");

  // Define filter configurations
  const filterConfigs: FilterConfig[] = [
    {
      id: "petType",
      placeholder: "Loại",
      value: petType,
      onChange: setPetType,
      options: [
        { id: "all", label: "Tất cả", value: "all" },
        { id: "dog", label: "Chó", value: "dog" },
        { id: "cat", label: "Mèo", value: "cat" },
      ],
    },
    {
      id: "age",
      placeholder: "Tuổi",
      value: age,
      onChange: setAge,
      options: [
        { id: "all", label: "Tất cả", value: "all" },
        { id: "puppy", label: "Nhỏ", value: "puppy" },
        { id: "adult", label: "Trưởng thành", value: "adult" },
        { id: "senior", label: "Già", value: "senior" },
      ],
    },
    {
      id: "gender",
      placeholder: "Giới tính",
      value: gender,
      onChange: setGender,
      options: [
        { id: "all", label: "Tất cả", value: "all" },
        { id: "male", label: "Đực", value: "male" },
        { id: "female", label: "Cái", value: "female" },
      ],
    },
  ];

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

  // Apply filters
  const filteredPets = pets.filter((pet) => {
    if (petType !== "all" && pet.gender !== petType) return false;
    if (age !== "all" && pet.status !== age) return false;
    if (gender !== "all" && pet.gender !== gender) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredPets.length / 6);

  return (
    <div className={styles.container}>
      <div className="flex justify-between items-center mb-8">
        <PageHeader title="Làm quen với các bé" />
        <Filter filters={filterConfigs} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredPets
          .slice((currentPage - 1) * 6, currentPage * 6)
          .map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
      </div>

      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
