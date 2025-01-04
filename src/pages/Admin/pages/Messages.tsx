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
import { formatDistanceToNow } from "date-fns"

const Messages = () => {
  const { data: notifications } = useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Messages</h1>
      
      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications?.map((notification: any) => (
              <TableRow key={notification.id}>
                <TableCell>{notification.profiles?.username || 'N/A'}</TableCell>
                <TableCell>{notification.title}</TableCell>
                <TableCell>{notification.message}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    notification.type === 'general' 
                      ? 'bg-blue-100 text-blue-800'
                      : notification.type === 'investment'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {notification.type}
                  </span>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

export default Messages