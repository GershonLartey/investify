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
  return (
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
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionTable;