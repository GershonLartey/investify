import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { User, Settings, Shield, History, Users, LogOut } from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>
            <User className="h-12 w-12" />
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold">{profile?.username || 'My Account'}</h1>
      </div>

      {/* Spending Overview */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Spending Overview</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Total Balance</span>
              <span className="font-semibold">₵{profile?.balance?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-primary rounded-full"
                style={{ width: `${(profile?.balance || 0) / 20000 * 100}%` }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Invite Friends Card */}
      <Card className="p-6 bg-[linear-gradient(to_right,#243949_0%,#517fa4_100%)] text-white">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold mb-2">Invite Friends</h3>
            <p className="text-sm opacity-90">Invite your friends and get ₵100 each</p>
          </div>
          <Users className="h-6 w-6" />
        </div>
      </Card>

      {/* Menu Items */}
      <div className="space-y-2">
        <Button variant="ghost" className="w-full justify-start text-left" onClick={() => navigate("/profile")}>
          <User className="h-5 w-5 mr-3" />
          My Account
        </Button>
        <Button variant="ghost" className="w-full justify-start text-left" onClick={() => navigate("/transactions")}>
          <History className="h-5 w-5 mr-3" />
          Transaction History
        </Button>
        <Button variant="ghost" className="w-full justify-start text-left">
          <Shield className="h-5 w-5 mr-3" />
          Security Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-left">
          <Settings className="h-5 w-5 mr-3" />
          General Settings
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Profile;