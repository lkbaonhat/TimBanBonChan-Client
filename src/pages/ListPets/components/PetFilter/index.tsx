import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "./pet-filters.module.css";

export function PetFilters() {
  return (
    <div className={styles.filters}>
      <Select>
        <SelectTrigger className={styles.filter}>
          <SelectValue placeholder="Loại" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dog">Chó</SelectItem>
          <SelectItem value="cat">Mèo</SelectItem>
          <SelectItem value="all">Tất cả</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className={styles.filter}>
          <SelectValue placeholder="Tuổi" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="puppy">Nhỏ</SelectItem>
          <SelectItem value="adult">Trưởng thành</SelectItem>
          <SelectItem value="senior">Già</SelectItem>
          <SelectItem value="all">Tất cả</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className={styles.filter}>
          <SelectValue placeholder="Giới tính" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="male">Đực</SelectItem>
          <SelectItem value="female">Cái</SelectItem>
          <SelectItem value="all">Tất cả</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
