import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import UserTable from "./components/UserTable";
import TransactionTable from "./components/TransactionTable";
import InvestmentTable from "./components/InvestmentTable";
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
      
      <UserTable users={users || []} />
      <TransactionTable
        transactions={transactions || []}
        onApprove={handleTransactionApproval}
        onReject={handleTransactionRejection}
      />
      <InvestmentTable investments={investments || []} />
    </div>
  );
};

export default Admin;