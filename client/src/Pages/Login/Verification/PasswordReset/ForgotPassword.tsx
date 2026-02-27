import { useState } from 'react'
import { useFetch } from '@/hooks/api/useFetch';
import { FloatingLabel } from '@/components/forms/FloatingLabel';
import validator from 'validator'
import { Link } from 'react-router-dom';


const ForgotPassword = () => {
  const [formError, setFormError] = useState<string | null>(null);
  const [shakeButton, setShakeButton] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [email, setEmail] = useState("")

  const { fetchData, error, loading } = useFetch<{ msg: string }>();

    // const errorMessage = useRef<HTMLDivElement>(null);

  const handleFormError = (message: string) => {
    setFormError(message);
    setShakeButton(true);
    setTimeout(() => setShakeButton(false), 800);
  };

  const handleChangePassword = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (successMessage) setSuccessMessage("");

    if (!email) return;


    if (!validator.isEmail(email)) {
      handleFormError("Invalid email")
    }

    // fetch response from backend and handle errors
    const response = await fetchData(
      `/api/auth/password-reset/`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, }),
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
            className=" w-full p-6 bg-white rounded-xl shadow-lg flex flex-col gap-6 animate__animated animate__pulse"
          >
                 <div className="flex justify-start -mt-3">
                  <Link
                    to="/auth/login"
                    className="text-sm text-dark-yellow hover:text-dark-yellow/95 underline"
                  >
                    Back
                  </Link>
                </div>
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Reset password
            </h2>
          <form className="flex flex-col gap-4" onSubmit={handleChangePassword}>
            <div className="relative">
              <input
                type= "text"
                className="peer block w-full rounded-md border-b-2 border-gray-300 bg-transparent px-2 pt-5 pb-2 text-gray-900 focus:border-dark-yellow/95 focus:outline-none"
                id="email"
                placeholder=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <FloatingLabel htmlFor="email" label="Email" />
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
              {loading ? "Sending Email..." : "Continue"}
            </button>
          </form>

        </div>

    </>
  )
}

export default ForgotPassword;