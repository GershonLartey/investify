import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface InvestmentRatioChartProps {
  totalPaidOut: number;
  totalPending: number;
}

const InvestmentRatioChart = ({ totalPaidOut, totalPending }: InvestmentRatioChartProps) => {
  const data = [
    { name: "Paid Out", value: totalPaidOut },
    { name: "Pending", value: totalPending },
  ];

  const COLORS = ["#1E3A8A", "#93C5FD"];

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Investment Payouts Ratio</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
              label
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