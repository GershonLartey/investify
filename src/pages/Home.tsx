import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SignUpForm from "@/components/SignUpForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { ArrowUpRight, Shield, Wallet2, Clock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      icon: <Wallet2 className="w-8 h-8 text-secondary" />,
      title: "High Returns",
      description: "Earn competitive daily returns on your investments with our proven strategies"
    },
    {
      icon: <Shield className="w-8 h-8 text-secondary" />,
      title: "Secure Platform",
      description: "Your investments are protected with bank-grade security measures"
    },
    {
      icon: <Clock className="w-8 h-8 text-secondary" />,
      title: "24/7 Support",
      description: "Our dedicated team is always here to help you succeed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-primary/10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-secondary/10 rounded-full text-secondary text-sm font-medium">
              <span>New: Enhanced Investment Options</span>
              <ChevronRight className="w-4 h-4 ml-2" />
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Smart Investments, <br />
              <span className="text-primary bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Better Future
              </span>
            </h1>
            
            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Join thousands of successful investors on our secure and high-yield investment platform. Start your journey to financial freedom today.
            </p>
            
            <div className="flex gap-6 items-center">
              <div className="flex -space-x-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-white shadow-lg border-2 border-white flex items-center justify-center text-sm font-medium text-primary ring-2 ring-primary/10 hover:scale-105 transition-transform"
                  >
                    {i + 1}K
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Trusted by over <span className="font-semibold">10,000+</span> investors worldwide
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 animate-fade-in">
            <Tabs defaultValue="login" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              <TabsContent value="login" className="mt-0">
                <Auth
                  supabaseClient={supabase}
                  appearance={{ 
                    theme: ThemeSupa,
                    variables: {
                      default: {
                        colors: {
                          brand: '#0F4C3A',
                          brandAccent: '#86DC3D',
                        },
                      },
                    },
                  }}
                  providers={[]}
                  view="sign_in"
                />
              </TabsContent>
              <TabsContent value="signup" className="mt-0">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
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
                className="p-8 bg-white rounded-xl border border-gray-100 hover:border-primary/20 transition-all duration-300 hover:shadow-lg group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-16 h-16 bg-primary/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join our platform today and start growing your wealth with confidence
            </p>
            <Button
              onClick={() => {
                const signupTab = document.querySelector('[value="signup"]') as HTMLButtonElement;
                if (signupTab) signupTab.click();
              }}
              className="bg-secondary hover:bg-secondary/90 text-primary px-8 py-6 rounded-lg text-lg font-semibold transition-colors inline-flex items-center gap-2 hover:scale-105 transform transition-transform"
            >
              Get Started Now
              <ArrowUpRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;