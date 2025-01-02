import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { Transaction, User, Investment } from "../types";

export const useAdminData = (isLoading: boolean) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching users...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      return data as User[];
    },
    enabled: !isLoading,
  });

  const { data: transactions } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      console.log('Fetching transactions...');
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
      return data as Transaction[];
    },
    enabled: !isLoading,
    refetchInterval: 5000,
  });

  const { data: investments } = useQuery({
    queryKey: ['admin-investments'],
    queryFn: async () => {
      console.log('Fetching investments...');
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching investments:', error);
        throw error;
      }
      return data as Investment[];
    },
    enabled: !isLoading,
  });

  const handleTransactionApproval = async (transaction: Transaction) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'approved' })
        .eq('id', transaction.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction approved successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (error) {
      console.error('Error approving transaction:', error);
      toast({
        title: "Error",
        description: "Failed to approve transaction",
        variant: "destructive",
      });
    }
  };

  const handleTransactionRejection = async (transaction: Transaction) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'rejected' })
        .eq('id', transaction.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Transaction rejected successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to reject transaction",
        variant: "destructive",
      });
    }
  };

  return {
    users,
    transactions,
    investments,
    handleTransactionApproval,
    handleTransactionRejection,
  };
};