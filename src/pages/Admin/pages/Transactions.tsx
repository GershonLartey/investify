import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

const Transactions = () => {
  const { toast } = useToast()
  const { data: transactions, refetch } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  const handleApprove = async (transaction: any) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'approved' })
        .eq('id', transaction.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Transaction approved successfully",
      })
      refetch()
    } catch (error) {
      console.error('Error approving transaction:', error)
      toast({
        title: "Error",
        description: "Failed to approve transaction",
        variant: "destructive",
      })
    }
  }

  const handleReject = async (transaction: any) => {
    try {
      const { error } = await supabase
        .from('transactions')
        .update({ status: 'rejected' })
        .eq('id', transaction.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Transaction rejected successfully",
      })
      refetch()
    } catch (error) {
      console.error('Error rejecting transaction:', error)
      toast({
        title: "Error",
        description: "Failed to reject transaction",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>
      
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions?.map((transaction: any) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.profiles?.username || 'N/A'}</TableCell>
                <TableCell className="capitalize">{transaction.type}</TableCell>
                <TableCell>₵{transaction.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    transaction.status === 'pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : transaction.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.status}
                  </span>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(transaction.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {transaction.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(transaction)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(transaction)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default Transactions