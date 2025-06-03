import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Search,
  ShoppingCart,
  Phone,
  Bell,
  User,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";
import { LOGO } from "@/constants/global";
import ROUTES from "@/constants/routes";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import styles from "./header.module.scss";
import { toast } from "sonner";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Get authentication state from Redux
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );

  // Get user data from localStorage if available
  const getUserData = () => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    return null;
  };

  const userData = getUserData();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    // Update Redux state
    dispatch({
      type: "LOGOUT",
      callback: (isSuccess: boolean): void => {
        if (isSuccess) {
          toast.success("Đăng xuất thành công");
          navigate(ROUTES.PUBLIC.HOME);
        }
      },
    });
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (userData?.fullName) {
      return userData.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    }
    return "U";
  };

  // Render auth button or user avatar based on authentication status
  const renderAuthSection = () => {
    if (isAuthenticated) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none" aria-label="User menu">
              <Avatar className="h-10 w-10 cursor-pointer border-2 border-white hover:border-blue-200 transition-all">
                <AvatarImage
                  src={userData?.avatarUrl || "/placeholder.svg"}
                  alt={userData?.fullName || "User"}
                />
                <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-medium">
                  {userData?.fullName || "Người dùng"}
                </span>
                <span className="text-xs text-gray-500 truncate">
                  {userData?.email || ""}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Hồ sơ cá nhân</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <Link
        to={ROUTES.PUBLIC.SIGNIN}
        aria-label="Account"
        className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center"
      >
        <User size={18} className="mr-2" />
        <span>Đăng nhập</span>
      </Link>
    );
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-[#FFEDFA] py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={LOGO.WITH_TEXT || "/placeholder.svg"}
              alt="Tìm Bạn Bốn Chân"
              className="h-24 w-auto"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/120x50?text=Logo";
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className={`hidden md:flex items-center space-x-4 ${styles.navbar}`}
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition-all duration-200 font-bold ${
                  isActive
                    ? "active"
                    : "text-gray-700 hover:text-white hover:bg-pink-300"
                }`
              }
            >
              Trang chủ
            </NavLink>
            <NavLink
              to="/community"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition-all duration-200 font-bold ${
                  isActive
                    ? "active"
                    : "text-gray-700 hover:text-white hover:bg-pink-300"
                }`
              }
            >
              Cộng đồng
            </NavLink>
            <NavLink
              to="/adopt"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition-all duration-200 font-bold ${
                  isActive
                    ? "active"
                    : "text-gray-700 hover:text-white hover:bg-pink-300"
                }`
              }
            >
              Nhận nuôi bé cưng
            </NavLink>
            <NavLink
              to="/search"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition-all duration-200 font-bold ${
                  isActive
                    ? "active"
                    : "text-gray-700 hover:text-white hover:bg-pink-300"
                }`
              }
            >
              Tìm nhà cho bé yêu
            </NavLink>
            <NavLink
              to="/care"
              className={({ isActive }) =>
                `px-4 py-2 rounded-full transition-all duration-200 font-bold ${
                  isActive
                    ? "active"
                    : "text-gray-700 hover:text-white hover:bg-pink-300"
                }`
              }
            >
              Sổ tay chăm sóc
            </NavLink>
          </nav>

          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-1">
            <button
              aria-label="Search"
              className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200"
            >
              <Search size={20} />
            </button>
            <button
              aria-label="Cart"
              className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200"
            >
              <ShoppingCart size={20} />
            </button>
            <button
              aria-label="Contact"
              className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200"
            >
              <Phone size={20} />
            </button>
            <button
              aria-label="Notifications"
              className="p-2 text-gray-700 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-all duration-200"
            >
              <Bell size={20} />
            </button>
            {renderAuthSection()}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              aria-label="Search"
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors mr-1"
            >
              <Search size={20} />
            </button>
            {isAuthenticated && (
              <div className="mr-2">{renderAuthSection()}</div>
            )}
            <button
              className="p-2 text-gray-700 ml-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 bg-white rounded-xl shadow-lg animate-fade-down">
            <nav className="flex flex-col space-y-1 px-4">
              <Link
                to="/community"
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Cộng đồng
              </Link>
              <Link
                to="/adopt"
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Nhận nuôi bé cưng
              </Link>
              <Link
                to="/find-new-home"
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Tìm nhà cho bé yêu
              </Link>
              <Link
                to="/pet-care"
                className="px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                Sổ tay chăm sóc các bé
              </Link>

              <div className="flex justify-between pt-4 border-t border-gray-100 mt-2">
                <button
                  aria-label="Cart"
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <ShoppingCart size={20} />
                </button>
                <button
                  aria-label="Contact"
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Phone size={20} />
                </button>
                <button
                  aria-label="Notifications"
                  className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  <Bell size={20} />
                </button>
              </div>

              {!isAuthenticated && (
                <Link
                  to={ROUTES.PUBLIC.SIGNIN}
                  className="mt-3 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đăng nhập
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
