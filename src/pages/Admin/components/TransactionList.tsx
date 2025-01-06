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
  const isPending = transactions.length > 0 && transactions[0].status === 'pending';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {isPending ? "Pending Transactions" : "Completed Transactions"}
      </h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Account Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Network</TableHead>
            <TableHead>Time</TableHead>
            {isPending && <TableHead>Actions</TableHead>}
            {!isPending && <TableHead>Status</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium capitalize">{transaction.type}</TableCell>
              <TableCell>₵{transaction.amount.toLocaleString()}</TableCell>
              <TableCell>{transaction.account_name || 'N/A'}</TableCell>
              <TableCell>{transaction.phone_number || 'N/A'}</TableCell>
              <TableCell>{transaction.network || 'N/A'}</TableCell>
              <TableCell className="text-muted-foreground">
                {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
              </TableCell>
              {isPending ? (
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
              ) : (
                <TableCell>
                  <Badge variant={transaction.status === 'approved' ? 'default' : 'destructive'}>
                    {transaction.status}
                  </Badge>
                </TableCell>
              )}
            </TableRow>
          ))}
          {transactions.length === 0 && (
            <TableRow>
              <TableCell colSpan={isPending ? 7 : 7} className="text-center py-4 text-muted-foreground">
                No {isPending ? 'pending' : 'completed'} transactions
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;