import { Suspense } from 'react';
import LoginForm from '@/components/LoginForm';

const LoginFormSkeleton = () => {
  return (
    <div className="max-w-md mx-auto mt-10 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          <div>
            <div className="h-4 bg-gray-700 rounded w-1/6 mb-2"></div>
            <div className="h-10 bg-gray-800 rounded"></div>
          </div>
          <div>
            <div className="h-4 bg-gray-700 rounded w-1/6 mb-2"></div>
            <div className="h-10 bg-gray-800 rounded"></div>
          </div>
          <div className="h-10 bg-gray-700 rounded mt-6"></div>
        </div>
    </div>
  );
};


export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFormSkeleton />}>
      <LoginForm />
    </Suspense>
  );
}