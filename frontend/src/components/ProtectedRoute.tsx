import { useLogto } from "@logto/react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated } = useLogto();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
        <div className="max-w-md w-full space-y-6 p-8 bg-white rounded-lg shadow-sm">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-6">Please sign in to access this page</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
