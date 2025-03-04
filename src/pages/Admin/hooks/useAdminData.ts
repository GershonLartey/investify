
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Transaction, User, Investment } from "../types";

export const useAdminData = (isLoading: boolean) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users data
  const { data: users, error: usersError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching users...');
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');
        
        if (error) {
          console.error('Error fetching users:', error);
          throw error;
        }
        console.log('Successfully fetched users:', data);
        return data as User[];
      } catch (error) {
        console.error('Network error fetching users:', error);
        throw error;
      }
    },
    enabled: !isLoading,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch transactions data
  const { data: transactions, error: transactionsError } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      console.log('Fetching transactions...');
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching transactions:', error);
          throw error;
        }
        console.log('Successfully fetched transactions:', data);
        return data as Transaction[];
      } catch (error) {
        console.error('Network error fetching transactions:', error);
        throw error;
      }
    },
    enabled: !isLoading,
    refetchInterval: 5000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Fetch investments data
  const { data: investments, error: investmentsError } = useQuery({
    queryKey: ['admin-investments'],
    queryFn: async () => {
      console.log('Fetching investments...');
      try {
        const { data, error } = await supabase
          .from('investments')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching investments:', error);
          throw error;
        }
        console.log('Successfully fetched investments:', data);
        return data as Investment[];
      } catch (error) {
        console.error('Network error fetching investments:', error);
        throw error;
      }
    },
    enabled: !isLoading,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Handle transaction approval
  const handleTransactionApproval = async (transaction: Transaction) => {
    try {
      console.log('Approving transaction:', transaction.id);
      
      // Update transaction status to approved
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'approved' })
        .eq('id', transaction.id);

      if (error) {
        console.error('Error updating transaction status:', error);
        throw error;
      }

      console.log('Transaction approved successfully. Transaction ID:', transaction.id);
      console.log('User ID:', transaction.user_id);
      console.log('Amount:', transaction.amount);
      console.log('Type:', transaction.type);
      
      // The user balance will be updated by the database trigger 'handle_transaction_approval'
      // We don't need to manually update the balance here

      toast({
        title: "Success",
        description: "Transaction approved successfully. User balance updated.",
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    } catch (error) {
      console.error('Error approving transaction:', error);
      toast({
        title: "Error",
        description: "Failed to approve transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle transaction rejection
  const handleTransactionRejection = async (transaction: Transaction) => {
    try {
      console.log('Rejecting transaction:', transaction.id);
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'rejected' })
        .eq('id', transaction.id);

      if (error) throw error;

      console.log('Transaction rejected successfully:', transaction.id);
      toast({
        title: "Success",
        description: "Transaction rejected successfully",
      });

      queryClient.invalidateQueries({ queryKey: ['admin-transactions'] });
    } catch (error) {
      console.error('Error rejecting transaction:', error);
      toast({
        title: "Error",
        description: "Failed to reject transaction. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show error toasts for failed queries
  if (usersError) {
    console.error('Users query error:', usersError);
    toast({
      title: "Error",
      description: "Failed to load users. Please refresh the page.",
      variant: "destructive",
    });
  }

  if (transactionsError) {
    console.error('Transactions query error:', transactionsError);
    toast({
      title: "Error",
      description: "Failed to load transactions. Please refresh the page.",
      variant: "destructive",
    });
  }

  if (investmentsError) {
    console.error('Investments query error:', investmentsError);
    toast({
      title: "Error",
      description: "Failed to load investments. Please refresh the page.",
      variant: "destructive",
    });
  }

  return {
    users,
    transactions,
    investments,
    handleTransactionApproval,
    handleTransactionRejection,
    isError: !!(usersError || transactionsError || investmentsError),
  };
};
