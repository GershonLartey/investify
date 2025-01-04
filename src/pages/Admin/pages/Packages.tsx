import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

const Packages = () => {
  const { data: investments } = useQuery({
    queryKey: ['admin-investments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('investments')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Investment Packages</h1>
      
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Daily Interest</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {investments?.map((investment: any) => (
              <TableRow key={investment.id}>
                <TableCell>{investment.profiles?.username || 'N/A'}</TableCell>
                <TableCell>₵{investment.amount.toFixed(2)}</TableCell>
                <TableCell>{investment.daily_interest}%</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    investment.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {investment.status}
                  </span>
                </TableCell>
                <TableCell>{new Date(investment.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(investment.end_date).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default Packages