import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  BarChart3, 
  Users, 
  PiggyBank, 
  Settings, 
  Send,
  Clock,
  CheckCircle 
} from "lucide-react";

interface AdminSidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const AdminSidebar = ({ activeView, onViewChange }: AdminSidebarProps) => {
  const menuItems = [
    {
      title: "Overview",
      value: "overview",
      icon: BarChart3,
    },
    {
      title: "Pending Transactions",
      value: "pending-transactions",
      icon: Clock,
    },
    {
      title: "Completed Transactions",
      value: "completed-transactions",
      icon: CheckCircle,
    },
    {
      title: "Users",
      value: "users",
      icon: Users,
    },
    {
      title: "Investments",
      value: "investments",
      icon: PiggyBank,
    },
    {
      title: "Withdrawal Settings",
      value: "withdrawals",
      icon: Settings,
    },
    {
      title: "Broadcast Message",
      value: "broadcast",
      icon: Send,
    },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => onViewChange(item.value)}
                    data-active={activeView === item.value}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;