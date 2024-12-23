import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Profile = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>

      <Card className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          <div className="mt-2 flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-gray-200"></div>
            <Button variant="outline">Change Photo</Button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <div className="pt-4">
          <Button className="w-full">Save Changes</Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;