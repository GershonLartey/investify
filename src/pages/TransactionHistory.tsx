import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

const TransactionHistory = () => {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['transactions-history'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transaction History</h1>
      
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="capitalize">{transaction.type}</TableCell>
                <TableCell>
                  <span className={transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}>
                    {transaction.type === 'deposit' ? '+' : '-'}₵{transaction.amount.toFixed(2)}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : transaction.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell>{formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}</TableCell>
              </TableRow>
            ))}
            {(!transactions || transactions.length === 0) && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default TransactionHistory;