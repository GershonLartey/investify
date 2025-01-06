import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Transaction } from "../types";

interface TransactionListProps {
  transactions: Transaction[];
  onApprove: (transaction: Transaction) => Promise<void>;
  onReject: (transaction: Transaction) => Promise<void>;
}

const TransactionList = ({ transactions, onApprove, onReject }: TransactionListProps) => {
  const pendingTransactions = transactions?.filter(t => t.status === 'pending') || [];
  const completedTransactions = transactions?.filter(t => t.status !== 'pending') || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Pending Transactions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Network</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium capitalize">{transaction.type}</TableCell>
                <TableCell>₵{transaction.amount.toLocaleString()}</TableCell>
                <TableCell>{transaction.account_name || 'N/A'}</TableCell>
                <TableCell>{transaction.phone_number || 'N/A'}</TableCell>
                <TableCell>{transaction.network || 'N/A'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onApprove(transaction)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onReject(transaction)}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {pendingTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No pending transactions
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Account Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {completedTransactions.slice(0, 10).map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium capitalize">{transaction.type}</TableCell>
                <TableCell>₵{transaction.amount.toLocaleString()}</TableCell>
                <TableCell>{transaction.account_name || 'N/A'}</TableCell>
                <TableCell>
                  <Badge variant={transaction.status === 'approved' ? 'default' : 'destructive'}>
                    {transaction.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
            {completedTransactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No completed transactions
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionList;