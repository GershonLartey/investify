import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface InvestmentRatioChartProps {
  totalPaidOut: number;
  totalPending: number;
}

const COLORS = ['#1E3A8A', '#60A5FA'];

const InvestmentRatioChart = ({ totalPaidOut, totalPending }: InvestmentRatioChartProps) => {
  const data = [
    { name: 'Total Paid Out', value: totalPaidOut },
    { name: 'Total Pending', value: totalPending },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Payout Ratio</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number | string) => {
                const numValue = typeof value === 'string' ? parseFloat(value) : value;
                return `$${numValue.toFixed(2)}`;
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InvestmentRatioChart;