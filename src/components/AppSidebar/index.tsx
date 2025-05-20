import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import { PawPrint, Users, ClipboardCheck, Settings, LogOut, LayoutDashboard, BarChart, FileText, ShieldCheck, TypeIcon as type, LucideIcon } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar'
import ROUTES from '@/constants/routes'
import { LOGO } from '@/constants/global'

// Define navigation item type
type NavItem = {
  title: string;
  path: string;
  icon: LucideIcon;
}

// Define navigation group type
type NavGroup = {
  label: string;
  items: NavItem[];
}

// Define navigation configuration by role
const navigationConfig: Record<string, NavGroup[]> = {
  staff: [
    {
      label: 'Quản lý',
      items: [
        {
          title: 'Thú cưng',
          path: ROUTES.STAFF.MANAGE_PETS,
          icon: PawPrint,
        },
        {
          title: 'Cộng tác viên',
          path: '/staff/volunteers',
          icon: Users,
        },
        {
          title: 'Hồ sơ nhận nuôi',
          path: '/staff/adoptions',
          icon: ClipboardCheck,
        },
      ],
    },
    {
      label: 'Cài đặt',
      items: [
        {
          title: 'Cài đặt tài khoản',
          path: '/staff/settings',
          icon: Settings,
        },
      ],
    },
  ],
  admin: [
    {
      label: 'Tổng quan',
      items: [
        {
          title: 'Dashboard',
          path: '/admin/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Thống kê',
          path: '/admin/analytics',
          icon: BarChart,
        },
      ],
    },
    {
      label: 'Quản lý',
      items: [
        {
          title: 'Thú cưng',
          path: '/admin/pets',
          icon: PawPrint,
        },
        {
          title: 'Người dùng',
          path: '/admin/users',
          icon: Users,
        },
        {
          title: 'Hồ sơ nhận nuôi',
          path: '/admin/adoptions',
          icon: ClipboardCheck,
        },
        {
          title: 'Báo cáo',
          path: '/admin/reports',
          icon: FileText,
        },
      ],
    },
    {
      label: 'Hệ thống',
      items: [
        {
          title: 'Phân quyền',
          path: '/admin/permissions',
          icon: ShieldCheck,
        },
        {
          title: 'Cài đặt',
          path: '/admin/settings',
          icon: Settings,
        },
      ],
    },
  ],
}

interface AppSidebarProps {
  role: 'staff' | 'admin';
}

export function AppSidebar({ role = 'staff' }: AppSidebarProps) {
  const location = useLocation()
  const pathname = location.pathname
  const navigation = navigationConfig[role] || navigationConfig.staff

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 py-2 border-b">
          <img src={LOGO.NO_TEXT} alt='logo' className='w-20' />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {navigation.map((group, index) => (
          <SidebarGroup key={index}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.path}
                      tooltip={item.title}
                    >
                      <Link to={item.path}>
                        <item.icon className="text-xl" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/logout">
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}