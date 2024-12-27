import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Transaction } from "../types";

interface TransactionTableProps {
  transactions: Transaction[];
  onApprove: (transaction: Transaction) => Promise<void>;
  onReject: (transaction: Transaction) => Promise<void>;
}

const TransactionTable = ({ transactions, onApprove, onReject }: TransactionTableProps) => {
  console.log('Rendering TransactionTable with transactions:', transactions);
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
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
              <TableCell className="font-mono text-sm">{transaction.user_id}</TableCell>
              <TableCell className="capitalize">{transaction.type}</TableCell>
              <TableCell>₵{transaction.amount.toFixed(2)}</TableCell>
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
              <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {transaction.status === 'pending' && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="default"
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
                )}
              </TableCell>
            </TableRow>
          ))}
          {(!transactions || transactions.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;