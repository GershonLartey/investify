import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const [user, setUser] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    fetchUser();
  }, []);

  const handleCopyReferralLink = () => {
    const baseUrl = window.location.origin;
    const referralLink = `${baseUrl}/?ref=${user?.referral_code}`;
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Success",
      description: "Referral link copied to clipboard!",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Profile</h1>
      {user ? (
        <div>
          <p>Email: {user.email}</p>
          <p>Username: {user.user_metadata.username}</p>
          <p>Referral Code: {user.user_metadata.referral_code}</p>
          <button onClick={handleCopyReferralLink} className="mt-4 bg-blue-500 text-white p-2 rounded">
            Copy Referral Link
          </button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
