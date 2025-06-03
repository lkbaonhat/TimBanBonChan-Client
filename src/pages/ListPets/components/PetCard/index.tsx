import { useNavigate } from "react-router-dom";
import Card from "@/components/Card/Card";
import styles from "./pet-card.module.css";

interface PetCardProps {
  pet: Pet;
}

interface Pet {
  id: number;
  name: string;
  gender: string;
  location: string;
  status: string;
  imageUrl: string;
}

export function PetCard({ pet }: PetCardProps) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/pets/${pet.id}`);
  };

  return (
    <Card
      type="pet"
      image={pet.imageUrl}
      title={pet.name}
      badge="Chó"
      gender={pet.gender}
      location={pet.status}
      area={pet.location}
      buttonText="Thông tin chi tiết"
      onButtonClick={handleButtonClick}
      className={styles.card}
    />
  );
}
