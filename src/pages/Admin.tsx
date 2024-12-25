import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

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

  // Fetch all users
  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) throw error;
      return data || [];
    },
    enabled: !isLoading,
  });

  // Fetch all transactions
  const { data: transactions } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !isLoading,
  });

  // Fetch all investments
  const { data: investments } = useQuery({
    queryKey: ['admin-investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !isLoading,
  });

  const handleApproveTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction approved successfully",
      });
    } catch (error) {
      console.error('Error approving transaction:', error);
      toast({
        title: "Error",
        description: "Failed to approve transaction",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Users Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username || 'No username'}</TableCell>
                <TableCell>${user.balance?.toFixed(2) || '0.00'}</TableCell>
                <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Transactions Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="capitalize">{transaction.type}</TableCell>
                <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{transaction.status}</TableCell>
                <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  {transaction.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleApproveTransaction(transaction.id)}
                    >
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Investments Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Investments</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Amount</TableHead>
              <TableHead>Daily Interest</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments?.map((investment) => (
              <TableRow key={investment.id}>
                <TableCell>${investment.amount.toFixed(2)}</TableCell>
                <TableCell>{investment.daily_interest}%</TableCell>
                <TableCell className="capitalize">{investment.status}</TableCell>
                <TableCell>{new Date(investment.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(investment.end_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Admin;