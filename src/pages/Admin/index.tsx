import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdminData } from "./hooks/useAdminData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader } from "lucide-react";
import DashboardHeader from "./components/DashboardHeader";
import TransactionList from "./components/TransactionList";
import UserTable from "./components/UserTable";
import InvestmentTable from "./components/InvestmentTable";
import WithdrawalSettings from "./components/WithdrawalSettings";
import BroadcastNotification from "./components/BroadcastNotification";

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
    t.type === 'deposit' ? sum + t.amount : sum, 0) || 0;
  
  const totalWithdrawals = transactions?.reduce((sum, t) => 
    t.type === 'withdrawal' ? sum + t.amount : sum, 0) || 0;
  
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
    <div className="p-6 space-y-6">
      <DashboardHeader 
        totalDeposits={totalDeposits}
        totalWithdrawals={totalWithdrawals}
        netBalance={netBalance}
      />
      
      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawal Settings</TabsTrigger>
          <TabsTrigger value="broadcast">Broadcast Message</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card className="p-6">
            <TransactionList
              transactions={transactions}
              onApprove={handleTransactionApproval}
              onReject={handleTransactionRejection}
            />
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card className="p-6">
            <UserTable users={users} />
          </Card>
        </TabsContent>

        <TabsContent value="investments">
          <Card className="p-6">
            <InvestmentTable investments={investments} />
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals">
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