import { useLogto } from '@logto/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const { isAuthenticated, signIn, isLoading } = useLogto();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to CMS</h1>
          <p className="text-gray-600 mb-8">Manage your content with ease and security</p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => signIn('http://localhost:5173/callback')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing; 