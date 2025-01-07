import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "@/pages/Admin/hooks/useAdminData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";
import AdminHeader from "@/pages/Admin/components/AdminHeader";
import TransactionList from "@/pages/Admin/components/TransactionList";
import UserTable from "@/pages/Admin/components/UserTable";
import InvestmentTable from "@/pages/Admin/components/InvestmentTable";
import WithdrawalSettings from "@/pages/Admin/components/WithdrawalSettings";
import BroadcastNotification from "@/pages/Admin/components/BroadcastNotification";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

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

  // Calculate totals for header
  const totalDeposits = transactions?.reduce((sum, t) => 
    t.type === 'deposit' && t.status === 'approved' ? sum + t.amount : sum, 0) || 0;
  
  const totalWithdrawals = transactions?.reduce((sum, t) => 
    t.type === 'withdrawal' && t.status === 'approved' ? sum + t.amount : sum, 0) || 0;
  
  const netBalance = totalDeposits - totalWithdrawals;

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

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-sidebar text-sidebar-foreground p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <nav className="space-y-6">
            <div>
              <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider text-gray-300">Menu</h2>
              <div className="space-y-2">
                <button className="w-full text-left px-4 py-2 rounded-md bg-secondary/10 text-secondary">
                  Overview
                </button>
                <button className="w-full text-left px-4 py-2 rounded-md hover:bg-white/10">
                  Transactions
                </button>
                <button className="w-full text-left px-4 py-2 rounded-md hover:bg-white/10">
                  Users
                </button>
                <button className="w-full text-left px-4 py-2 rounded-md hover:bg-white/10">
                  Settings
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-2">Manage your platform's data and settings</p>
            </div>

            <AdminHeader 
              totalDeposits={totalDeposits}
              totalWithdrawals={totalWithdrawals}
              netBalance={netBalance}
            />
            
            <Tabs defaultValue="transactions" className="mt-8">
              <TabsList className="grid w-full grid-cols-5 bg-white rounded-lg p-1">
                <TabsTrigger 
                  value="transactions"
                  className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                >
                  Transactions
                </TabsTrigger>
                <TabsTrigger 
                  value="users"
                  className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger 
                  value="investments"
                  className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                >
                  Investments
                </TabsTrigger>
                <TabsTrigger 
                  value="withdrawals"
                  className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                >
                  Withdrawal Settings
                </TabsTrigger>
                <TabsTrigger 
                  value="broadcast"
                  className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
                >
                  Broadcast Message
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transactions">
                <Card className="mt-6 bg-white shadow-sm">
                  <TransactionList
                    transactions={transactions || []}
                    onApprove={handleTransactionApproval}
                    onReject={handleTransactionRejection}
                  />
                </Card>
              </TabsContent>

              <TabsContent value="users">
                <Card className="mt-6 bg-white shadow-sm">
                  <UserTable users={users || []} />
                </Card>
              </TabsContent>

              <TabsContent value="investments">
                <Card className="mt-6 bg-white shadow-sm">
                  <InvestmentTable investments={investments || []} />
                </Card>
              </TabsContent>

              <TabsContent value="withdrawals">
                <Card className="mt-6 bg-white shadow-sm">
                  <WithdrawalSettings />
                </Card>
              </TabsContent>

              <TabsContent value="broadcast">
                <Card className="mt-6 bg-white shadow-sm">
                  <BroadcastNotification />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;