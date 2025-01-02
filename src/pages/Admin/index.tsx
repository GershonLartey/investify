import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "./hooks/useAdminData";
import MetricsCard from "./components/MetricsCard";
import TransactionList from "./components/TransactionList";
import RevenueChart from "./components/RevenueChart";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ReloadIcon } from "lucide-react";

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

  // Calculate metrics
  const totalBalance = users?.reduce((sum, user) => sum + (user.balance || 0), 0) || 0;
  const totalInvestments = investments?.reduce((sum, inv) => sum + inv.amount, 0) || 0;
  const recentTransactionsTotal = transactions
    ?.filter(t => t.status === 'approved')
    ?.reduce((sum, t) => sum + t.amount, 0) || 0;

  // Prepare data for revenue chart
  const revenueData = transactions
    ?.filter(t => t.status === 'approved')
    ?.reduce((acc: any[], transaction) => {
      const date = new Date(transaction.created_at).toLocaleDateString();
      const existing = acc.find(item => item.name === date);
      if (existing) {
        existing.amount += transaction.amount;
      } else {
        acc.push({ name: date, amount: transaction.amount });
      }
      return acc;
    }, [])
    .slice(-7) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ReloadIcon className="h-6 w-6 animate-spin" />
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricsCard
          title="Total Balance"
          value={totalBalance}
          change={{ value: 15, type: "increase" }}
        />
        <MetricsCard
          title="Total Investments"
          value={totalInvestments}
          change={{ value: 8, type: "increase" }}
        />
        <MetricsCard
          title="Recent Transactions"
          value={recentTransactionsTotal}
          change={{ value: 12, type: "increase" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <TransactionList 
          transactions={transactions || []} 
          onApprove={handleTransactionApproval}
          onReject={handleTransactionRejection}
        />
      </div>
    </div>
  );
};

export default Admin;
