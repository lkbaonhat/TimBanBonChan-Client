import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Heart,
  MessageCircle,
  Calendar,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import Card from "@/components/Card/Card";
import { userService } from "@/services/userService";
import { AxiosResponse } from "axios";

// Define types for our data
interface UserProfile {
  id: string;
  name: string;
  fullName: string;
  username: string;
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
  isVerified: boolean;
  roles: string[];
  currentPets: Pet[];
  adoptionHistory: AdoptionHistory[];
  petCareSkills: PetCareSkill[];
  isCurrentUser: boolean;
}

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  imageUrl: string;
  slug: string;
}

interface AdoptionHistory {
  id: string;
  petName: string;
  petType: string;
  date: string;
  status: string;
  imageUrl: string;
}

interface PetCareSkill {
  id: string;
  name: string;
  level: number; // 1-5 scale
  description: string;
}

// API Response type based on your userService API
interface ApiUserResponse {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  profilePicture: string | null;
  isVerified: boolean;
  roles: string[];
  // Add other fields that might be returned
  dateOfBirth?: string;
  address?: string;
  occupation?: string;
  bio?: string;
  interests?: string;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ApiUserResponse;
  detailErrors: any;
}

export default function ProfileDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isContacting, setIsContacting] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  // Current user info
  const currentUserLogin = "lkbaonhat";

  // Function to get primary role
  const getPrimaryRole = (roles: string[]): string => {
    if (roles.length === 0) return "Khách";
    const rolePriority = ["Pet Foster", "Volunteer", "Guest"];
    for (const role of rolePriority) {
      if (roles.includes(role)) return role;
    }
    return roles[0];
  };

  // Function to get role display in Vietnamese
  const getRoleDisplay = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      "Pet Foster": "Người nuôi dưỡng",
      Volunteer: "Tình nguyện viên",
      Guest: "Khách",
      Staff: "Nhân viên",
      Admin: "Quản trị viên",
    };
    return roleMap[role] || role;
  };

  // Function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  // Function to format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  // Mock data for pets and adoption history (since API might not provide this)
  const mockCurrentPets: Pet[] = [
    {
      id: "1",
      name: "Mochi",
      type: "Chó",
      breed: "Corgi",
      age: "2 tuổi",
      imageUrl: "/placeholder.svg?height=100&width=100",
      slug: "mochi-corgi-2-tuoi",
    },
    {
      id: "2",
      name: "Luna",
      type: "Mèo",
      breed: "Munchkin",
      age: "1 tuổi",
      imageUrl: "/placeholder.svg?height=100&width=100",
      slug: "luna-munchkin-1-tuoi",
    },
  ];

  const mockAdoptionHistory: AdoptionHistory[] = [
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
  ];

  const mockPetCareSkills: PetCareSkill[] = [
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
  ];

  // Fetch user profile from API using the ID parameter
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!id) {
        setError("ID người dùng không hợp lệ");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        let response: AxiosResponse<ApiResponse>;

        if (id) {
          // Assuming current user ID is 6 based on your data
          response = await userService.getSelfInfo(id);
        } else {
          // For other users, you might need a different API call
          // This is a placeholder - replace with actual API call
          throw new Error(
            "Cannot fetch other users profile yet - API method needed"
          );
        }

        const apiResponse = response.data;

        if (!apiResponse.success) {
          throw new Error(
            apiResponse.message || "Failed to fetch user profile"
          );
        }

        const userData = apiResponse.data;
        const primaryRole = getPrimaryRole(userData.roles);
        const secondaryRoles = userData.roles.filter(
          (role) => role !== primaryRole
        );
        const isCurrentUser = userData.username === currentUserLogin;

        // Transform API data to match our component's expected structure
        const transformedProfile: UserProfile = {
          id: userData.userId.toString(),
          name: userData.fullName || userData.username,
          fullName: userData.fullName || userData.username,
          username: userData.username,
          role: getRoleDisplay(primaryRole),
          secondaryRole:
            secondaryRoles.length > 0
              ? getRoleDisplay(secondaryRoles[0])
              : undefined,
          birthDate: userData.dateOfBirth
            ? formatDate(userData.dateOfBirth)
            : "Chưa cập nhật",
          email: userData.email,
          phone: userData.phoneNumber || "Chưa cập nhật",
          address: userData.address || userData.city || "Chưa cập nhật",
          occupation: userData.occupation || "Chưa cập nhật",
          bio: userData.bio || "Chưa có thông tin giới thiệu",
          interests: userData.interests || "Chưa cập nhật sở thích",
          imageUrl:
            userData.profilePicture || "/placeholder.svg?height=200&width=200",
          isVerified: userData.isVerified,
          roles: userData.roles,
          currentPets: mockCurrentPets, // Use mock data for now
          adoptionHistory: mockAdoptionHistory, // Use mock data for now
          petCareSkills: mockPetCareSkills, // Use mock data for now
          isCurrentUser,
        };

        setUserProfile(transformedProfile);
      } catch (err: any) {
        console.error("Error fetching user profile:", err);

        // Handle different types of axios errors
        if (err.response) {
          const status = err.response.status;
          const data = err.response.data;

          if (status === 401) {
            setError("Bạn cần đăng nhập để xem thông tin này.");
          } else if (status === 403) {
            setError("Bạn không có quyền truy cập thông tin này.");
          } else if (status === 404) {
            setError("Không tìm thấy thông tin người dùng.");
          } else if (status >= 500) {
            setError("Lỗi server. Vui lòng thử lại sau.");
          } else {
            setError(data?.message || `Lỗi HTTP ${status}`);
          }
        } else if (err.request) {
          setError(
            "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
          );
        } else {
          setError(err.message || "Đã xảy ra lỗi không xác định.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]); // Add id to dependency array

  // Handler for pet card actions
  const handleViewPetDetails = (pet: Pet) => {
    // Navigate to UpdatePetInfo with read-only mode using slug
    navigate(`/profile/pets/${pet.slug}?mode=view`);
  };

  // Handler for adoption history view
  const handleViewAdoptionDetails = (historyId: string) => {
    console.log(`View adoption details for ID: ${historyId}`);
  };

  // Retry function
  const handleRetry = async () => {
    if (!id) return;

    setError(null);
    setLoading(true);

    try {
      let response: AxiosResponse<ApiResponse>;

      if (id) {
        response = await userService.getSelfInfo(id);
      } else {
        throw new Error(
          "Cannot fetch other users profile yet - API method needed"
        );
      }

      const apiResponse = response.data;

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to fetch user profile");
      }

      const userData = apiResponse.data;
      const primaryRole = getPrimaryRole(userData.roles);
      const secondaryRoles = userData.roles.filter(
        (role) => role !== primaryRole
      );
      const isCurrentUser = userData.username === currentUserLogin;

      const transformedProfile: UserProfile = {
        id: userData.userId.toString(),
        name: userData.fullName || userData.username,
        fullName: userData.fullName || userData.username,
        username: userData.username,
        role: getRoleDisplay(primaryRole),
        secondaryRole:
          secondaryRoles.length > 0
            ? getRoleDisplay(secondaryRoles[0])
            : undefined,
        birthDate: userData.dateOfBirth
          ? formatDate(userData.dateOfBirth)
          : "Chưa cập nhật",
        email: userData.email,
        phone: userData.phoneNumber || "Chưa cập nhật",
        address: userData.address || userData.city || "Chưa cập nhật",
        occupation: userData.occupation || "Chưa cập nhật",
        bio: userData.bio || "Chưa có thông tin giới thiệu",
        interests: userData.interests || "Chưa cập nhật sở thích",
        imageUrl:
          userData.profilePicture || "/placeholder.svg?height=200&width=200",
        isVerified: userData.isVerified,
        roles: userData.roles,
        currentPets: mockCurrentPets,
        adoptionHistory: mockAdoptionHistory,
        petCareSkills: mockPetCareSkills,
        isCurrentUser,
      };

      setUserProfile(transformedProfile);
    } catch (err: any) {
      console.error("Retry error:", err);
      setError(err.message || "Thử lại không thành công");
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tìm nhà mới cho bé", path: "/find-new-home" },
    { label: userProfile?.name || "Đang tải..." },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFEDFA]">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#FF99C0] mx-auto mb-4"></div>
              <p className="text-gray-600">
                Đang tải thông tin người dùng (ID: {id})...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#FFEDFA]">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-red-500 text-xl mb-4">⚠️ Lỗi tải dữ liệu</div>
            <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
            <p className="text-sm text-gray-500 mb-4">ID người dùng: {id}</p>
            <button
              onClick={handleRetry}
              className="px-6 py-3 bg-[#FF99C0] text-white rounded-lg hover:bg-[#FF99C0]/80 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Profile not found
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-[#FFEDFA]">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-gray-500 text-xl mb-4">
              👤 Không tìm thấy thông tin
            </div>
            <p className="text-gray-600">
              Không tìm thấy thông tin người dùng với ID: {id}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
            {/* Verified badge */}
            {userProfile.isVerified && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                ✓ Đã xác thực
              </div>
            )}
            {/* Current user indicator */}
            {userProfile.isCurrentUser && (
              <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                🏠 Hồ sơ của bạn
              </div>
            )}
          </div>

          {/* Profile Content */}
          <div className="p-6 md:p-8 pt-20 relative z-10">
            <div className="">
              <h1 className="text-[#0053A3] font-bold text-3xl md:text-4xl mt-8 mb-2">
                {userProfile.name}
              </h1>
              <div className="text-gray-600">
                <p className="text-sm text-gray-500 mb-2">
                  @{userProfile.username}
                </p>
                <div className="flex gap-2 flex-wrap">
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
            </div>
          </div>

          {/* Profile Content - Adjusted top padding */}
          <div className=" relative z-10 w-full ">
            {/* Tab Navigation */}
            <div className="flex border-b border-gray-200 mb-8 overflow-x-auto justify-around">
              <button
                className={`py-4 px-6 text-base font-medium border-b-2 whitespace-nowrap ${
                  activeTab === "personal"
                    ? "border-[#FF99C0] text-[#FF99C0]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setActiveTab("personal")}
              >
                Thông tin cá nhân
              </button>
              <button
                className={`py-4 px-6 text-base font-medium border-b-2 whitespace-nowrap ${
                  activeTab === "pets"
                    ? "border-[#0053A3] text-[#0053A3]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                } transition-colors`}
                onClick={() => setActiveTab("pets")}
              >
                Thú cưng đang nuôi
              </button>
              <button
                className={`py-4 px-6 text-base font-medium border-b-2 whitespace-nowrap ${
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
                {/* Personal Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm transform transition-transform ">
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

                    <div className="flex items-start">
                      <div className="bg-[#FF99C0] p-2 rounded-full mr-4">
                        <Calendar className="text-white" size={18} />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">Ngày sinh</h3>
                        <p className="text-gray-600">{userProfile.birthDate}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job & Personal Details */}
                <div className="bg-white rounded-xl p-6 shadow-sm transform transition-transform ">
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
                <div className="bg-white rounded-xl p-6 shadow-sm transform transition-transform ">
                  <div className="space-y-6">
                    <p className="text-gray-600 italic">"{userProfile.bio}"</p>
                  </div>

                  {/* <div className="mt-6">
                    <Button
                      variant={isContacting ? "outline" : "pink"}
                      shape="pill"
                      animation="none"
                      onClick={() => setIsContacting(!isContacting)}
                      className="w-full"
                      disabled={userProfile.isCurrentUser}
                    >
                      <MessageCircle className="mr-2" size={18} />
                      {userProfile.isCurrentUser
                        ? "Đây là hồ sơ của bạn"
                        : isContacting
                        ? "Đang liên hệ..."
                        : "Liên hệ ngay"}
                    </Button>
                  </div> */}
                </div>
              </div>
            )}

            {/* Current Pets Tab */}
            {activeTab === "pets" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                  {userProfile.currentPets.length > 0 ? (
                    userProfile.currentPets.map((pet) => (
                      <div
                        key={pet.id}
                        className="transform transition-transform "
                      >
                        <Card
                          type="pet"
                          image={pet.imageUrl}
                          title={pet.name}
                          badge={pet.type}
                          gender={pet.age}
                          location={pet.breed}
                          buttonText="Xem chi tiết"
                          onButtonClick={() => handleViewPetDetails(pet)}
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
                  {/* <ContentHeader title="Lịch sử nhận nuôi" level="h2" /> */}

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                    {userProfile.adoptionHistory.length > 0 ? (
                      userProfile.adoptionHistory.map((history) => (
                        <div
                          key={history.id}
                          className="transform transition-transform "
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
                {/* <div className="mt-12">
                  <ContentHeader title="Kỹ năng nuôi thú cưng" level="h2" />

                  <div className="rounded-xl ">
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
                </div> */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
