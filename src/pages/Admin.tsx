import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "@/pages/Admin/hooks/useAdminData";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "@/pages/Admin/components/AdminSidebar";
import AdminHeader from "@/pages/Admin/components/AdminHeader";
import AdminMetrics from "@/pages/Admin/components/AdminMetrics";
import RevenueChart from "@/pages/Admin/components/RevenueChart";
import TransactionList from "@/pages/Admin/components/TransactionList";
import UserTable from "@/pages/Admin/components/UserTable";
import InvestmentTable from "@/pages/Admin/components/InvestmentTable";
import WithdrawalSettings from "@/pages/Admin/components/WithdrawalSettings";
import BroadcastNotification from "@/pages/Admin/components/BroadcastNotification";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [activeView, setActiveView] = useState("overview");

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

  // Prepare revenue data for chart
  const revenueData = transactions
    ?.filter(t => t.status === 'approved')
    ?.reduce((acc, t) => {
      const date = new Date(t.created_at).toLocaleDateString();
      const existingDay = acc.find(d => d.name === date);
      if (existingDay) {
        existingDay.amount += t.type === 'deposit' ? t.amount : -t.amount;
      } else {
        acc.push({ name: date, amount: t.type === 'deposit' ? t.amount : -t.amount });
      }
      return acc;
    }, [] as Array<{ name: string; amount: number }>)
    ?.slice(-7) || [];

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

  const renderContent = () => {
    switch (activeView) {
      case "overview":
        return (
          <div className="space-y-6">
            <AdminHeader 
              totalDeposits={totalDeposits}
              totalWithdrawals={totalWithdrawals}
              netBalance={netBalance}
            />
            <AdminMetrics />
            <RevenueChart data={revenueData} />
          </div>
        );
      case "pending-transactions":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Pending Transactions</h2>
            <TransactionList
              transactions={transactions?.filter(t => t.status === 'pending') || []}
              onApprove={handleTransactionApproval}
              onReject={handleTransactionRejection}
            />
          </Card>
        );
      case "completed-transactions":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Completed Transactions</h2>
            <TransactionList
              transactions={transactions?.filter(t => t.status !== 'pending') || []}
              onApprove={handleTransactionApproval}
              onReject={handleTransactionRejection}
            />
          </Card>
        );
      case "users":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">User Management</h2>
            <UserTable users={users || []} />
          </Card>
        );
      case "investments":
        return (
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Investment Overview</h2>
            <InvestmentTable investments={investments || []} />
          </Card>
        );
      case "withdrawals":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Withdrawal Settings</h2>
            <WithdrawalSettings />
          </div>
        );
      case "broadcast":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Broadcast Message</h2>
            <BroadcastNotification />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar activeView={activeView} onViewChange={setActiveView} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;