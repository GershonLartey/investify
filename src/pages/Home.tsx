import { ArrowRight, TrendingUp, Shield, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Smart Investments",
      description: "Access curated investment opportunities with high potential returns",
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Platform",
      description: "Your investments are protected with bank-level security",
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Competitive Returns",
      description: "Earn competitive returns on your investment portfolio",
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8">
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900">
          Invest in Your Future
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-600">
          Start your investment journey today with our secure and profitable investment packages
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative group bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;