import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Investment = {
  id: string;
  amount: number;
  daily_interest: number;
  status: string;
  start_date: string;
  end_date: string;
};

interface InvestmentTableProps {
  investments: Investment[];
}

const InvestmentTable = ({ investments }: InvestmentTableProps) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Recent Investments</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Amount</TableHead>
            <TableHead>Daily Return</TableHead>
            <TableHead>Total Return</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments?.map((investment) => {
            const dailyReturn = investment.amount * (investment.daily_interest / 100);
            const daysInvested = Math.ceil(
              (new Date(investment.end_date).getTime() - new Date(investment.start_date).getTime()) / 
              (1000 * 60 * 60 * 24)
            );
            const totalReturn = dailyReturn * daysInvested;

            return (
              <TableRow key={investment.id}>
                <TableCell>₵{investment.amount.toFixed(2)}</TableCell>
                <TableCell>₵{dailyReturn.toFixed(2)}</TableCell>
                <TableCell>₵{totalReturn.toFixed(2)}</TableCell>
                <TableCell className="capitalize">{investment.status}</TableCell>
                <TableCell>{new Date(investment.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(investment.end_date).toLocaleDateString()}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvestmentTable;