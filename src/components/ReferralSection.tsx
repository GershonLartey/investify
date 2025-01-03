import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

const ReferralSection = () => {
  const [referralCode, setReferralCode] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReferralCode = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('profiles')
          .select('referral_code')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        if (data) setReferralCode(data.referral_code);
      } catch (error) {
        console.error('Error fetching referral code:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralCode();
  }, []);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      toast({
        title: "Error",
        description: "Failed to copy referral code",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading referral information...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Referral Code</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <code className="text-sm font-mono">{referralCode}</code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyToClipboard(referralCode)}
          >
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Share this code with your friends. When they sign up and invest, you'll earn 15% of their investment amount!
        </p>
      </CardContent>
    </Card>
  );
};

export default ReferralSection;