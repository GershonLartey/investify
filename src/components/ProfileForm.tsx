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

  const { data: profile, refetch: refetchProfile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      console.log('Fetching profile data for user:', userId);
      if (!userId) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('username, referral_code, referred_by')
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
    if (profile?.referral_code) {
      const referralLink = `${window.location.origin}/${profile.referral_code}`;
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
              disabled={!profile?.referral_code}
            >
              Copy Link
            </Button>
          </div>
          <p className="text-muted-foreground">
            {profile?.referral_code || "No referral code available"}
          </p>
        </div>

        {profile?.referred_by && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Referred By</span>
            </div>
            <p className="text-muted-foreground">{profile.referred_by}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileForm;