import { useLocation, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { PawPrint, Users, ClipboardCheck, Settings, LogOut, LayoutDashboard, BarChart, FileText, ShieldCheck, LucideIcon, ChartArea, UserCheck, UserPlus, ChevronDown, ChevronUp, CheckSquare } from 'lucide-react'

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
  SidebarMenuSub,
  SidebarMenuSubItem,
} from '../ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import ROUTES from '@/constants/routes'
import { LOGO } from '@/constants/global'
import { useDispatch } from 'react-redux'

// Define navigation item type
type NavItem = {
  title: string;
  path: string;
  icon: LucideIcon;
  subItems?: NavItem[];
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
      label: 'Tổng quan',
      items: [
        {
          title: 'Thống kê',
          path: ROUTES.STAFF.HOME,
          icon: ChartArea,
        },
      ],
    }, {
      label: 'Quản lý',
      items: [
        {
          title: 'Thú cưng',
          path: ROUTES.STAFF.MANAGE_PETS,
          icon: PawPrint,
        },
        {
          title: 'Xác minh thú cưng',
          path: ROUTES.STAFF.VERIFY_PETS,
          icon: CheckSquare,
        },
        {
          title: 'Xác minh người dùng',
          path: ROUTES.STAFF.VERIFY_USER,
          icon: CheckSquare,
        },
        {
          title: 'Tình nguyện viên',
          path: ROUTES.STAFF.MANAGE_VOLUNTEERS,
          icon: Users,
          subItems: [
            {
              title: 'Chính thức',
              path: ROUTES.STAFF.MANAGE_VOLUNTEERS,
              icon: UserCheck,
            },
            {
              title: 'Đơn đăng ký',
              path: `${ROUTES.STAFF.MANAGE_VOLUNTEERS}/applications`,
              icon: UserPlus,
            },
          ]
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
        }, {
          title: 'Người dùng',
          path: '/admin/users',
          icon: Users,
        }, {
          title: 'Tình nguyện viên',
          path: '/admin/volunteers',
          icon: Users,
          subItems: [
            {
              title: 'TNV đang hoạt động',
              path: '/admin/volunteers/active',
              icon: UserCheck,
            },
            {
              title: 'Đơn đăng ký',
              path: '/admin/volunteers/applications',
              icon: UserPlus,
            },
          ]
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
  const dispatch = useDispatch()
  const pathname = location.pathname
  const navigation = navigationConfig[role] || navigationConfig.staff
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  // Auto-expand items based on current path
  useEffect(() => {
    // Find parent items that should be expanded based on current route
    navigation.forEach(group => {
      group.items.forEach(item => {
        if (item.subItems &&
          (pathname.startsWith(item.path) ||
            item.subItems.some(sub => pathname.startsWith(sub.path)))) {
          if (!expandedItems.includes(item.path)) {
            setExpandedItems(prev => [...prev, item.path])
          }
        }
      })
    })
  }, [pathname, navigation, expandedItems])

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" })
  }


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
                {group.items.map((item) => (<SidebarMenuItem key={item.path}>
                  {!item.subItems ? (
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
                  ) : (
                    <Collapsible
                      defaultOpen
                      className="group/collapsible"
                    >
                      <div className="flex items-center w-full">
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            asChild
                            isActive={pathname.startsWith(item.path)}
                            tooltip={item.title}
                            className="flex-grow"
                          >
                            <Link to={item.path}>
                              <item.icon className="text-xl" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                      </div>
                      <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden">
                        <div className="pl-6 mt-1 py-1" key={item.path}>
                          {item.subItems.map(subItem => (
                            <SidebarMenuSub>
                              <SidebarMenuSubItem>
                                <SidebarMenuButton
                                  key={subItem.path}
                                  asChild
                                  isActive={pathname === subItem.path}
                                  tooltip={subItem.title}
                                  className="mb-1"
                                >
                                  <Link to={subItem.path}>
                                    <subItem.icon className="h-4 w-4" />
                                    <span className="text-sm">{subItem.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
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
              <button onClick={handleLogout} className='hover:cursor-pointer'>
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}