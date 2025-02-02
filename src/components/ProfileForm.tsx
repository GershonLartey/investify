import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserRound, Mail, Edit2, Link as LinkIcon, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const ProfileForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setEmail(user.email || "");
      }
    };
    fetchUser();
  }, []);

  // Query for user's referral code
  const { data: referralData } = useQuery({
    queryKey: ['referral', userId],
    queryFn: async () => {
      if (!userId) return null;
      console.log('Fetching referral data for user:', userId);
      
      const { data: referralCode, error: referralError } = await supabase
        .from('referrals')
        .select('code')
        .eq('referrer_id', userId)
        .single();

      if (referralError && referralError.code !== 'PGRST116') {
        console.error('Error fetching referral code:', referralError);
        throw referralError;
      }

      return referralCode;
    },
    enabled: !!userId
  });

  // Query for referred by information
  const { data: referredByData } = useQuery({
    queryKey: ['referred-by', userId],
    queryFn: async () => {
      if (!userId) return null;
      console.log('Fetching referrer data for user:', userId);
      
      const { data: referral, error: referralError } = await supabase
        .from('referrals')
        .select('referrer_id, profiles:referrer_id(username)')
        .eq('referred_id', userId)
        .single();

      if (referralError && referralError.code !== 'PGRST116') {
        console.error('Error fetching referrer:', referralError);
        throw referralError;
      }

      return referral;
    },
    enabled: !!userId
  });

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      console.log('Fetching profile data for user:', userId);
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
        throw error;
      }

      if (data) {
        setUsername(data.username || "");
      }
      return data;
    },
    enabled: !!userId,
    retry: 1
  });

  const handleUpdateProfile = async () => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username })
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to update profile",
          variant: "destructive",
        });
        throw error;
      }

      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      refetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCopyReferralLink = () => {
    if (referralData?.code) {
      const referralLink = `${window.location.origin}/?ref=${referralData.code}`;
      navigator.clipboard.writeText(referralLink);
      toast({
        title: "Success",
        description: "Referral link copied to clipboard",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserRound className="h-5 w-5" />
          Profile Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Email</span>
          </div>
          <p className="text-muted-foreground">{email}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Username</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button onClick={handleUpdateProfile}>Save</Button>
            </div>
          ) : (
            <p className="text-muted-foreground">{username || "Not set"}</p>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Referral Code</span>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopyReferralLink}
              disabled={!referralData?.code}
            >
              Copy Link
            </Button>
          </div>
          <p className="text-muted-foreground">
            {referralData?.code || "No referral code available"}
          </p>
        </div>

        {referredByData?.profiles?.username && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Referred By</span>
            </div>
            <p className="text-muted-foreground">{referredByData.profiles.username}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileForm;