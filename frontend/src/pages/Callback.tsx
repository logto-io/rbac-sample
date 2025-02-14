import { useHandleSignInCallback } from "@logto/react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();
  const { isLoading } = useHandleSignInCallback(() => {
    // Navigate to root path when finished
    navigate("/");
  });

  // Display a loading message when the callback is in progress
  if (isLoading) {
    <div className="text-center">
      <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700">Signing you in...</h2>
      <p className="text-gray-500 mt-2">
        Please wait while we complete the authentication process.
      </p>
    </div>;
  }

  return null;
};

export default Callback;
