import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ReferralSection from "@/components/ReferralSection";
import ReferredUsers from "@/components/ReferredUsers";
import ProfileForm from "@/components/ProfileForm";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast({
        title: "Success",
        description: "You have been signed out successfully",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      
      <div className="grid gap-6">
        <ProfileForm />
        <ReferralSection />
        <ReferredUsers />

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => navigate('/transactions')}
          >
            View Transaction History
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;