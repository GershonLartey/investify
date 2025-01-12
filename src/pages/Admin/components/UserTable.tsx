import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDistanceToNow } from "date-fns";
import { User } from "../types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UserTableProps {
  users: User[];
}

const UserTable = ({ users }: UserTableProps) => {
  // Fetch latest user data
  const { data: latestUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching latest user data...');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }

      console.log('Successfully fetched users:', data);
      return data;
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const displayUsers = latestUsers || users;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-600">Total Users</h3>
            <p className="text-2xl font-bold text-green-900">{displayUsers?.length || 0}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-600">Active Today</h3>
            <p className="text-2xl font-bold text-blue-900">
              {displayUsers?.filter(u => new Date(u.updated_at).toDateString() === new Date().toDateString()).length || 0}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-purple-600">New This Week</h3>
            <p className="text-2xl font-bold text-purple-900">
              {displayUsers?.filter(u => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return new Date(u.created_at) > weekAgo;
              }).length || 0}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-600">Average Balance</h3>
            <p className="text-2xl font-bold text-yellow-900">
              ₵{displayUsers?.reduce((acc, user) => acc + (user.balance || 0), 0) / (displayUsers?.length || 1) || 0}
            </p>
          </div>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Joined</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayUsers?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.username || 'No username'}</TableCell>
              <TableCell>₵{user.balance?.toLocaleString() || '0.00'}</TableCell>
              <TableCell>{user.phone_number || 'N/A'}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
              </TableCell>
            </TableRow>
          ))}
          {(!displayUsers || displayUsers.length === 0) && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;