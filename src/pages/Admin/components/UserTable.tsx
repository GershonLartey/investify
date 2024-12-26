import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

type User = {
  id: string;
  username: string | null;
  balance: number;
  created_at: string;
};

interface UserTableProps {
  users: User[];
}

interface AuthUser {
  id: string;
  email?: string;
}

const UserTable = ({ users }: UserTableProps) => {
  // Fetch user emails from auth.users
  const { data: userEmails } = useQuery({
    queryKey: ['user-emails'],
    queryFn: async () => {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      
      const emailMap: Record<string, string> = {};
      users?.forEach((user: AuthUser) => {
        emailMap[user.id] = user.email || 'No email';
      });
      return emailMap;
    },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{userEmails?.[user.id] || 'Loading...'}</TableCell>
              <TableCell>${user.balance?.toFixed(2) || '0.00'}</TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;