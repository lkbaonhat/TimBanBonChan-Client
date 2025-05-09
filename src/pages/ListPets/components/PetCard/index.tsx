import { Heart, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./pet-card.module.css";
import { useNavigate } from "react-router-dom";

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
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img
          src={pet.imageUrl || "/placeholder.svg"}
          alt={pet.name}
          className={styles.image}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{pet.name}</h3>
          <span className={styles.chip}>Chó</span>
        </div>

        <div className={styles.details}>
          <div className={styles.detailItem}>
            <Heart className={styles.icon} />
            <span>{pet.gender}</span>
          </div>

          <div className={styles.detailItem}>
            <Calendar className={styles.icon} />
            <span>{pet.status}</span>
          </div>

          <div className={styles.detailItem}>
            <MapPin className={styles.icon} />
            <span>{pet.location}</span>
          </div>
        </div>

        <Button
          className={styles.button}
          onClick={() => navigate(`/pets/${pet.id}`)}
        >
          Thông tin chi tiết
        </Button>
      </div>
    </div>
  );
}
