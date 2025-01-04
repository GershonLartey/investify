import {
  LayoutDashboard,
  BarChart2,
  Users,
  Package,
  MessageSquare,
  CreditCard,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"

const menuItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    title: "Statistics",
    icon: BarChart2,
    path: "/admin/statistics",
  },
  {
    title: "Customers",
    icon: Users,
    path: "/admin/customers",
  },
  {
    title: "Packages",
    icon: Package,
    path: "/admin/packages",
  },
  {
    title: "Messages",
    icon: MessageSquare,
    path: "/admin/messages",
  },
  {
    title: "Transactions",
    icon: CreditCard,
    path: "/admin/transactions",
  },
]

export function AdminSidebar() {
  const location = useLocation()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.path}
                    tooltip={item.title}
                  >
                    <Link to={item.path}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}