import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Investment } from "../types";

interface InvestmentTableProps {
  investments: Investment[];
}

const InvestmentTable = ({ investments }: InvestmentTableProps) => {
  const calculateReturns = (investment: Investment) => {
    const dailyReturn = investment.amount * (investment.daily_interest / 100);
    const daysInvested = Math.ceil(
      (new Date(investment.end_date).getTime() - new Date(investment.start_date).getTime()) / 
      (1000 * 60 * 60 * 24)
    );
    return {
      dailyReturn,
      totalReturn: dailyReturn * daysInvested
    };
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Investment Overview</h2>
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
            const { dailyReturn, totalReturn } = calculateReturns(investment);
            return (
              <TableRow key={investment.id}>
                <TableCell>₵{investment.amount.toLocaleString()}</TableCell>
                <TableCell>₵{dailyReturn.toFixed(2)}</TableCell>
                <TableCell>₵{totalReturn.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={investment.status === 'active' ? 'default' : 'secondary'}>
                    {investment.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(investment.start_date), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(investment.end_date), { addSuffix: true })}
                </TableCell>
              </TableRow>
            );
          })}
          {(!investments || investments.length === 0) && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                No investments found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default InvestmentTable;