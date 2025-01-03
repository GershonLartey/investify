import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

interface ReferredUser {
  id: string;
  username: string | null;
  created_at: string;
}

const ReferredUsers = () => {
  const [referredUsers, setReferredUsers] = useState<ReferredUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReferredUsers = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        // First get the user's referral code
        const { data: profile } = await supabase
          .from('profiles')
          .select('referral_code')
          .eq('id', user.id)
          .single();

        if (profile?.referral_code) {
          // Then get all users who used this referral code
          const { data, error } = await supabase
            .from('profiles')
            .select('id, username, created_at')
            .eq('referred_by', profile.referral_code);

          if (error) {
            console.error('Error fetching referred users:', error);
            throw error;
          }
          
          setReferredUsers(data || []);
        }
      } catch (error) {
        console.error('Error fetching referred users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferredUsers();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <span>Loading referred users...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Referred Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        {referredUsers.length === 0 ? (
          <p className="text-muted-foreground">No referred users yet.</p>
        ) : (
          <div className="space-y-4">
            {referredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between border-b pb-2 last:border-0"
              >
                <span>{user.username || 'Anonymous User'}</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferredUsers;