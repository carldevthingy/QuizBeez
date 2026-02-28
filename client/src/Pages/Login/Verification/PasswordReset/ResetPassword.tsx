import { useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { useFetch } from '@/hooks/api/useFetch';
import { FloatingLabel } from '@/components/forms/FloatingLabel';


const PasswordReset = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [shakeButton, setShakeButton] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const { fetchData, error, loading } = useFetch<{ msg: string }>();

  //   const errorMessage = useRef<HTMLDivElement>(null);

  const handleFormError = (message: string) => {
    setFormError(message);
    setShakeButton(true);
    setTimeout(() => setShakeButton(false), 800);
  };

  const handleChangePassword = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (successMessage) setSuccessMessage("");

    if (!password || !confirmPassword) return;


    if (password !== confirmPassword) {
      handleFormError("Password must match")
    }

    // fetch response from backend and handle errors
    const response = await fetchData(
      `/api/auth/password-reset/${token}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, confirmPassword }),
      }
    );
    if (response?.ok) {
      setSuccessMessage(response.message);
    } else if (response?.message) {
      handleFormError(response.message);
    } else if (error) {
      handleFormError("Network or server error occurred" + response.msg);
    }
  };

  return (
    <>

          <div
            className=" w-full p-6 max-h-screen bg-white rounded-xl shadow-lg flex flex-col gap-6 animate__animated animate__pulse"
          >


            <h2 className="text-2xl font-bold text-center text-gray-800">
              Reset password
            </h2>
          <form className="flex flex-col gap-4" onSubmit={handleChangePassword}>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="peer block w-full rounded-md border-b-2 border-gray-300 bg-transparent px-2 pt-5 pb-2 text-gray-900 focus:border-dark-yellow/95 focus:outline-none"
                id="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FloatingLabel htmlFor="password" label="Password" />
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="peer block w-full rounded-md border-b-2 border-gray-300 bg-transparent px-2 pt-5 pb-2 text-gray-900 focus:bg-dark-yellow/95 focus:outline-none"
                id="confirmPassword"
                placeholder=""
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <FloatingLabel htmlFor="confirmPassword" label="Confirm Password" />
            </div>
            <div className="flex items-center ml-1 space-x-2">
              <input
                type="checkbox"
                id="showPassword"
                checked={showPassword}
                onChange={(e) => setShowPassword(e.target.checked)}
                className="w-4 h-4 text-dark-yellow border-gray-300 rounded focus:ring-dark-yellow/95"
              />
              <label htmlFor="showPassword" className="text-gray-500 select-none cursor-pointer">
                Show password
              </label>
            </div>
            {/* Error/Success Message */}
            {(formError || successMessage) && (
              <div
                className={`px-2 animate__animated animate__fadeIn ${successMessage ? 'text-green-500' : 'text-red-500'
                  }`}
              >
                {successMessage || formError}
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-md bg-dark-yellow text-white font-semibold hover:bg-dark-yellow/95 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${shakeButton ? "animate__animated animate__shakeX" : ""
                } disabled:cursor-wait`

              }
            >
              {loading ? "Resetting password..." : "Reset password"}
            </button>
          </form>
    <div className="flex justify-center -mt-3">
       <p className="text-center text-gray-600 text-sm">
                  Done changing password?{" "}
                    <Link
                    to="/user/login"
                    className="text-sm text-dark-yellow hover:text-dark-yellow/95 underline"
                  >
                    Go to login
                  </Link>
                </p>

                </div>
        </div>

    </>
  )
}

export default PasswordReset