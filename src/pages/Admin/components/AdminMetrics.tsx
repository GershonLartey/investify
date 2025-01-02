import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, TrendingUp } from "lucide-react";

const AdminMetrics = () => {
  const { data: metrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: async () => {
      const [deposits, withdrawals, users] = await Promise.all([
        supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'deposit')
          .eq('status', 'approved'),
        supabase
          .from('transactions')
          .select('amount')
          .eq('type', 'withdrawal')
          .eq('status', 'approved'),
        supabase
          .from('profiles')
          .select('count'),
      ]);

      const totalDeposits = deposits.data?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalWithdrawals = withdrawals.data?.reduce((sum, t) => sum + t.amount, 0) || 0;
      const totalUsers = users.count || 0;

      return {
        totalDeposits,
        totalWithdrawals,
        netBalance: totalDeposits - totalWithdrawals,
        totalUsers
      };
    },
  });

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics?.totalUsers || 0}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₵{metrics?.totalDeposits?.toFixed(2) || '0.00'}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₵{metrics?.netBalance?.toFixed(2) || '0.00'}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminMetrics;