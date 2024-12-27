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
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
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