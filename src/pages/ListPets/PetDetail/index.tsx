import { useState } from "react";
import { Heart, Share2, Save, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import styles from "./pet-detail.module.css";
import { useNavigate, useParams } from "react-router-dom";
import ROUTES from "@/constants/routes";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";

export default function PetDetail() {
  const navigate = useNavigate();
  const param = useParams();

  // State for staff status - in a real app, this would come from auth context
  const [isStaff, setIsStaff] = useState(false);
  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // Pet details state
  const [petDetails, setPetDetails] = useState({
    breed: "Chó cỏ Việt Nam",
    healthStatus: "Tốt, tiêm vắc xin đầy đủ, đã triệt sản",
    weight: "Trung bình",
    personality: "Năng động, nhanh nhẹn, thân thiện",
    foodAndToys: "Ăn uống bình thường và thích đồ chơi, nhà có sẵn",
    suitableWith: "Chó, trẻ em/sinh viên, người trẻ tuổi",
    notSuitableWith: "Người bận rộn",
    location: "Đồng Nai",
  });

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setPetDetails({
      ...petDetails,
      [field]: value,
    });
  };

  // Handle form submission
  const handleSave = () => {
    // Here you would typically send the updated data to your API
    console.log("Saving updated pet details:", petDetails);
    setIsEditing(false);
  };

  // Toggle staff mode for testing purposes
  const toggleStaffMode = () => {
    setIsStaff(!isStaff);
    if (isEditing && !isStaff) {
      setIsEditing(false);
    }
  };

  // Define breadcrumb items
  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Làm quen với các bé", path: "/pets" },
    { label: "Danny" },
  ];

  return (
    <div className="container mx-auto">
      <Breadcrumb items={breadcrumbItems} />
      <div className={styles.container}>
        {/* Breadcrumb */}

        {/* Toggle Staff Mode Button (for demo purposes) */}
        <div className="mb-4 text-right">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleStaffMode}
            className="mb-4"
          >
            {isStaff ? "Switch to User Mode" : "Switch to Staff Mode"}
          </Button>

          {isStaff && (
            <Button
              variant="blue"
              size="sm"
              className="ml-2"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-1" /> Save
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </>
              )}
            </Button>
          )}
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
                <Button
                  variant="ghost"
                  size="icon"
                  className={styles.actionButton}
                  animation="none"
                >
                  <Heart className={styles.actionIcon} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={styles.actionButton}
                  animation="none"
                >
                  <Share2 className={styles.actionIcon} />
                </Button>
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
              {isEditing ? (
                // Editing mode - direct Input components
                <>
                  <div className={styles.infoRow}>
                    <label className={styles.infoLabel}>Giống</label>
                    <Input
                      className={styles.infoValue}
                      value={petDetails.breed}
                      onChange={(e) =>
                        handleInputChange("breed", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.infoRow}>
                    <label className={styles.infoLabel}>
                      Tình trạng Sức khỏe
                    </label>
                    <Input
                      className={styles.infoValue}
                      value={petDetails.healthStatus}
                      onChange={(e) =>
                        handleInputChange("healthStatus", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.infoRow}>
                    <label className={styles.infoLabel}>Cân nặng</label>
                    <Input
                      className={styles.infoValue}
                      value={petDetails.weight}
                      onChange={(e) =>
                        handleInputChange("weight", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.infoRow}>
                    <label className={styles.infoLabel}>Tính cách</label>
                    <Input
                      className={styles.infoValue}
                      value={petDetails.personality}
                      onChange={(e) =>
                        handleInputChange("personality", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.infoRow}>
                    <label className={styles.infoLabel}>
                      Thức ăn và đồ chơi
                    </label>
                    <Input
                      className={styles.infoValue}
                      value={petDetails.foodAndToys}
                      onChange={(e) =>
                        handleInputChange("foodAndToys", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.infoRow}>
                    <label className={styles.infoLabel}>Phù hợp với</label>
                    <Input
                      className={styles.infoValue}
                      value={petDetails.suitableWith}
                      onChange={(e) =>
                        handleInputChange("suitableWith", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.infoRow}>
                    <label className={styles.infoLabel}>
                      Không phù hợp với
                    </label>
                    <Input
                      className={styles.infoValue}
                      value={petDetails.notSuitableWith}
                      onChange={(e) =>
                        handleInputChange("notSuitableWith", e.target.value)
                      }
                    />
                  </div>

                  <div className={styles.infoRow}>
                    <label className={styles.infoLabel}>Địa chỉ</label>
                    <Input
                      className={styles.infoValue}
                      value={petDetails.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                    />
                  </div>
                </>
              ) : (
                // View mode - static text display
                <>
                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Giống</div>
                    <div className={styles.infoValue}>{petDetails.breed}</div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Tình trạng Sức khỏe</div>
                    <div className={styles.infoValue}>
                      {petDetails.healthStatus}
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Cân nặng</div>
                    <div className={styles.infoValue}>{petDetails.weight}</div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Tính cách</div>
                    <div className={styles.infoValue}>
                      {petDetails.personality}
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Thức ăn và đồ chơi</div>
                    <div className={styles.infoValue}>
                      {petDetails.foodAndToys}
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Phù hợp với</div>
                    <div className={styles.infoValue}>
                      {petDetails.suitableWith}
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Không phù hợp với</div>
                    <div className={styles.infoValue}>
                      {petDetails.notSuitableWith}
                    </div>
                  </div>

                  <div className={styles.infoRow}>
                    <div className={styles.infoLabel}>Địa chỉ</div>
                    <div className={styles.infoValue}>
                      {petDetails.location}
                    </div>
                  </div>
                </>
              )}
            </div>

            {isEditing ? (
              <div className="text-center mt-6">
                <Button
                  variant="blue"
                  shape="pill"
                  animation="none"
                  onClick={handleSave}
                >
                  Lưu thông tin
                </Button>
              </div>
            ) : (
              <div className={styles.buttonContainer}>
                <Button
                  variant="blue"
                  shape="default"
                  animation="none"
                  className="mr-4"
                >
                  Liên hệ trực tiếp
                </Button>
                <Button
                  variant="pink"
                  shape="default"
                  animation="none"
                  onClick={() =>
                    navigate(
                      ROUTES.PUBLIC.ADOPTION_FORM.replace(
                        ":id",
                        param?.id || ""
                      )
                    )
                  }
                >
                  Đăng ký thủ tục nhận nuôi
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
