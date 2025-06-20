import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import Card from "@/components/Card/Card";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import Pagination from "@/components/Pagination/Pagination";
import Filter, { FilterConfig } from "@/components/Filter/Filter";
import { useNavigate } from "react-router-dom";
import { userService } from "@/services/userService";
import { AxiosResponse } from "axios";

// Define types for our data
interface AdopterProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  occupation?: string;
  imageUrl: string;
  verified?: boolean;
  role?: string;
}

// API Response type based on your actual API structure
interface ApiUser {
  userId: number;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  city: string;
  profilePicture: string | null;
  isVerified: boolean;
  roles: string[];
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

export default function FindNewHome() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [profiles, setProfiles] = useState<AdopterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();

  // Function to check if user has Staff or Admin role
  const hasStaffOrAdminRole = (roles: string[]): boolean => {
    return roles.some((role) => role === "Staff" || role === "Admin");
  };

  // Function to calculate age from birthDate
  const calculateAge = (birthDate: string): number | string => {
    console.log(birthDate)
    if (!birthDate) {
      return "Chưa cập nhật";
    }

    try {
      const birth = new Date(birthDate);

      // Check if birthDate is valid
      if (isNaN(birth.getTime())) {
        return "Chưa cập nhật";
      }

      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      // Adjust age if birthday hasn't occurred this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      // Return "Chưa cập nhật" for unrealistic ages
      if (age < 0 || age > 150) {
        return "Chưa cập nhật";
      }

      return age;
    } catch (error) {
      console.error("Error calculating age:", error);
      return "Chưa cập nhật";
    }
  };


  // Function to get primary role (excluding Staff and Admin)
  const getPrimaryRole = (roles: string[]): string => {
    if (roles.length === 0) return "Guest";
    // Priority order for roles (excluding Staff and Admin)
    const rolePriority = ["Pet Foster", "Volunteer", "Guest"];
    for (const role of rolePriority) {
      if (roles.includes(role)) return role;
    }
    // If only Staff/Admin roles exist, return the first available role
    return (
      roles.find((role) => role !== "Staff" && role !== "Admin") || "Guest"
    );
  };

  // Function to get role display in Vietnamese
  const getRoleDisplay = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      "Pet Foster": "Người nuôi dưỡng",
      Volunteer: "Tình nguyện viên",
      Guest: "Khách",
    };
    return roleMap[role] || role;
  };

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        // Since you're using axios, the response will be an AxiosResponse object
        const response: AxiosResponse<ApiResponse> =
          await userService.getAllUser();

        // With axios, the data is in response.data
        const apiResponse = response.data;

        if (!apiResponse.success) {
          throw new Error(apiResponse.message || "Failed to fetch users");
        }

        const users = apiResponse.data.items;

        // Filter out users with Staff or Admin roles
        const filteredUsers = users.filter(
          (user) => !hasStaffOrAdminRole(user.roles)
        );

        setTotalCount(filteredUsers.length); // Use filtered count instead of API total

        const transformedProfiles: AdopterProfile[] = filteredUsers.map((user) => {
          const primaryRole = getPrimaryRole(user.roles);
          return {
            id: user.userId.toString(),
            name: user.fullName || user.username,
            age: calculateAge(user.birthDate),
            location: user.city || "Chưa cập nhật",
            occupation: getRoleDisplay(primaryRole),
            imageUrl: user.profilePicture || "/placeholder.svg?height=200&width=200",
            verified: user.isVerified,
            role: primaryRole,
          };
        });

        setProfiles(transformedProfiles);
      } catch (err: any) {
        console.error("Error fetching users:", err);

        // Handle different types of axios errors
        if (err.response) {
          // Server responded with error status
          const status = err.response.status;
          const data = err.response.data;

          if (status === 401) {
            setError("Bạn cần đăng nhập để xem danh sách này.");
          } else if (status === 403) {
            setError("Bạn không có quyền truy cập danh sách này.");
          } else if (status === 404) {
            setError("Không tìm thấy dữ liệu người dùng.");
          } else if (status >= 500) {
            setError("Lỗi server. Vui lòng thử lại sau.");
          } else {
            setError(data?.message || `Lỗi HTTP ${status}`);
          }
        } else if (err.request) {
          // Network error
          setError(
            "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
          );
        } else {
          // Other error
          setError(err.message || "Đã xảy ra lỗi không xác định.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter configurations (removed Staff and Admin from role filter)
  const filterConfigs: FilterConfig[] = [
    {
      id: "sortFilter",
      placeholder: "Sắp xếp",
      value: filter,
      onChange: setFilter,
      options: [
        { id: "all", label: "Tất cả", value: "all" },
        { id: "name", label: "Theo tên", value: "name" },
        { id: "verified", label: "Đã xác thực", value: "verified" },
        { id: "age", label: "Theo tuổi", value: "age" },
        { id: "current-user", label: "Ưu tiên tôi", value: "current-user" },
      ],
    },
    {
      id: "ageFilter",
      placeholder: "Độ tuổi",
      value: ageFilter,
      onChange: setAgeFilter,
      options: [
        { id: "all", label: "Mọi người", value: "all" },
        { id: "18-25", label: "18-25 tuổi", value: "18-25" },
        { id: "26-35", label: "26-35 tuổi", value: "26-35" },
        { id: "36+", label: "36+ tuổi", value: "36+" },
      ],
    },
    {
      id: "locationFilter",
      placeholder: "Địa điểm",
      value: locationFilter,
      onChange: setLocationFilter,
      options: [
        { id: "all", label: "Mọi địa điểm", value: "all" },
        { id: "hanoi", label: "Hà Nội", value: "hanoi" },
        { id: "hcm", label: "TP HCM / Hồ Chí Minh", value: "hcm" },
        { id: "danang", label: "Đà Nẵng", value: "danang" },
        { id: "empty", label: "Chưa cập nhật", value: "empty" },
      ],
    },
  ];

  // Enhanced filtering logic
  const filteredProfiles = profiles.filter((profile) => {
    // Role filter
    if (roleFilter !== "all" && profile.role !== roleFilter) {
      return false;
    }

    // Location filter
    if (locationFilter !== "all") {
      if (locationFilter === "empty") {
        if (
          profile.location !== "Chưa cập nhật" &&
          profile.location.trim() !== ""
        ) {
          return false;
        }
      } else {
        const locationMatch = {
          hanoi: ["hà nội", "hanoi", "ha noi"],
          hcm: [
            "tp hcm",
            "hồ chí minh",
            "ho chi minh",
            "tphcm",
            "saigon",
            "sài gòn",
          ],
          danang: ["đà nẵng", "da nang", "danang"],
        };

        const matchTerms =
          locationMatch[locationFilter as keyof typeof locationMatch];
        if (
          matchTerms &&
          !matchTerms.some((term) =>
            profile.location.toLowerCase().includes(term)
          )
        ) {
          return false;
        }
      }
    }

    // Age filter
    if (ageFilter !== "all") {
      const [min, max] = ageFilter.includes("+")
        ? [parseInt(ageFilter), 100]
        : ageFilter.split("-").map(Number);

      if (profile.age < min || profile.age > (max || 100)) return false;
    }

    // Verified filter
    if (filter === "verified" && !profile.verified) {
      return false;
    }

    return true;
  });

  // Apply sorting
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    switch (filter) {
      case "name":
        return a.name.localeCompare(b.name, "vi");
      case "age":
        return a.age - b.age;
      case "verified":
        if (a.verified && !b.verified) return -1;
        if (!a.verified && b.verified) return 1;
        return a.name.localeCompare(b.name, "vi");
      default:
        return 0;
    }
  });

  // Pagination logic
  const profilesPerPage = 6;
  const totalPages = Math.ceil(sortedProfiles.length / profilesPerPage);
  const indexOfLastProfile = currentPage * profilesPerPage;
  const indexOfFirstProfile = indexOfLastProfile - profilesPerPage;
  const currentProfiles = sortedProfiles.slice(
    indexOfFirstProfile,
    indexOfLastProfile
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, ageFilter, locationFilter, roleFilter]);

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Tìm nhà mới cho bé" },
  ];

  // Navigate to profile detail
  const handleProfileDetail = (id: string) => {
    navigate(`/find-new-home/${id}`);
  };

  // Retry function
  const handleRetry = async () => {
    setError(null);
    setLoading(true);

    // Re-run the fetch logic
    try {
      const response: AxiosResponse<ApiResponse> =
        await userService.getAllUser();
      const apiResponse = response.data;

      if (!apiResponse.success) {
        throw new Error(apiResponse.message || "Failed to fetch users");
      }

      const users = apiResponse.data.items;

      // Filter out users with Staff or Admin roles
      const filteredUsers = users.filter(
        (user) => !hasStaffOrAdminRole(user.roles)
      );

      setTotalCount(filteredUsers.length);

      // Transform API data to match our component's expected structure
      const transformedProfiles: AdopterProfile[] = filteredUsers.map((user) => {
        const primaryRole = getPrimaryRole(user.roles);
        console.log(user)
        return {
          id: user.userId.toString(),
          name: user.fullName || user.username,
          age: calculateAge(user.birthDate),
          location: user.city || "Chưa cập nhật",
          occupation: getRoleDisplay(primaryRole),
          imageUrl: user.profilePicture || "/placeholder.svg?height=200&width=200",
          verified: user.isVerified,
          role: primaryRole,
        };
      });

      setProfiles(transformedProfiles);
    } catch (err: any) {
      console.error("Retry error:", err);
      setError(err.message || "Thử lại không thành công");
    } finally {
      setLoading(false);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilter("all");
    setAgeFilter("all");
    setLocationFilter("all");
    setRoleFilter("all");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto">
          <ContentHeader title="Tìm nhà mới cho bé" level="h1" />
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Đang tải danh sách người có thể nhận nuôi...
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
      <div className="min-h-screen">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4">
          <ContentHeader title="Tìm nhà mới cho bé" level="h1" />
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-red-500 text-xl mb-4">⚠️ Lỗi tải dữ liệu</div>
            <p className="text-gray-600 mb-4 text-center max-w-md">{error}</p>
            <button
              onClick={handleRetry}
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
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      <div className="container mx-auto ">
        {/* Header and Filter Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <ContentHeader title="Tìm nhà mới cho bé" level="h1" />
          <Filter filters={filterConfigs} className="mt-4 md:mt-0" />
        </div>

        {/* Results count */}
        <div className="mb-4 text-gray-600">
          Hiển thị {currentProfiles.length} trong tổng số{" "}
          {sortedProfiles.length} người có thể nhận nuôi
          {sortedProfiles.length !== profiles.length && (
            <span className="text-blue-600 ml-1">
              (đã lọc từ {totalCount} người dùng phù hợp)
            </span>
          )}
        </div>


        {/* Profile Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {currentProfiles.map((profile) => (
            <div
              key={profile.id}
              className={`transform transition-transform hover:scale-[0.98] ${
                profile.isCurrentUser
                  ? "ring-2 ring-blue-400 ring-opacity-50"
                  : ""
              }`}

            >
              <Card
                type="person"
                image={profile.imageUrl}
                title={
                  profile.isCurrentUser ? `${profile.name} (Bạn)` : profile.name
                }

                gender={`${profile.age} tuổi`}
                location={profile.location}
                area={profile.occupation || ""}
                badge={profile.verified ? "✓ Đã xác thực" : "Chưa xác thực"}
                buttonText={
                  profile.isCurrentUser ? "Xem hồ sơ của tôi" : "Xem chi tiết"
                }

                onButtonClick={() => handleProfileDetail(profile.id)}
              />
            </div>
          ))}
        </div>

        {/* No results after filtering */}
        {sortedProfiles.length === 0 && profiles.length > 0 && (
          <div className="flex flex-col justify-center items-center h-64">
            <div className="text-gray-500 text-xl mb-4">
              🔍 Không tìm thấy kết quả
            </div>
            <p className="text-gray-600 text-center mb-4">
              Không có người dùng nào phù hợp với bộ lọc đã chọn.
              <br />
              Thử thay đổi bộ lọc để xem thêm kết quả.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 mb-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
