"use client";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Heart,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import Card from "@/components/Card/Card";

// Define types for our data
interface UserProfile {
  id: string;
  name: string;
  fullName: string;
  role: string;
  secondaryRole?: string;
  birthDate: string;
  email: string;
  phone: string;
  address: string;
  occupation: string;
  bio: string;
  interests: string;
  imageUrl: string;
  currentPets: Pet[];
  adoptionHistory: AdoptionHistory[];
  petCareSkills: PetCareSkill[]; // Added pet care skills
}

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  imageUrl: string;
}

interface AdoptionHistory {
  id: string;
  petName: string;
  petType: string;
  date: string;
  status: string;
  imageUrl: string;
}

// Add PetCareSkill interface
interface PetCareSkill {
  id: string;
  name: string;
  level: number; // 1-5 scale
  description: string;
}

// Sample data - in a real app, you would fetch this from an API
const userProfile: UserProfile = {
  id: "3",
  name: "Siriana Pham",
  fullName: "Phạm Thị Phương Diệp",
  role: "Người nhận nuôi",
  secondaryRole: "Tình nguyện viên",
  birthDate: "09/04/2001",
  email: "sirianapham@gmail.com",
  phone: "09.xxx.xxx",
  address: "58/41 Origami Vinhomes GrandPark, Long Bình, Thủ Đức, TP HCM",
  occupation: "Sinh viên",
  bio: "Yêu mèo, thích ghét sự gấp đôi",
  interests: "Ô nhạc, đọc sách, nấu ăn",
  imageUrl: "/placeholder.svg?height=200&width=200",
  currentPets: [
    {
      id: "1",
      name: "Mochi",
      type: "Chó",
      breed: "Corgi",
      age: "2 tuổi",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      name: "Luna",
      type: "Mèo",
      breed: "Munchkin",
      age: "1 tuổi",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
  ],
  adoptionHistory: [
    {
      id: "1",
      petName: "Buddy",
      petType: "Chó",
      date: "15/03/2022",
      status: "Thành công",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
    {
      id: "2",
      petName: "Kitty",
      petType: "Mèo",
      date: "20/06/2023",
      status: "Thành công",
      imageUrl: "/placeholder.svg?height=100&width=100",
    },
  ],
  petCareSkills: [
    {
      id: "1",
      name: "Huấn luyện cơ bản",
      level: 4,
      description: "Có khả năng dạy các lệnh cơ bản như ngồi, nằm, đứng yên",
    },
    {
      id: "2",
      name: "Chăm sóc y tế",
      level: 3,
      description: "Có kinh nghiệm cung cấp thuốc, sơ cứu cơ bản cho thú cưng",
    },
    {
      id: "3",
      name: "Chăm sóc lông",
      level: 5,
      description: "Thành thạo việc tắm, chải lông và vệ sinh cho thú cưng",
    },
  ],
};

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const [isContacting, setIsContacting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal"); // 'personal', 'pets', or 'history'

  // In a real app, you would fetch the profile based on the ID
  // For now, we'll just use our sample data

  // Handler for pet card actions
  const handleViewPetDetails = (petId: string) => {
    console.log(`View details for pet with ID: ${petId}`);
  };

  // Handler for adoption history view
  const handleViewAdoptionDetails = (historyId: string) => {
    console.log(`View adoption details for ID: ${historyId}`);
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tìm nhà mới cho bé", path: "/find-new-home" },
    { label: userProfile.name },
  ];

  return (
    <div className="min-h-screen bg-[#FFEDFA]">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto  py-6">
        <div className="bg-white rounded-xl overflow-hidden shadow-md relative">
          {/* Decorative circles to match home page style */}
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-[#C5E2F0] opacity-70 rounded-full z-0 hidden md:block"></div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#FF99C0] opacity-60 rounded-full z-0 hidden md:block"></div>

          {/* Profile Banner */}
          <div className="h-48 bg-gradient-to-r from-[#C5E2F0] to-[#FF99C0]/40 relative">
            <div className="absolute -bottom-16 left-8">
              <Avatar className="h-32 w-32 border-4 border-white shadow-md">
                <AvatarImage
                  src={userProfile.imageUrl}
                  alt={userProfile.name}
                />
                <AvatarFallback>
                  {userProfile.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-6 md:p-8 pt-20 relative z-10">
            <div className="mb-6">
              <ContentHeader
                title={userProfile.name}
                level="h1"
                className="text-[#0053A3]"
              />
              <div className="text-gray-600 mt-1 flex gap-2">
                <span className="bg-[#FF99C0]/30 px-3 py-1 rounded-full text-[#FF99C0] text-sm font-medium">
                  {userProfile.role}
                </span>
                {userProfile.secondaryRole && (
                  <span className="bg-blue-100 px-3 py-1 rounded-full text-[#0053A3] text-sm font-medium">
                    {userProfile.secondaryRole}
                  </span>
                )}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-8">
              <button
                className={`py-4 px-6 text-base font-medium border-b-2 ${
                  activeTab === "personal"
                    ? "border-[#FF99C0] text-[#FF99C0]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setActiveTab("personal")}
              >
                Thông tin cá nhân
              </button>
              <button
                className={`py-4 px-6 text-base font-medium border-b-2 ${
                  activeTab === "pets"
                    ? "border-[#0053A3] text-[#0053A3]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setActiveTab("pets")}
              >
                Thú cưng đang nuôi
              </button>
              <button
                className={`py-4 px-6 text-base font-medium border-b-2 ${
                  activeTab === "history"
                    ? "border-[#FF99C0] text-[#FF99C0]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setActiveTab("history")}
              >
                Tiểu sử nhận nuôi
              </button>
            </div>

            {/* Personal Information Tab */}
            {activeTab === "personal" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Personal Information */}
                <div className="bg-pink-50 rounded-xl p-6 shadow-sm transform transition-transform hover:scale-[1.01]">
                  <ContentHeader
                    title="Thông tin cá nhân"
                    level="h2"
                    className="mb-6 text-[#FF99C0]"
                  />

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-[#FF99C0] p-2 rounded-full mr-4">
                        <MapPin className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Địa chỉ</h3>
                        <p className="text-gray-600">{userProfile.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-[#FF99C0] p-2 rounded-full mr-4">
                        <Mail className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Email</h3>
                        <p className="text-gray-600">{userProfile.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-[#FF99C0] p-2 rounded-full mr-4">
                        <Phone className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Số điện thoại</h3>
                        <p className="text-gray-600">{userProfile.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job & Personal Details */}
                <div className="bg-blue-50 rounded-xl p-6 shadow-sm transform transition-transform hover:scale-[1.01]">
                  <ContentHeader
                    title="Thông tin thêm"
                    level="h2"
                    className="mb-6 text-[#0053A3]"
                  />

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-[#0053A3] p-2 rounded-full mr-4">
                        <Briefcase className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Nghề nghiệp</h3>
                        <p className="text-gray-600">
                          {userProfile.occupation}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="bg-[#0053A3] p-2 rounded-full mr-4">
                        <Heart className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Sở thích</h3>
                        <p className="text-gray-600">{userProfile.interests}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-pink-50 rounded-xl p-6 shadow-sm transform transition-transform hover:scale-[1.01]">
                  <ContentHeader
                    title="Giới thiệu bản thân"
                    level="h2"
                    className="mb-6 text-[#FF99C0]"
                  />

                  <div className="space-y-6">
                    <p className="text-gray-600 italic">"{userProfile.bio}"</p>
                  </div>

                  <div className="mt-6">
                    <Button
                      variant={isContacting ? "outline" : "pink"}
                      shape="pill"
                      animation="none"
                      onClick={() => setIsContacting(!isContacting)}
                      className="w-full"
                    >
                      <MessageCircle className="mr-2" size={18} />
                      {isContacting ? "Đang liên hệ..." : "Liên hệ ngay"}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Current Pets Tab */}
            {activeTab === "pets" && (
              <div>
                <ContentHeader
                  title="Thú cưng đang nuôi"
                  level="h2"
                  className="mb-8 text-[#0053A3]"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {userProfile.currentPets.length > 0 ? (
                    userProfile.currentPets.map((pet) => (
                      <div
                        key={pet.id}
                        className="transform transition-transform hover:scale-[0.98]"
                      >
                        <Card
                          type="pet"
                          image={pet.imageUrl}
                          title={pet.name}
                          badge={pet.type}
                          gender={pet.age}
                          location={pet.breed}
                          buttonText="Xem chi tiết"
                          onButtonClick={() => handleViewPetDetails(pet.id)}
                        />
                      </div>
                    ))
                  ) : (
                    <p className="col-span-3 text-center text-gray-500 italic py-8">
                      Chưa có thông tin về thú cưng đang nuôi
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Adoption History Tab */}
            {activeTab === "history" && (
              <div className="space-y-12">
                {/* Adoption History */}
                <div>
                  <ContentHeader
                    title="Lịch sử nhận nuôi"
                    level="h2"
                    className="mb-8 text-[#FF99C0]"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProfile.adoptionHistory.length > 0 ? (
                      userProfile.adoptionHistory.map((history) => (
                        <div
                          key={history.id}
                          className="transform transition-transform hover:scale-[0.98]"
                        >
                          <Card
                            type="pet"
                            image={history.imageUrl}
                            title={history.petName}
                            badge={history.status}
                            gender={history.petType}
                            location={history.date}
                            buttonText="Xem chi tiết"
                            onButtonClick={() =>
                              handleViewAdoptionDetails(history.id)
                            }
                          />
                        </div>
                      ))
                    ) : (
                      <p className="col-span-3 text-center text-gray-500 italic py-8">
                        Chưa có lịch sử nhận nuôi thú cưng
                      </p>
                    )}
                  </div>
                </div>

                {/* Pet Care Skills */}
                <div className="mt-12">
                  <ContentHeader
                    title="Kỹ năng nuôi thú cưng"
                    level="h2"
                    className="mb-8 text-[#0053A3]"
                  />

                  <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
                    {userProfile.petCareSkills.length > 0 ? (
                      <div className="space-y-4">
                        {userProfile.petCareSkills.map((skill) => (
                          <div
                            key={skill.id}
                            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-[#0053A3]">
                                {skill.name}
                              </h4>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-2 rounded-full ${
                                      i < skill.level
                                        ? "bg-[#0053A3]"
                                        : "bg-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {skill.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 italic py-8">
                        Chưa có thông tin về kỹ năng nuôi thú cưng
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
