import ROUTES from "@/constants/routes";
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle,
} from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";

type UserRole = "Guest" | "Staff" | "admin";

interface User {
  username: string;
  fullName: string;
  email: string;
  roles: UserRole[];
  profilePicture?: string;
}

interface UserDropDownProps {
  user: User;
  onClickLogout?: () => void;
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.STAFF.HOME,
    icon: LayoutDashboard,
    roles: ["Staff"],
  },
  {
    label: "Hồ sơ cá nhân",
    href: ROUTES.PUBLIC.PROFILE,
    icon: UserCircle,
    roles: ["Staff", "Guest"],
  },
  {
    label: "Đơn đăng ký của tôi",
    href: ROUTES.PRIVATE.MY_APPLICATION,
    icon: FileText,
    roles: ["Guest"],
  },
  {
    label: "Cài đặt",
    href: "/setting",
    icon: Settings,
    roles: ["Guest", "Staff"],
  },
];

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "Staff":
    case "Admin":
      return "bg-[#5B7CCB] text-white";
    default:
      return "bg-[#C4E2EF] text-[#0052A3]";
  }
};

const getRoleLabel = (role: string) => {
  switch (role) {
    case "Staff":
    case "Admin":
      return "Nhân viên";
    default:
      return "Người dùng";
  }
};

function UserDropDown({ user, onClickLogout }: UserDropDownProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const filteredMenuItems = menuItems.filter((item) => {
    if (!item.roles || !user?.roles?.length) return true;
    return item.roles.some((role) => user.roles.includes(role));
  });

  const handleItemClick = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  const goToProfile = () => {
    navigate(ROUTES.PUBLIC.PROFILE);
    setIsOpen(false);
  };

  if (!user || !user.roles?.length) {
    return null;
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild aria-label="User menu">
        <button className="relative h-10 w-10 rounded-full hover:bg-[#F1E9F2] transition-colors">
          <Avatar className="h-10 w-10 border-2 border-[#0052A3]/20 cursor-pointer">
            <AvatarImage src={user.profilePicture} alt={user.fullName} />
            <AvatarFallback className="bg-gradient-to-br from-[#126ac2] to-[#5B7CCB] text-white font-semibold">
              {user.fullName.split(" ").pop()?.charAt(0).toUpperCase() ||
                user.fullName.charAt(0).toUpperCase() ||
                "U"}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 p-0 shadow-xl border-0 bg-white/95 backdrop-blur-sm"
        align="end"
        sideOffset={8}
      >
        {/* User info header - Now clickable to go to profile */}
        <div
          className="p-4 cursor-pointer hover:opacity-95 transition-opacity"
          onClick={goToProfile}
        >
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 border-2 border-[#0052A3]/20">
              <AvatarImage src={user.profilePicture} alt={user.fullName} />
              <AvatarFallback className="bg-gradient-to-br from-[#126ac2] to-[#5B7CCB] text-white font-semibold">
                {user.fullName.split(" ").pop()?.charAt(0).toUpperCase() ||
                  user.fullName.charAt(0).toUpperCase() ||
                  "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 font-medium text-gray-700 ">
              <div className="flex items-center gap-2 ">
                <p className="">{user.fullName}</p>
              </div>
              <p className="text-sm truncate">{user.email}</p>
            </div>
          </div>
          <Badge
            className={`text-xs px-2 py-0.5 mt-2 ${getRoleBadgeColor(
              user.roles?.[0] || ""
            )}`}
          >
            {getRoleLabel(user.roles?.[0] || "")}
          </Badge>
        </div>

        <DropdownMenuSeparator className=" bg-gray-200" />

        {/* Menu Items */}
        <div className="p-2">
          {/* Profile menu item at the top */}
          <DropdownMenuItem
            className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
            onClick={() => handleItemClick(ROUTES.PUBLIC.PROFILE)}
          >
            <UserCircle className="h-4 w-4 text-[#0052A3] transition-transform duration-200 group-hover:scale-110" />
            <span className="font-medium text-gray-700 transition-colors duration-200 group-hover:text-[#0052A3]">
              Hồ sơ của tôi
            </span>
          </DropdownMenuItem>

          {filteredMenuItems.map((item, index) => {
            // Skip the profile item as we've added it manually at the top
            if (item.label === "Hồ sơ cá nhân") return null;

            const Icon = item.icon;
            const isStaffOnly =
              item.roles &&
              item.roles?.[0]?.includes("Staff") &&
              !item.roles?.[0]?.includes("Guest");

            return (
              <DropdownMenuItem
                key={index}
                className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors duration-200 group"
                onClick={() => handleItemClick(item.href)}
              >
                <Icon
                  className={`h-4 w-4 ${
                    isStaffOnly ? "text-[#5B7CCB]" : "text-[#0052A3]"
                  } transition-transform duration-200 group-hover:scale-110`}
                />
                <span className="font-medium text-gray-700 transition-colors duration-200 group-hover:text-[#0052A3]">
                  {item.label}
                </span>
                {isStaffOnly && (
                  <Badge
                    variant="outline"
                    className="ml-auto text-xs text-secondary border-secondary"
                  >
                    Staff
                  </Badge>
                )}
              </DropdownMenuItem>
            );
          })}

          {/* Logout */}
          <DropdownMenuItem
            className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-red-50 rounded-lg text-red-600 transition-colors duration-200 group"
            onClick={onClickLogout}
          >
            <LogOut className="h-4 w-4 transition-transform duration-200 group-hover:scale-110  text-red-600" />
            <span className="font-medium text-gray-700 transition-colors duration-200 group-hover:text-red-600">
              Đăng xuất
            </span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropDown;
