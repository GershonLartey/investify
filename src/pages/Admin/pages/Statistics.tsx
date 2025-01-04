import { Card } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const Statistics = () => {
  const { data: transactionStats } = useQuery({
    queryKey: ['admin-transaction-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      // Group transactions by date and calculate daily totals
      const dailyTotals = data.reduce((acc: any[], transaction) => {
        const date = new Date(transaction.created_at).toLocaleDateString()
        const existing = acc.find(item => item.date === date)
        if (existing) {
          existing.amount += transaction.amount
        } else {
          acc.push({ date, amount: transaction.amount })
        }
        return acc
      }, [])

      return dailyTotals.slice(-30) // Last 30 days
    }
  })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Statistics</h1>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Transaction Volume (Last 30 Days)</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transactionStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}

export default Statistics