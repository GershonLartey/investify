import { ChartBar, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardHeaderProps {
  totalDeposits: number;
  totalWithdrawals: number;
  netBalance: number;
}

const DashboardHeader = ({ totalDeposits, totalWithdrawals, netBalance }: DashboardHeaderProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">${totalDeposits.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">All time deposits</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
          <DollarSign className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">${totalWithdrawals.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">All time withdrawals</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <ChartBar className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">${netBalance.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">Total deposits - withdrawals</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardHeader;