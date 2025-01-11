import { Card } from "@/components/ui/card";
import { Transaction, User, Investment } from "../types";
import RevenueChart from "./RevenueChart";
import PopularInvestments from "./PopularInvestments";
import InvestmentRatioChart from "./InvestmentRatioChart";
import MetricsCard from "./MetricsCard";

interface DashboardOverviewProps {
  transactions: Transaction[];
  users: User[];
  investments: Investment[];
}

const DashboardOverview = ({ transactions, users, investments }: DashboardOverviewProps) => {
  // Calculate metrics
  const totalDeposits = transactions.reduce((sum, t) => 
    t.type === 'deposit' && t.status === 'approved' ? sum + t.amount : sum, 0);
  
  const totalWithdrawals = transactions.reduce((sum, t) => 
    t.type === 'withdrawal' && t.status === 'approved' ? sum + t.amount : sum, 0);
  
  const totalInvestments = investments.reduce((sum, i) => sum + i.amount, 0);
  
  const activeInvestments = investments.filter(i => i.status === 'active').length;

  // Calculate revenue data (last 7 days)
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const revenueData = last7Days.map(date => ({
    name: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
    amount: transactions
      .filter(t => 
        t.type === 'deposit' && 
        t.status === 'approved' && 
        new Date(t.created_at).toISOString().split('T')[0] === date
      )
      .reduce((sum, t) => sum + t.amount, 0)
  }));

  // Calculate popular investment amounts
  const investmentAmounts = investments.reduce((acc, inv) => {
    acc[inv.amount] = (acc[inv.amount] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const popularInvestments = Object.entries(investmentAmounts)
    .map(([amount, count]) => ({ amount: Number(amount), count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Calculate investment ratio
  const totalPaidOut = investments
    .filter(i => i.status === 'completed')
    .reduce((sum, i) => sum + i.amount, 0);
  
  const totalPending = investments
    .filter(i => i.status === 'active')
    .reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        <MetricsCard
          title="Total Deposits"
          value={totalDeposits}
          change={{ value: 12, type: "increase" }}
        />
        <MetricsCard
          title="Total Withdrawals"
          value={totalWithdrawals}
          change={{ value: 8, type: "increase" }}
        />
        <MetricsCard
          title="Active Investments"
          value={activeInvestments}
          prefix=""
        />
        <MetricsCard
          title="Total Users"
          value={users.length}
          prefix=""
          change={{ value: 5, type: "increase" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
        <RevenueChart data={revenueData} />
        <PopularInvestments investments={popularInvestments} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium capitalize">{transaction.type}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className={`font-mono ${
                  transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}₵{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        </Card>
        <InvestmentRatioChart
          totalPaidOut={totalPaidOut}
          totalPending={totalPending}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;