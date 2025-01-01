import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Investment {
  amount: number;
  count: number;
}

interface PopularInvestmentsProps {
  investments: Investment[];
  className?: string;
}

const PopularInvestments = ({ investments, className }: PopularInvestmentsProps) => {
  const data = investments.map(inv => ({
    amount: `$${inv.amount}`,
    count: inv.count
  }));

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Most Popular Investment Packages</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="amount" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#1E3A8A" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default PopularInvestments;