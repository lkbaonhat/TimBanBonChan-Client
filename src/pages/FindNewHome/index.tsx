import { useState, useEffect, useMemo } from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Card from "@/components/Card/Card";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import Pagination from "@/components/Pagination/Pagination";
import Filter, { FilterConfig } from "@/components/Filter/Filter";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/userService";
import { AxiosResponse } from "axios";
import { SectionLoading } from "@/components/Loading";

// Cải thiện type definitions
interface AdopterProfile {
  id: string;
  name: string;
  age: number;
  ageDisplay: string;
  location: string; // Changed from address to location to match actual data
  occupation: string; // Nghề nghiệp thực tế
  occupationCategory: string; // Danh mục nghề nghiệp để filter
  imageUrl: string;
  verified?: boolean;
  role?: string; // Role hệ thống (Pet Foster, Volunteer, Guest)
  isCurrentUser?: boolean;
}

interface ApiUser {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  profilePicture: string | null;
  isVerified: boolean;
  birthDate: string;
  roles: string[];
  occupation?: string; // Giả sử API có field này
  jobTitle?: string; // Hoặc field này
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    items: ApiUser[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
  detailErrors: any;
}

// Utility functions
const hasStaffOrAdminRole = (roles: string[]): boolean => {
  return roles.some((role) => role === "Staff" || role === "Admin");
};

const calculateAge = (
  birthDate: string
): { numericAge: number; displayAge: string } => {
  if (!birthDate) {
    return { numericAge: 0, displayAge: "Chưa cập nhật" };
  }

  try {
    const birth = new Date(birthDate);
    const today = new Date();

    if (isNaN(birth.getTime())) {
      return { numericAge: 0, displayAge: "Chưa cập nhật" };
    }

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    if (age < 0 || age > 150) {
      return { numericAge: 0, displayAge: "Chưa cập nhật" };
    }

    return { numericAge: age, displayAge: `${age} tuổi` };
  } catch (error) {
    console.error("Error calculating age:", error);
    return { numericAge: 0, displayAge: "Chưa cập nhật" };
  }
};

const getPrimaryRole = (roles: string[]): string => {
  if (roles.length === 0) return "Guest";
  const rolePriority = ["Pet Foster", "Volunteer", "Guest"];
  return (
    rolePriority.find((role) => roles.includes(role)) ||
    roles.find((role) => role !== "Staff" && role !== "Admin") ||
    "Guest"
  );
};

const getRoleDisplay = (role: string): string => {
  const roleMap: Record<string, string> = {
    "Pet Foster": "Người nuôi dưỡng",
    Volunteer: "Tình nguyện viên",
    Guest: "Khách",
  };
  return roleMap[role] || role;
};

// Hàm phân loại nghề nghiệp và trả về danh mục
const categorizeOccupation = (
  occupation: string
): { category: string; display: string } => {
  if (!occupation || occupation.trim() === "") {
    return { category: "unknown", display: "Chưa cập nhật" };
  }

  const occupationLower = occupation.toLowerCase().trim();

  // Công nghệ thông tin
  const techKeywords = [
    "developer",
    "lập trình",
    "software",
    "it",
    "công nghệ",
    "tech",
    "engineer",
    "programmer",
    "coder",
    "web",
    "mobile",
    "fullstack",
    "backend",
    "frontend",
    "devops",
    "data",
    "ai",
    "machine learning",
    "blockchain",
    "cyber",
    "network",
    "system admin",
    "database",
    "qa",
    "tester",
    "ui",
    "ux",
    "designer",
  ];

  // Y tế - Sức khỏe
  const healthKeywords = [
    "bác sĩ",
    "doctor",
    "nurse",
    "y tá",
    "dược sĩ",
    "pharmacist",
    "dentist",
    "nha sĩ",
    "therapist",
    "điều dưỡng",
    "medical",
    "hospital",
    "clinic",
    "healthcare",
    "physiotherapist",
    "psychologist",
    "psychiatrist",
  ];

  // Giáo dục
  const educationKeywords = [
    "teacher",
    "giáo viên",
    "lecturer",
    "giảng viên",
    "professor",
    "giáo sư",
    "educator",
    "instructor",
    "tutor",
    "gia sư",
    "principal",
    "hiệu trưởng",
    "education",
    "training",
    "coach",
    "mentor",
  ];

  // Kinh doanh - Tài chính
  const businessKeywords = [
    "manager",
    "quản lý",
    "director",
    "giám đốc",
    "ceo",
    "business",
    "sales",
    "marketing",
    "finance",
    "tài chính",
    "accountant",
    "kế toán",
    "banker",
    "ngân hàng",
    "consultant",
    "analyst",
    "economy",
    "kinh tế",
    "entrepreneur",
    "startup",
    "investment",
    "đầu tư",
    "insurance",
    "bảo hiểm",
  ];

  // Dịch vụ - Bán hàng
  const serviceKeywords = [
    "customer service",
    "bán hàng",
    "cashier",
    "thu ngân",
    "waiter",
    "phục vụ",
    "bartender",
    "chef",
    "cook",
    "đầu bếp",
    "cleaner",
    "security",
    "bảo vệ",
    "driver",
    "tài xế",
    "delivery",
    "giao hàng",
    "receptionist",
    "lễ tân",
  ];

  // Nghệ thuật - Sáng tạo
  const creativeKeywords = [
    "artist",
    "nghệ sĩ",
    "designer",
    "thiết kế",
    "photographer",
    "nhiếp ảnh",
    "writer",
    "nhà văn",
    "journalist",
    "báo chí",
    "editor",
    "musician",
    "nhạc sĩ",
    "actor",
    "diễn viên",
    "painter",
    "họa sĩ",
    "creative",
    "content creator",
    "influencer",
    "blogger",
    "youtuber",
  ];

  // Kỹ thuật - Xây dựng
  const engineeringKeywords = [
    "engineer",
    "kỹ sư",
    "architect",
    "kiến trúc sư",
    "construction",
    "xây dựng",
    "mechanical",
    "electrical",
    "civil",
    "chemical",
    "industrial",
    "automotive",
    "technician",
    "kỹ thuật viên",
    "mechanic",
    "thợ máy",
    "plumber",
    "thợ ống nước",
    "electrician",
    "thợ điện",
    "carpenter",
    "thợ mộc",
  ];

  // Luật - Chính phủ
  const legalKeywords = [
    "lawyer",
    "luật sư",
    "judge",
    "thẩm phán",
    "attorney",
    "legal",
    "law",
    "government",
    "chính phủ",
    "police",
    "cảnh sát",
    "officer",
    "công chức",
    "civil servant",
    "diplomat",
    "ngoại giao",
    "military",
    "quân đội",
  ];

  // Học sinh - Sinh viên
  const studentKeywords = [
    "student",
    "học sinh",
    "sinh viên",
    "pupil",
    "learner",
    "undergraduate",
    "graduate",
    "postgraduate",
    "researcher",
    "nghiên cứu sinh",
    "intern",
    "thực tập sinh",
    "apprentice",
    "học việc",
  ];

  // Hưu trí - Không làm việc
  const retiredKeywords = [
    "retired",
    "hưu trí",
    "pension",
    "unemployed",
    "thất nghiệp",
    "homemaker",
    "nội trợ",
    "housewife",
    "stay at home",
    "freelancer",
    "tự do",
  ];

  // Kiểm tra từng danh mục
  if (techKeywords.some((keyword) => occupationLower.includes(keyword))) {
    return { category: "technology", display: occupation };
  }
  if (healthKeywords.some((keyword) => occupationLower.includes(keyword))) {
    return { category: "healthcare", display: occupation };
  }
  if (educationKeywords.some((keyword) => occupationLower.includes(keyword))) {
    return { category: "education", display: occupation };
  }
  if (businessKeywords.some((keyword) => occupationLower.includes(keyword))) {
    return { category: "business", display: occupation };
  }
  if (serviceKeywords.some((keyword) => occupationLower.includes(keyword))) {
    return { category: "service", display: occupation };
  }
  if (creativeKeywords.some((keyword) => occupationLower.includes(keyword))) {
    return { category: "creative", display: occupation };
  }
  if (
    engineeringKeywords.some((keyword) => occupationLower.includes(keyword))
  ) {
    return { category: "engineering", display: occupation };
  }
  if (legalKeywords.some((keyword) => occupationLower.includes(keyword))) {
    return { category: "legal", display: occupation };
  }
  if (studentKeywords.some((keyword) => occupationLower.includes(keyword))) {
    return { category: "student", display: occupation };
  }
  if (retiredKeywords.some((keyword) => occupationLower.includes(keyword))) {
    return { category: "retired", display: occupation };
  }

  // Nếu không khớp với danh mục nào, trả về "other"
  return { category: "other", display: occupation };
};

const getErrorMessage = (err: any): string => {
  if (err.response) {
    const status = err.response.status;
    const statusMessages: Record<number, string> = {
      401: "Bạn cần đăng nhập để xem danh sách này.",
      403: "Bạn không có quyền truy cập danh sách này.",
      404: "Không tìm thấy dữ liệu người dùng.",
    };

    if (status >= 500) return "Lỗi server. Vui lòng thử lại sau.";
    return (
      statusMessages[status] ||
      err.response.data?.message ||
      `Lỗi HTTP ${status}`
    );
  }

  if (err.request) {
    return "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.";
  }

  return err.message || "Đã xảy ra lỗi không xác định.";
};

// Custom hook để tách logic data fetching
const useUserProfiles = () => {
  const [profiles, setProfiles] = useState<AdopterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response: AxiosResponse<ApiResponse> =
        await userService.getAllUser();
      const apiResponse = response.data;

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to fetch users");
      }

      const users = apiResponse.data.items;
      const filteredUsers = users.filter(
        (user) => !hasStaffOrAdminRole(user.roles)
      );
      setTotalCount(filteredUsers.length);

      const transformedProfiles: AdopterProfile[] = filteredUsers.map(
        (user) => {
          const primaryRole = getPrimaryRole(user.roles);
          const ageData = calculateAge(user.birthDate);

          // Lấy nghề nghiệp thực tế từ API (giả sử có trong user.occupation hoặc user.jobTitle)
          const realOccupation =
            user.occupation || user.jobTitle || getRoleDisplay(primaryRole);
          const occupationData = categorizeOccupation(realOccupation);

          return {
            id: user.userId.toString(),
            name: user.fullName || user.username,
            age: ageData.numericAge,
            ageDisplay: ageData.displayAge,
            location: user.city || "Chưa cập nhật",
            occupation: user.occupation || "Chưa cập nhật", // Nghề nghiệp thực tế để hiển thị
            occupationCategory: occupationData.category, // Danh mục để filter
            imageUrl:
              user.profilePicture || "/placeholder.svg?height=200&width=200",
            verified: user.isVerified,
            role: primaryRole,
          };
        }
      );

      setProfiles(transformedProfiles);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return { profiles, loading, error, totalCount, fetchUsers };
};

// Custom hook for filters
const useFilters = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [ageFilter, setAgeFilter] = useState("all");
  const [occupationFilter, setOccupationFilter] = useState("all"); // Filter theo danh mục nghề nghiệp
  const [locationFilter, setLocationFilter] = useState("all");

  const clearAllFilters = () => {
    setAgeFilter("all");
    setOccupationFilter("all");
    setLocationFilter("all");
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [ageFilter, occupationFilter, locationFilter]);

  return {
    currentPage,
    setCurrentPage,
    ageFilter,
    setAgeFilter,
    occupationFilter,
    setOccupationFilter,
    locationFilter,
    setLocationFilter,
    clearAllFilters,
  };
};

// Enhanced filtering logic
const useProfileFiltering = (profiles: AdopterProfile[], filters: any) => {
  return useMemo(() => {
    const { ageFilter, occupationFilter, locationFilter } = filters;

    const filteredProfiles = profiles.filter((profile) => {
      // 1. Filter theo tuổi
      if (ageFilter !== "all") {
        if (ageFilter === "under-18") {
          if (profile.age >= 18) return false;
        } else if (ageFilter === "18-25") {
          if (profile.age < 18 || profile.age > 25) return false;
        } else if (ageFilter === "26-35") {
          if (profile.age < 26 || profile.age > 35) return false;
        } else if (ageFilter === "36-50") {
          if (profile.age < 36 || profile.age > 50) return false;
        } else if (ageFilter === "over-50") {
          if (profile.age <= 50) return false;
        } else if (ageFilter === "unknown") {
          if (profile.age !== 0) return false;
        }
      }

      // 2. Filter theo nghề nghiệp (danh mục)
      if (occupationFilter !== "all") {
        if (profile.occupationCategory !== occupationFilter) return false;
      }

      // 3. Filter theo vị trí địa lý
      if (locationFilter !== "all") {
        if (locationFilter === "hanoi") {
          const hanoiTerms = ["hà nội", "hanoi", "ha noi"];
          if (
            !hanoiTerms.some((term) =>
              profile.location.toLowerCase().includes(term)
            )
          )
            return false;
        } else if (locationFilter === "hcm") {
          const hcmTerms = [
            "tp hcm",
            "hồ chí minh",
            "ho chi minh",
            "tphcm",
            "saigon",
            "sài gòn",
          ];
          if (
            !hcmTerms.some((term) =>
              profile.location.toLowerCase().includes(term)
            )
          )
            return false;
        } else if (locationFilter === "danang") {
          const danangTerms = ["đà nẵng", "da nang", "danang"];
          if (
            !danangTerms.some((term) =>
              profile.location.toLowerCase().includes(term)
            )
          )
            return false;
        } else if (locationFilter === "can-tho") {
          const canthoTerms = ["cần thơ", "can tho", "cantho"];
          if (
            !canthoTerms.some((term) =>
              profile.location.toLowerCase().includes(term)
            )
          )
            return false;
        } else if (locationFilter === "hai-phong") {
          const haiphongTerms = ["hải phòng", "hai phong", "haiphong"];
          if (
            !haiphongTerms.some((term) =>
              profile.location.toLowerCase().includes(term)
            )
          )
            return false;
        } else if (locationFilter === "other") {
          const majorCities = [
            "hà nội",
            "hanoi",
            "ha noi",
            "tp hcm",
            "hồ chí minh",
            "ho chi minh",
            "tphcm",
            "saigon",
            "sài gòn",
            "đà nẵng",
            "da nang",
            "danang",
            "cần thơ",
            "can tho",
            "cantho",
            "hải phòng",
            "hai phong",
            "haiphong",
          ];
          if (
            profile.location === "Chưa cập nhật" ||
            majorCities.some((term) =>
              profile.location.toLowerCase().includes(term)
            )
          ) {
            return false;
          }
        } else if (locationFilter === "unknown") {
          if (profile.location !== "Chưa cập nhật") return false;
        }
      }

      return true;
    });

    // Sắp xếp theo tên (Vietnamese collation)
    const sortedProfiles = [...filteredProfiles].sort((a, b) => {
      // Ưu tiên current user lên đầu
      if (a.isCurrentUser && !b.isCurrentUser) return -1;
      if (!a.isCurrentUser && b.isCurrentUser) return 1;

      // Sau đó sắp xếp theo tên
      return a.name.localeCompare(b.name, "vi");
    });

    return sortedProfiles;
  }, [profiles, filters]);
};

export default function FindNewHome() {
  const navigate = useNavigate();
  const { profiles, loading, error, totalCount, fetchUsers } =
    useUserProfiles();
  const filters = useFilters();
  const sortedProfiles = useProfileFiltering(profiles, filters);

  // Load data on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Animation effect for page elements - only run once on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll(".fade-in-element");
      elements.forEach((element, index) => {
        setTimeout(() => {
          element.classList.remove("opacity-0");
          element.classList.add("opacity-100");
        }, index * 150);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [loading]); // Only re-run when loading state changes

  // Filter configurations theo nghề nghiệp thực tế
  const filterConfigs: FilterConfig[] = [
    {
      id: "ageFilter",
      placeholder: "Lọc theo tuổi",
      value: filters.ageFilter,
      onChange: filters.setAgeFilter,
      options: [
        { id: "all", label: "Tất cả độ tuổi", value: "all" },
        { id: "under-18", label: "Dưới 18 tuổi", value: "under-18" },
        { id: "18-25", label: "18-25 tuổi", value: "18-25" },
        { id: "26-35", label: "26-35 tuổi", value: "26-35" },
        { id: "36-50", label: "36-50 tuổi", value: "36-50" },
        { id: "over-50", label: "Trên 50 tuổi", value: "over-50" },
        { id: "unknown", label: "Chưa cập nhật tuổi", value: "unknown" },
      ],
    },
    {
      id: "occupationFilter",
      placeholder: "Lọc theo nghề nghiệp",
      value: filters.occupationFilter,
      onChange: filters.setOccupationFilter,
      options: [
        { id: "all", label: "Tất cả nghề nghiệp", value: "all" },
        { id: "technology", label: "Công nghệ thông tin", value: "technology" },
        { id: "healthcare", label: "Y tế - Sức khỏe", value: "healthcare" },
        { id: "education", label: "Giáo dục", value: "education" },
        { id: "business", label: "Kinh doanh - Tài chính", value: "business" },
        { id: "service", label: "Dịch vụ - Bán hàng", value: "service" },
        { id: "creative", label: "Nghệ thuật - Sáng tạo", value: "creative" },
        {
          id: "engineering",
          label: "Kỹ thuật - Xây dựng",
          value: "engineering",
        },
        { id: "legal", label: "Luật - Chính phủ", value: "legal" },
        { id: "student", label: "Học sinh - Sinh viên", value: "student" },
        { id: "retired", label: "Hưu trí - Tự do", value: "retired" },
        { id: "other", label: "Nghề khác", value: "other" },
        { id: "unknown", label: "Chưa cập nhật", value: "unknown" },
      ],
    },
    {
      id: "locationFilter",
      placeholder: "Lọc theo vị trí",
      value: filters.locationFilter,
      onChange: filters.setLocationFilter,
      options: [
        { id: "all", label: "Tất cả địa điểm", value: "all" },
        { id: "hanoi", label: "Hà Nội", value: "hanoi" },
        { id: "hcm", label: "TP. Hồ Chí Minh", value: "hcm" },
        { id: "danang", label: "Đà Nẵng", value: "danang" },
        { id: "can-tho", label: "Cần Thơ", value: "can-tho" },
        { id: "hai-phong", label: "Hải Phòng", value: "hai-phong" },
        { id: "other", label: "Tỉnh thành khác", value: "other" },
        { id: "unknown", label: "Chưa cập nhật", value: "unknown" },
      ],
    },
  ];

  // Pagination logic
  const profilesPerPage = 6;
  const totalPages = Math.ceil(sortedProfiles.length / profilesPerPage);
  const indexOfLastProfile = filters.currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = sortedProfiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tìm nhà mới cho bé" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto">
          <ContentHeader title="Tìm nhà mới cho bé" level="h1" />
          <SectionLoading text="Đang tải danh sách người có thể nhận nuôi..." />
        </div>
      </div>
    );
  }

  // Error component
  if (error) {
    return (
      <div className="min-h-screen">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4">
          <ContentHeader title="Tìm nhà mới cho bé" level="h1" />
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-red-500 text-xl mb-4">⚠️ Lỗi tải dữ liệu</div>
            <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
            <button
              onClick={fetchUsers}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (profiles.length === 0) {
    return (
      <div className="min-h-screen">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4">
          <ContentHeader title="Tìm nhà mới cho bé" level="h1" />
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-gray-500 text-xl mb-4">
              📭 Không có dữ liệu
            </div>
            <p className="text-gray-600">
              Hiện tại chưa có người dùng phù hợp để nhận nuôi thú cưng.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="fade-in-element opacity-0 transition-opacity duration-700">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <div className="container mx-auto ">
        {/* Header and Filter Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 fade-in-element opacity-0 transition-opacity duration-700">
          <ContentHeader title="Tìm nhà mới cho bé" level="h1" />

          {/* 3 filter riêng biệt */}
          <div className="flex flex-col sm:flex-row gap-1 w-full lg:w-auto">
            <Filter filters={[filterConfigs[0]]} />
            <Filter filters={[filterConfigs[1]]} />
            <Filter filters={[filterConfigs[2]]} />
          </div>
        </div>

        {/* Results count and clear filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
          {/* Nút xóa filter khi có filter được áp dụng */}
          {(filters.ageFilter !== "all" ||
            filters.occupationFilter !== "all" ||
            filters.locationFilter !== "all") && (
            <button
              onClick={filters.clearAllFilters}
              className="px-1 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 fade-in-element opacity-0 transition-opacity duration-700">
          {currentProfiles.map((profile) => (
            <div
              key={profile.id}
              className={`transform transition-all hover:scale-[0.98] duration-300`}
            >
              <Card
                type="person"
                image={profile.imageUrl}
                title={profile.name}
                gender={profile.ageDisplay}
                location={profile.occupation}
                area={profile.location} // Hiển thị nghề nghiệp thực tế
                badge={profile.verified ? "✓ Đã xác thực" : "Chưa xác thực"}
                buttonText={"Xem chi tiết"}
                onButtonClick={() => navigate(`/find-new-home/${profile.id}`)}
              />
            </div>
          ))}
        </div>

        {/* No results after filtering */}
        {sortedProfiles.length === 0 && profiles.length > 0 && (
          <div className="flex flex-col justify-center items-center h-64 fade-in-element opacity-0 transition-opacity duration-700">
            <div className="text-gray-500 text-xl mb-4">
              🔍 Không tìm thấy kết quả
            </div>
            <p className="text-gray-600 text-center mb-4">
              Không có người dùng nào phù hợp với bộ lọc đã chọn.
              <br />
              Thử thay đổi bộ lọc để xem thêm kết quả.
            </p>
            <button
              onClick={filters.clearAllFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 mb-12 fade-in-element opacity-0 transition-opacity duration-700">
            <Pagination
              currentPage={filters.currentPage}
              totalPages={totalPages}
              onPageChange={filters.setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
