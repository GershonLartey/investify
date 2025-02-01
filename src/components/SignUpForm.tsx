import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  // Get referral code from URL parameters
  useEffect(() => {
    const code = searchParams.get('ref');
    if (code) {
      console.log('Referral code found in URL:', code);
      setReferralCode(code);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Validate phone number format (simple validation)
      if (!/^\d{10}$/.test(phoneNumber)) {
        throw new Error("Please enter a valid 10-digit phone number");
      }

      // Format phone number to ensure consistency
      const formattedPhoneNumber = phoneNumber.replace(/\D/g, '');

      // If referral code provided, verify it exists
      let referrerId = null;
      if (referralCode) {
        console.log("Verifying referral code:", referralCode);
        const { data: referrerData, error: referrerError } = await supabase
          .from('profiles')
          .select('id')
          .eq('referral_code', referralCode)
          .single();

        if (referrerError) {
          console.error("Error verifying referral code:", referrerError);
          throw new Error("Invalid referral code");
        }

        if (!referrerData) {
          console.error("No referrer found for code:", referralCode);
          throw new Error("Invalid referral code");
        }

        referrerId = referrerData.id;
        console.log("Referral code verified, referrer ID:", referrerId);
      }

      console.log("Attempting signup with data:", {
        email,
        username,
        phone_number: formattedPhoneNumber,
        referred_by: referralCode
      });

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            phone_number: formattedPhoneNumber,
            referred_by: referralCode
          }
        }
      });

      if (signUpError) {
        console.error("Signup error:", signUpError);
        throw signUpError;
      }

      if (signUpData.user) {
        console.log("Signup successful:", signUpData);
        
        // Get welcome message from settings
        const { data: settings, error: settingsError } = await supabase
          .from('signup_settings')
          .select('default_welcome_title, default_welcome_message')
          .single();

        if (settingsError) {
          console.error("Error fetching welcome message:", settingsError);
          // Use fallback welcome message if settings fetch fails
          settings = {
            default_welcome_title: 'Welcome to Our Platform!',
            default_welcome_message: 'Thank you for joining us. Start your investment journey today!'
          };
        }

        // Create welcome notification
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: signUpData.user.id,
            title: settings.default_welcome_title,
            message: settings.default_welcome_message,
            type: 'welcome',
            is_persistent: true
          });

        if (notificationError) {
          console.error("Error creating welcome notification:", notificationError);
        }

        toast({
          title: "Success",
          description: "Account created successfully! Please verify your email.",
        });
        
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during sign up",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <Input
          type="tel"
          placeholder="Phone Number (10 digits)"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          pattern="\d{10}"
        />
      </div>
      <div>
        <Input
          type="text"
          placeholder="Referral Code (Optional)"
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <div>
        <Input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>
    </form>
  );
};

export default SignUpForm;