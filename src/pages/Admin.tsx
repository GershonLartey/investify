import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "./Admin/hooks/useAdminData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader, Home, TrendingUp, User, Bell, Settings } from "lucide-react";
import AdminHeader from "./Admin/components/AdminHeader";
import TransactionList from "./Admin/components/TransactionList";
import UserTable from "./Admin/components/UserTable";
import InvestmentTable from "./Admin/components/InvestmentTable";
import WithdrawalSettings from "./Admin/components/WithdrawalSettings";
import BroadcastNotification from "./Admin/components/BroadcastNotification";
import DashboardOverview from "./Admin/components/DashboardOverview";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          navigate("/");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error || !profile || user.email !== "gpublic@bankify.com") {
          console.error("Admin access error:", error);
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page.",
            variant: "destructive",
          });
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking admin access:", error);
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminAccess();
  }, [navigate, toast]);

  const {
    users,
    transactions,
    investments,
    handleTransactionApproval,
    handleTransactionRejection,
    isError,
  } = useAdminData(isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Failed to load admin data. Please refresh the page to try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const sidebarItems = [
    { id: "overview", label: "Overview", icon: Home },
    { id: "transactions", label: "Transactions", icon: TrendingUp },
    { id: "users", label: "Users", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-sidebar text-sidebar-foreground fixed left-0 top-0">
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
            <nav className="space-y-6">
              <div>
                <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider text-gray-300">
                  Menu
                </h2>
                <div className="space-y-1">
                  {sidebarItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 text-left px-4 py-2 rounded-md transition-colors ${
                        activeTab === item.id
                          ? "bg-secondary/10 text-secondary"
                          : "hover:bg-white/10 text-white"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-64">
          <div className="p-8 max-w-[1920px] mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-2">
                Manage your platform's data and settings
              </p>
            </div>

            <AdminHeader 
              totalDeposits={transactions?.reduce((sum, t) => 
                t.type === 'deposit' && t.status === 'approved' ? sum + t.amount : sum, 0) || 0}
              totalWithdrawals={transactions?.reduce((sum, t) => 
                t.type === 'withdrawal' && t.status === 'approved' ? sum + t.amount : sum, 0) || 0}
              netBalance={transactions?.reduce((sum, t) => 
                t.status === 'approved' 
                  ? (t.type === 'deposit' ? sum + t.amount : sum - t.amount)
                  : sum, 0) || 0}
            />
            
            <div className="mt-8 space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsContent value="overview" className="m-0">
                  <DashboardOverview
                    transactions={transactions || []}
                    users={users || []}
                    investments={investments || []}
                  />
                </TabsContent>

                <TabsContent value="transactions" className="m-0">
                  <Card className="p-6">
                    <TransactionList
                      transactions={transactions || []}
                      onApprove={handleTransactionApproval}
                      onReject={handleTransactionRejection}
                    />
                  </Card>
                </TabsContent>

                <TabsContent value="users" className="m-0">
                  <Card className="p-6">
                    <UserTable users={users || []} />
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="m-0">
                  <Card className="p-6">
                    <BroadcastNotification />
                  </Card>
                </TabsContent>

                <TabsContent value="settings" className="m-0">
                  <Card className="p-6">
                    <WithdrawalSettings />
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;