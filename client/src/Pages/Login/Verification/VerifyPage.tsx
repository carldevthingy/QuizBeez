import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const VerifyPage = () => {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/auth/verify/${token}`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
        } else {
          setError(data.message || "Verification failed");
          setStatus("error");
        }
      } catch (err) {
        console.error("Error verifying user:", err);
        setError("Something went wrong. Please try again.");
        setStatus("error");
      }
    };

    verifyUser();
  }, [token]);

  return (
      <div className="w-full max-h-screen max-w-md bg-white rounded-2xl shadow-xl p-8 text-center animate__animated animate__pulse space-y-6">

        <h1 className="text-2xl font-semibold text-gray-800">
          Email Verification
        </h1>

        {status === "loading" && (
          <div className="space-y-3">
            <div className="w-10 h-10 mx-auto border-4 border-dark-yellow border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-600">Verifying your account...</p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-3">
            <div className="text-green-600 text-4xl">✓</div>
            <p className="text-green-700 font-medium">
              Your account has been successfully verified!
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-3">
            <div className="text-red-600 text-4xl">✕</div>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {status !== "loading" && (
          <Link
            to="/login"
            className="inline-block w-full bg-dark-yellow text-white py-2.5 rounded-lg font-medium hover:bg-dark-yellow/95 transition"
          >
            Continue to Login
          </Link>
        )}
      </div>

  );
};

export default VerifyPage;
