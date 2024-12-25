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
            <TableHead>Daily Interest</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investments?.map((investment) => (
            <TableRow key={investment.id}>
              <TableCell>${investment.amount.toFixed(2)}</TableCell>
              <TableCell>{investment.daily_interest}%</TableCell>
              <TableCell className="capitalize">{investment.status}</TableCell>
              <TableCell>{new Date(investment.start_date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(investment.end_date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvestmentTable;