import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserTable from "./components/UserTable";
import TransactionTabs from "./components/TransactionTabs";
import InvestmentTable from "./components/InvestmentTable";
import WithdrawalSettings from "./components/WithdrawalSettings";
import BroadcastNotification from "./components/BroadcastNotification";
import { useAdminData } from "./hooks/useAdminData";
import DashboardHeader from "./components/DashboardHeader";
import InvestmentRatioChart from "./components/InvestmentRatioChart";
import PopularInvestments from "./components/PopularInvestments";
import { useQuery } from "@tanstack/react-query";

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch financial metrics
  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const deposits = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'deposit')
        .eq('status', 'approved');

      const withdrawals = await supabase
        .from('transactions')
        .select('amount')
        .eq('type', 'withdrawal')
        .eq('status', 'approved');

      const totalDeposits = deposits.data?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalWithdrawals = withdrawals.data?.reduce((sum, t) => sum + t.amount, 0) || 0;

      return {
        totalDeposits,
        totalWithdrawals,
        netBalance: totalDeposits - totalWithdrawals
      };
    },
    enabled: !isLoading,
  });

  // Fetch investment metrics
  const { data: investmentMetrics } = useQuery({
    queryKey: ['admin-investment-metrics'],
    queryFn: async () => {
      const { data: investments } = await supabase
        .from('investments')
        .select('amount, status');

      const completed = investments?.filter(i => i.status === 'completed') || [];
      const pending = investments?.filter(i => i.status === 'active') || [];

      const totalPaidOut = completed.reduce((sum, i) => sum + i.amount, 0);
      const totalPending = pending.reduce((sum, i) => sum + i.amount, 0);

      // Group investments by amount to find most popular
      const grouped = investments?.reduce((acc, curr) => {
        acc[curr.amount] = (acc[curr.amount] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const popularInvestments = Object.entries(grouped || {})
        .map(([amount, count]) => ({ amount: Number(amount), count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalPaidOut,
        totalPending,
        popularInvestments
      };
    },
    enabled: !isLoading,
  });

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
  } = useAdminData(isLoading);

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      </div>

      <DashboardHeader
        totalDeposits={metrics?.totalDeposits || 0}
        totalWithdrawals={metrics?.totalWithdrawals || 0}
        netBalance={metrics?.netBalance || 0}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <InvestmentRatioChart
          totalPaidOut={investmentMetrics?.totalPaidOut || 0}
          totalPending={investmentMetrics?.totalPending || 0}
        />
        <PopularInvestments
          className="md:col-span-2"
          investments={investmentMetrics?.popularInvestments || []}
        />
      </div>
      
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="withdrawal">Withdrawal Settings</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <UserTable users={users || []} />
        </TabsContent>

        <TabsContent value="transactions">
          <TransactionTabs
            transactions={transactions || []}
            onApprove={handleTransactionApproval}
            onReject={handleTransactionRejection}
          />
        </TabsContent>

        <TabsContent value="investments">
          <InvestmentTable investments={investments || []} />
        </TabsContent>

        <TabsContent value="withdrawal">
          <WithdrawalSettings />
        </TabsContent>

        <TabsContent value="broadcast">
          <BroadcastNotification />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;