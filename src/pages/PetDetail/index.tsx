import { Heart, Share2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./pet-detail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "@/constants/routes";

export default function PetDetail() {
  const navigate = useNavigate();
  const param = useParams();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <a href="/" className={styles.breadcrumbLink}>
            Trang chủ
          </a>
          <ChevronRight className={styles.breadcrumbIcon} />
          <a href="/pets" className={styles.breadcrumbLink}>
            Làm quen với các bé
          </a>
          <ChevronRight className={styles.breadcrumbIcon} />
          <span className={styles.breadcrumbCurrent}>Danny</span>
        </div>

        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <img
              src="../../../../../public/Danny.png"
              alt="Danny - Chó trưởng thành"
              className={styles.petImage}
            />
          </div>

          <div className={styles.details}>
            <div className={styles.titleRow}>
              <h1 className={styles.petName}>Danny</h1>
              <div className={styles.actions}>
                <button className={styles.actionButton}>
                  <Heart className={styles.actionIcon} />
                </button>
                <button className={styles.actionButton}>
                  <Share2 className={styles.actionIcon} />
                </button>
              </div>
            </div>

            <div className={styles.petTags}>
              <span className={styles.tag}>Chó</span>
              <span className={styles.tagSeparator}>|</span>
              <span className={styles.tag}>Trưởng thành</span>
              <span className={styles.tagSeparator}>|</span>
              <span className={styles.tag}>Đực</span>
            </div>

            <p className={styles.description}>
              Xin chào! Con là Danny, con là một chú chó nhỏ đang đợi một gia
              đình vui vẻ và luôn sẵn sàng chơi đùa cùng gia đình. Với sự trung
              thành và tràn đầy năng lượng, con sẽ mang đến niềm vui mỗi ngày!
              🐾
            </p>

            <h2 className={styles.sectionTitle}>Thông tin chi tiết</h2>

            <div className={styles.infoGrid}>
              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Giống</div>
                <div className={styles.infoValue}>Chó cỏ Việt Nam</div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Tình trạng Sức khỏe</div>
                <div className={styles.infoValue}>
                  Tốt, tiêm vắc xin đầy đủ, đã triệt sản
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Cân nặng</div>
                <div className={styles.infoValue}>Trung bình</div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Tính cách</div>
                <div className={styles.infoValue}>
                  Năng động, nhanh nhẹn, thân thiện
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Thức ăn và đồ chơi</div>
                <div className={styles.infoValue}>
                  Ăn uống bình thường và thích đồ chơi, nhà có sẵn
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Phù hợp với</div>
                <div className={styles.infoValue}>
                  Chó, trẻ em/sinh viên, người trẻ tuổi
                </div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Không phù hợp với</div>
                <div className={styles.infoValue}>Người bận rộn</div>
              </div>

              <div className={styles.infoRow}>
                <div className={styles.infoLabel}>Địa chỉ</div>
                <div className={styles.infoValue}>Đồng Nai</div>
              </div>
            </div>

            <div className={styles.buttonContainer}>
              <Button variant="default" className={styles.contactButton}>
                Liên hệ trực tiếp
              </Button>
              <Button
                variant="secondary"
                className={styles.adoptButton}
                onClick={() =>
                  navigate(
                    ROUTES.PUBLIC.ADOPTION_FORM.replace(":id", param?.id || "")
                  )
                }
              >
                Đăng ký thủ tục nhận nuôi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
