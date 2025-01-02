import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Transaction } from "../types";

interface AdminHeaderProps {
  users: User[];
  transactions: Transaction[];
}

const AdminHeader = ({ users, transactions }: AdminHeaderProps) => {
  const totalBalance = users?.reduce((sum, user) => sum + (user.balance || 0), 0) || 0;
  const totalDeposits = transactions
    ?.filter(t => t.type === 'deposit' && t.status === 'approved')
    ?.reduce((sum, t) => sum + t.amount, 0) || 0;
  const totalWithdrawals = transactions
    ?.filter(t => t.type === 'withdrawal' && t.status === 'approved')
    ?.reduce((sum, t) => sum + t.amount, 0) || 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₵{totalBalance.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₵{totalDeposits.toFixed(2)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₵{totalWithdrawals.toFixed(2)}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHeader;