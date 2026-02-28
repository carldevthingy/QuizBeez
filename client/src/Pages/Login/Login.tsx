import { useState } from "react";
import { useFetch } from "@/hooks/api/useFetch";
import { FloatingLabel } from "@/components/forms/FloatingLabel";
import Register from "./Register";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft } from "react-icons/fa";


export type FormControls = {
  toggleFlip: () => void;
  handleFormError: (error: string) => void;
  formError: string | null;
  setFormError: React.Dispatch<React.SetStateAction<string | null>>;
  shakeButton: boolean;
}


const Login = () => {
  // Input State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [isFlipped, setIsFlipped] = useState(false) // true = login | false = register

  const [formError, setFormError] = useState<string | null>(null);
  const [shakeButton, setShakeButton] = useState(false);

  const { fetchData, error, loading } = useFetch<{ msg: string }>();

  const { checkAuth } = useAuth();


  // Toggle between login and register cards
  const toggleFlip = () => {
    // Clear error state when flipping
    setFormError(null);
    setIsFlipped(prev => !prev);
  };

  const handleFormError = (message: string) => {
    setFormError(message);
    setShakeButton(true);
    setTimeout(() => setShakeButton(false), 800);
  };


  // Handle login submission
  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null); // Reset error before request

    if (!email || !password) return;

    const response = await fetchData("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (response?.ok) {
      await checkAuth();
      // redirect prob
    } else if (response?.message) {
      setFormError(response.message);
    } else if (error) {
      setFormError("Network or server error occurred");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  const registerProps: FormControls = { toggleFlip, handleFormError, formError, setFormError, shakeButton };

  return (

        <div className="relative w-full" id="card">

          {/* LOGIN CARD */}
          {!isFlipped &&
          <div
            className="w-full p-6 bg-white max-h-screen rounded-xl shadow-lg flex flex-col gap-6 transform animate__animated animate__pulse"
          >
              <div className="flex justify-start -mt-3">
                <Link
                to="/game"
                className="text-sm inline-flex items-center gap-1 text-dark-yellow hover:text-dark-yellow/95 underline"
                >
                  <FaArrowLeft /> Game
                </Link>
              </div>
            <h2 className="text-2xl -mt-5 font-bold text-center text-gray-800">
              LOGIN
            </h2>

            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              {/* Email */}
              <div className="relative">
                <input
                  type="text"
                  className="peer block w-full rounded-md border-b-2 border-gray-300 bg-transparent px-2 pt-5 pb-2 text-gray-900 focus:border-dark-yellow focus:outline-none"
                  id="loginEmail"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <FloatingLabel htmlFor="loginEmail" label="Email address" />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="peer block w-full rounded-md border-b-2 border-gray-300 bg-transparent px-2 pt-5 pb-2 text-gray-900 focus:border-dark-yellow focus:outline-none"
                  id="loginPass"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <FloatingLabel htmlFor="loginPass" label="Password" />
                <span
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer select-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? "Hide" : "Show"}
                </span>

              </div>
              <div className="flex justify-end -mt-3">
                  <Link
                    to="/auth/password-reset"
                    className="text-sm text-dark-yellow underline"
                  >
                    Forgot password?
                  </Link>
                </div>

              {/* Error Message - Conditionally Rendered */}
              {formError && (
                <div className="px-2 text-red-500 animate__animated animate__fadeIn">
                  {formError}
                </div>
              )}

              {/* Login Button */}
              <div className="w-full gap-1 flex items-center justify-center">
                <button
                  onClick={handleGoogleLogin}
                  className="w-1/6 bg-gray-100 hover:bg-gray-200 cursor-pointer drop-shadow-sm text-white font-semibold py-2 px-4 rounded shadow transition-colors duration-200"
                >
                <FcGoogle size={22} />
                </button>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 rounded-md bg-dark-yellow text-white font-semibold hover:bg-dark-yellow/95 hover:cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  shakeButton ? "animate__animated animate__shakeX" : ""
                } disabled:cursor-wait`

              }
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
              </div>

              {/* Flip to Register */}
              <div className="text-center">
                <p className="text-center text-gray-600 text-sm">
                  Don't have an account?{" "}
                  <span
                    className="flip-link text-dark-yellow font-medium cursor-pointer underline"
                    onClick={toggleFlip}
                  >
                    Register
                  </span>
                </p>
              </div>
            </form>

            {/* Google Login Button */}

          </div>
}
          {isFlipped &&
          <div
            className="relative max-h-screen w-full p-6 bg-white rounded-xl shadow-lg flex-col gap-4 animate__animated animate__pulse"
          >
            <h2 className="text-2xl font-bold text-center text-gray-800">
              REGISTER
            </h2>
            <Register {...registerProps} />
          </div>
        }
        </div>


  );
};

export default Login;