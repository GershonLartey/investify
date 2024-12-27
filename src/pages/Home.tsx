import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from "@/components/SignUpForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Welcome</h1>
        <Tabs defaultValue="login" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={[]}
              view="sign_in"
            />
          </TabsContent>
          <TabsContent value="signup">
            <SignUpForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;