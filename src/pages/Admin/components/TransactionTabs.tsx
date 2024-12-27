import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionTable from "./TransactionTable";
import { Transaction } from "../types";

interface TransactionTabsProps {
  transactions: Transaction[];
  onApprove: (transaction: Transaction) => Promise<void>;
  onReject: (transaction: Transaction) => Promise<void>;
}

const TransactionTabs = ({ transactions, onApprove, onReject }: TransactionTabsProps) => {
  const pendingTransactions = transactions?.filter(t => t.status === 'pending') || [];
  const completedTransactions = transactions?.filter(t => t.status !== 'pending') || [];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Transactions</h2>
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pending">
            Pending ({pendingTransactions.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedTransactions.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
          <TransactionTable
            transactions={pendingTransactions}
            onApprove={onApprove}
            onReject={onReject}
          />
        </TabsContent>
        <TabsContent value="completed">
          <TransactionTable
            transactions={completedTransactions}
            onApprove={onApprove}
            onReject={onReject}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionTabs;