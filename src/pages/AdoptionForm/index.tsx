import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import styles from "./adoption-form.module.css";

export default function AdoptionForm() {
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted");
  };

  return (
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
        <a href="/pets/danny" className={styles.breadcrumbLink}>
          Danny
        </a>
        <ChevronRight className={styles.breadcrumbIcon} />
        <span className={styles.breadcrumbCurrent}>Thủ tục nhận nuôi</span>
      </div>

      <h1 className={styles.title}>Thủ tục nhận nuôi</h1>

      <div className={styles.petProfile}>
        <div className={styles.petImageContainer}>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-f07DYWt177Xt7oILzAxIKwyHIqTMv8.png"
            alt="Danny"
            className={styles.petImage}
          />
        </div>
        <div className={styles.petInfo}>
          <h2 className={styles.petName}>Danny</h2>
          <div className={styles.petTags}>
            <span className={styles.tag}>Chó</span>
            <span className={styles.tagSeparator}>|</span>
            <span className={styles.tag}>Trưởng thành</span>
            <span className={styles.tagSeparator}>|</span>
            <span className={styles.tag}>Đực</span>
          </div>
          <div className={styles.petAttributes}>
            <span className={styles.attribute}>Đã tiêm phòng</span>
            <span className={styles.attributeSeparator}>•</span>
            <span className={styles.attribute}>Triệt sản</span>
          </div>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Thông tin người nhận nuôi</h3>
          <p className={styles.sectionDescription}>
            Vui lòng điền thông tin liên hệ của bạn
          </p>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input id="fullName" placeholder="VD: Nguyễn Văn X" />
            </div>

            <div className={styles.formField}>
              <Label htmlFor="birthDate">Ngày tháng năm sinh</Label>
              <Input id="birthDate" type="date" placeholder="DD/MM/YYYY" />
            </div>

            <div className={styles.formField}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="VD: nguyenvanx@gmail.com"
              />
            </div>

            <div className={styles.formField}>
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input id="phone" placeholder="VD: 09xxxxxxxx" />
            </div>
          </div>
        </section>

        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Thông tin nhà mới của bé</h3>

          <div className={styles.formGrid}>
            <div className={styles.formField}>
              <Label htmlFor="address">Địa chỉ</Label>
              <Input
                id="address"
                placeholder="VD: số đường Tôn Thất Tùng, Bến Thành, Quận 1, TP.HCM"
              />
            </div>

            <div className={styles.formField}>
              <Label htmlFor="homeType">Loại nhà</Label>
              <Select>
                <SelectTrigger id="homeType">
                  <SelectValue placeholder="Chung cư" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Chung cư</SelectItem>
                  <SelectItem value="house">Nhà riêng</SelectItem>
                  <SelectItem value="villa">Biệt thự</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className={styles.formField}>
            <Label>Nhà bạn hiện có thú cưng/vật nuôi nào không?</Label>
            <RadioGroup defaultValue="no" className={styles.radioGroup}>
              <div className={styles.radioOption}>
                <RadioGroupItem value="yes" id="hasPets-yes" />
                <Label htmlFor="hasPets-yes" className={styles.radioLabel}>
                  Có
                </Label>
              </div>
              <div className={styles.radioOption}>
                <RadioGroupItem value="no" id="hasPets-no" />
                <Label htmlFor="hasPets-no" className={styles.radioLabel}>
                  Không
                </Label>
              </div>
            </RadioGroup>
          </div>
        </section>

        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Kinh nghiệm nuôi thú cưng</h3>

          <div className={styles.formField}>
            <Label>Bạn từng nuôi thú cưng trước đây chưa</Label>
            <RadioGroup defaultValue="no" className={styles.radioGroup}>
              <div className={styles.radioOption}>
                <RadioGroupItem value="yes" id="hadPets-yes" />
                <Label htmlFor="hadPets-yes" className={styles.radioLabel}>
                  Rồi
                </Label>
              </div>
              <div className={styles.radioOption}>
                <RadioGroupItem value="no" id="hadPets-no" />
                <Label htmlFor="hadPets-no" className={styles.radioLabel}>
                  Chưa
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className={styles.formField}>
            <Label htmlFor="petCareExperience">
              Bạn có điều gì lo ngại về việc chăm sóc thú cưng không?
            </Label>
            <Textarea
              id="petCareExperience"
              placeholder="Hãy cho biết nếu bạn có lo ngại gì về việc chăm sóc thú cưng (nếu có...)"
              className={styles.textarea}
            />
          </div>

          <div className={styles.formField}>
            <Label htmlFor="petTrainingExperience">
              Bạn đã từng học tập về kiến thức chăm sóc thú cưng chưa?
            </Label>
            <Textarea
              id="petTrainingExperience"
              placeholder="Hãy cho biết nếu bạn có tìm hiểu gì về việc chăm sóc thú cưng (nếu có...)"
              className={styles.textarea}
            />
          </div>

          <div className={styles.formField}>
            <Label htmlFor="petCareTime">
              Bạn có thể dành thời gian để chăm sóc thú cưng nuôi bao nhiêu?
            </Label>
            <Textarea
              id="petCareTime"
              placeholder="Hãy cho biết nếu bạn có thể dành thời gian nào để chăm sóc thú cưng (nếu có...)"
              className={styles.textarea}
            />
          </div>

          <div className={styles.notice}>
            <p>
              Khi điền này đồng nghĩa với việc đồng ý với quy định viên đối
              tượng nuôi mới phải phòng vật nuôi khỏi bất kỳ tai nạn nào.
            </p>
          </div>
        </section>

        <section className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Cam kết chăm sóc thú cưng</h3>

          <div className={styles.commitmentList}>
            <p>Khi gửi đơn này tôi cam kết:</p>
            <ol className={styles.numberedList}>
              <li>Chăm sóc, đồng hành, chăm bảo đảm sự khỏe và thực đầy đủ</li>
              <li>Tạo môi trường an toàn và yêu thương cho thú cưng</li>
              <li>
                Không bỏ rơi hoặc hủy bỏ việc chăm sóc người khác mà không có sự
                đồng ý của tổ chức
              </li>
              <li>
                Chấp nhận sự theo dõi của đơn vị nhận nuôi trả về đại diện tham
                gia hỗ trợ
              </li>
            </ol>
          </div>

          <div className={styles.agreementCheckbox}>
            <Checkbox
              id="agreement"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(!!checked)}
            />
            <label htmlFor="agreement" className={styles.agreementLabel}>
              Tôi xác nhận đã đọc và đồng ý với tất cả điều khoản nhận nuôi
            </label>
          </div>
        </section>
        <div className="flex justify-center">
          <Button
            type="submit"
            className={styles.submitButton}
            disabled={!agreed}
          >
            Hoàn tất và gửi đơn nhận nuôi
          </Button>
        </div>
      </form>
    </div>
  );
}
