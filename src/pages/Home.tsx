import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from "@/components/SignUpForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { ArrowUpRight, Shield, Wallet2, Clock } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        navigate("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const features = [
    {
      icon: <Wallet2 className="w-6 h-6 text-primary" />,
      title: "High Returns",
      description: "Earn competitive daily returns on your investments"
    },
    {
      icon: <Shield className="w-6 h-6 text-primary" />,
      title: "Secure Platform",
      description: "Your investments are protected with bank-grade security"
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "24/7 Support",
      description: "Our dedicated team is always here to help you"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900">
              Invest Smart, <br />
              <span className="text-primary">Grow Wealth</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              Start your investment journey today with our secure and high-yield investment platform. Join thousands of successful investors.
            </p>
            <div className="flex gap-4 items-center">
              <div className="flex -space-x-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-primary/20 border-2 border-white flex items-center justify-center text-sm font-medium text-primary"
                  >
                    {i + 1}K
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Trusted by over 10,000+ investors worldwide
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-xl">
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
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide the tools and expertise you need to make informed investment decisions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-lg"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Investment Journey?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Join our platform today and start growing your wealth
          </p>
          <button
            onClick={() => document.querySelector('[value="signup"]')?.click()}
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Get Started Now
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;