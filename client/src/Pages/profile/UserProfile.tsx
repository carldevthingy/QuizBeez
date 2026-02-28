import { useState } from "react";
import { useAuth, type User } from "@/context/AuthContext";
import { useFetch } from "@/hooks/api/useFetch";
import { FloatingLabel } from "@/components/forms/FloatingLabel";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { DeleteProfileConfirmationModal } from "@/components/profile/DeleteProfileConfirmationModal";
import { FaArrowLeft } from "react-icons/fa";

const UserProfile = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { fetchData, loading } = useFetch<{ message: string; user: User }>();
  const { fetchData: fetchReset, loading: resetLoading } = useFetch();
  const { fetchData: fetchDelete, loading: deleteLoading } = useFetch();
  const [username, setUsername] = useState<string | undefined>(undefined);



  const currentUsername = username !== undefined ? username : user?.username || "";

  const handleUpdateProfile = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage("");

    if (!currentUsername) return setFormError("Username cannot be empty.");

    const response = await fetchData("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username }),
    });

    if (response?.user) {
      setSuccessMessage("Profile updated successfully!");
    } else if (response?.message) {
      setFormError(response.message);
    }
  };

  const handlePasswordReset = async () => {
    setResetSent(false);

    const response = await fetchReset("/api/auth/password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user?.email }),
    });

    if (response?.ok ) {
      setResetSent(true);
    } else {
      setFormError(response?.message || "Failed to send reset email.");
    }
  };

  const confirmDeleteAccount = async () => {
    const response = await fetchDelete("/api/user/profile", {
      method: "DELETE",
    });

    if (response?.message === "Account deleted successfully" || response?.ok) {
      logout();
      navigate("/");
    } else {
      setFormError("Failed to delete account. Please try again.");
      setShowDeleteModal(false);
    }
  };

   if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fffcf3] flex flex-col items-center gap-2 justify-center">
      <div className="text-6xl text-center"><img src="/game/loader.png" alt="loading" /></div>

        <h2 className="text-2xl font-bold text-dark-yellow animate-pulse">Loading profile...</h2>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }


  return(
  <div className="min-h-screen bg-[#fffcf3] flex flex-col items-center justify-center pt-12 px-4 relative">
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-lg flex flex-col gap-6 animate__animated animate__fadeIn">
        <div className="flex justify-start -mt-3">
          <Link
            to="/game"
            className="text-sm text-dark-yellow hover:text-dark-yellow/95 underline inline-flex items-center gap-1"
          >
            <FaArrowLeft /> Game
          </Link>
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800">
          Edit Profile
        </h2>

        {/* --- Profile Picture --- */}
        <div className="flex justify-center -mt-2 mb-2">
          <div className="w-24 h-24 rounded-full border-4 border-dark-yellow overflow-hidden shadow-md flex items-center justify-center bg-gray-100">
            {user?.profile ? (
              <img
                src={user.profile}
                alt={`${currentUsername}'s avatar`}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              <svg
                className="w-12 h-12 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            )}
          </div>
        </div>

        {(formError || successMessage) && (
          <div
            className={`px-2 text-center text-sm font-semibold ${
              successMessage ? "text-green-500" : "text-red-500"
            }`}
          >
            {successMessage || formError}
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleUpdateProfile}>
          <div className="relative">
            <input
              type="text"
              id="username"
              className="peer block w-full rounded-md border-b-2 border-gray-300 bg-transparent px-2 pt-5 pb-2 text-gray-900 focus:border-dark-yellow/95 focus:outline-none"
              value={currentUsername}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FloatingLabel htmlFor="username" label="Username" />
          </div>

          <div className="relative">
            <input
              type="text"
              id="email"
              className="peer block w-full rounded-md border-b-2 border-gray-200 bg-gray-50 px-2 pt-5 pb-2 text-gray-500 cursor-not-allowed focus:outline-none"
              value={user?.email || ""}
              disabled
            />
            <FloatingLabel htmlFor="email" label="Email" />
          </div>

          <div className="relative flex flex-col gap-2">
            <div className="relative">
              <input
                type="password"
                id="password"
                className="peer block w-full rounded-md border-b-2 border-gray-200 bg-gray-50 px-2 pt-5 pb-2 text-gray-500 cursor-not-allowed focus:outline-none"
                value="********"
                disabled
              />
              <FloatingLabel htmlFor="password" label="Password" />
            </div>

            <div className="flex items-center justify-between mt-1">
              {resetSent ? (
                <p className="text-sm text-green-600 font-semibold animate__animated animate__fadeIn">
                  Email sent!
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  disabled={resetLoading}
                  className="text-sm text-dark-yellow hover:underline disabled:opacity-50"
                >
                  {resetLoading ? "Sending..." : "Send password reset link"}
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 rounded-md bg-dark-yellow text-white font-semibold hover:bg-dark-yellow/90 hover:cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <hr className="my-2 border-gray-200" />

        <div className="text-center">
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="text-sm font-bold text-red-500 hover:text-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteProfileConfirmationModal
          onConfirm={confirmDeleteAccount}
          onCancel={() => setShowDeleteModal(false)}
          isDeleting={deleteLoading}
        />
      )}
    </div>

    );
};

export default UserProfile;