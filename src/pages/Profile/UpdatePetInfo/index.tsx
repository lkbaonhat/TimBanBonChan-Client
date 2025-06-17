import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ROUTES from "@/constants/routes";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PetProfile() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [petImage, setPetImage] = useState("/Danny.png");
  const [petName, setPetName] = useState("Cún Em");
  const [petBreed, setPetBreed] = useState("dog");
  const [petGender, setPetGender] = useState("female");
  const [petAge, setPetAge] = useState("2");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPetImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate(ROUTES.PUBLIC.PROFILE);
    }, 1000);
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tài khoản", path: ROUTES.PUBLIC.PROFILE },
    {
      label: "Chỉnh sửa thông tin thú cưng",
      path: `${ROUTES.PUBLIC.PROFILE}?tab=my-pets`,
    },
  ];

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto py-20">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-20  px-20">
            {/* Left side - Pet Photo */}
            <div className="w-full md:w-1/2">
              <div className="relative h-full  ">
                <img
                  src={petImage}
                  alt="Pet"
                  className="w-full h-full rounded-xl "
                  style={{ maxHeight: "500px", maxWidth: "600px" }}
                />
              </div>
            </div>

            {/* Right side - Form with 2x2 grid layout */}
            <div className="max-w-[750px] md:w-1/2 flex flex-col justify-center items-center">
              {/* Row 1 - Photo upload */}
              <div className="w-full mb-6 flex justify-end">
                <label
                  htmlFor="pet-image"
                  className="cursor-pointer p-2 rounded-full  flex items-center gap-2"
                >
                  <span className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                    Thêm ảnh thú cưng
                  </span>
                  <Camera className="h-5 w-5 text-gray-700" />
                  <input
                    id="pet-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {/* Row 2 & 3 - Form fields */}
              <div className="w-full grid grid-cols-2 gap-6">
                {/* Name */}
                <div className="flex items-center h-10">
                  <span className="text-gray-700 font-medium w-24">Tên</span>
                  <Input
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="flex-1 h-10"
                  />
                </div>

                {/* Breed */}
                <div className="flex items-center h-10">
                  <span className="text-gray-700 font-medium w-24">Giống</span>
                  <Select value={petBreed} onValueChange={setPetBreed}>
                    <SelectTrigger className="flex-1 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dog">Chó</SelectItem>
                      <SelectItem value="cat">Mèo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Age */}
                <div className="flex items-center h-10">
                  <span className="text-gray-700 font-medium w-24">Tuổi</span>
                  <Input
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    className="flex-1 h-10"
                  />
                </div>

                {/* Gender */}
                <div className="flex items-center h-10">
                  <span className="text-gray-700 font-medium w-24">
                    Giới tính
                  </span>
                  <Select value={petGender} onValueChange={setPetGender}>
                    <SelectTrigger className="flex-1 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Đực</SelectItem>
                      <SelectItem value="female">Cái</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 4 - Save Button */}
              <div className="mt-10 w-full flex items-center justify-center">
                <Button
                  type="submit"
                  variant="blue"
                  className="py-2"
                  shape="pill"
                  animation="none"
                  size="lg"
                  disabled={loading}
                >
                  {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
