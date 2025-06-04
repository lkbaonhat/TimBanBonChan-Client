import { useNavigate } from "react-router-dom";
import Card from "@/components/Card/Card";
import styles from "./pet-card.module.css";
import { PetCardData } from "@/types/Pet";

interface PetCardProps {
  pet: PetCardData;
}

export function PetCard({ pet }: PetCardProps) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    console.log("pet slug:", pet.slug); // Debugging line

    navigate(`/pets/${pet.slug}`); // Fix navigation path
  };

  return (
    <Card
      type="pet"
      image={pet.imageUrl}
      title={pet.name}
      badge={pet.categoryName || "Thú cưng"}
      gender={pet.gender}
      location={pet.status}
      area={pet.location}
      buttonText="Thông tin chi tiết"
      onButtonClick={handleButtonClick}
      className={styles.card}
    />
  );
}
