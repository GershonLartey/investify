import React from 'react';
import SignUpForm from '@/components/SignUpForm';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Welcome to Our Platform
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up or log in to get started
          </p>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
};

export default Home;