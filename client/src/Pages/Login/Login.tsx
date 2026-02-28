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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false) // true = login | false = register
  const [formError, setFormError] = useState<string | null>(null);
  const [shakeButton, setShakeButton] = useState(false);

  const { fetchData, error, loading } = useFetch<{ msg: string }>();
  const { checkAuth } = useAuth();

  const toggleFlip = () => {
    setFormError(null);
    setIsFlipped(prev => !prev);
  };

  const handleFormError = (message: string) => {
    setFormError(message);
    setShakeButton(true);
    setTimeout(() => setShakeButton(false), 800);
  };

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
    <div className="relative landscape:max-w-85 w-full max-w-sm sm:max-w-md md:max-w-lg mx-auto" id="card">

      {/* LOGIN CARD */}
      {!isFlipped &&
        <div
          className="w-full p-5  sm:p-8 landscape:p-3 bg-white rounded-xl shadow-lg flex flex-col gap-5 sm:gap-6 landscape:gap-2 transform animate__animated animate__pulse"
        >
          <div className="flex justify-start -mt-2 sm:-mt-3 landscape:mt-0">
            <Link
              to="/game"
              className="text-sm landscape:text-xs inline-flex items-center gap-1 text-dark-yellow hover:text-dark-yellow/95 underline"
            >
              <FaArrowLeft /> Game
            </Link>
          </div>

          <h2 className="text-xl sm:text-2xl landscape:text-lg -mt-4 sm:-mt-5 landscape:mt-0 font-bold text-center text-gray-800">
            LOGIN
          </h2>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 sm:gap-5 landscape:gap-2">
            {/* Email */}
            <div className="relative">
              <input
                type="text"
                className="peer block w-full rounded-md border-b-2 border-gray-300 bg-transparent px-2 pt-5 pb-2 landscape:pt-5 landscape:pb-2 text-sm sm:text-base landscape:text-xs landscape:mb-3 text-gray-900 focus:border-dark-yellow focus:outline-none"
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
                className="peer block w-full rounded-md border-b-2 border-gray-300 bg-transparent pl-2 pr-14 pt-5 pb-2 landscape:pt-3 landscape:pb-1  text-sm sm:text-base landscape:text-xs text-gray-900 focus:border-dark-yellow focus:outline-none"
                id="loginPass"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FloatingLabel htmlFor="loginPass" label="Password" />
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer select-none text-xs sm:text-sm landscape:text-[10px] font-medium p-1"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            <div className="flex justify-end -mt-2 sm:-mt-3 landscape:mt-0">
              <Link
                to="/auth/password-reset"
                className="text-xs sm:text-sm landscape:text-[10px] text-dark-yellow underline"
              >
                Forgot password?
              </Link>
            </div>

            {formError && (
              <div className="px-2 text-sm sm:text-base landscape:text-xs text-red-500 animate__animated animate__fadeIn">
                {formError}
              </div>
            )}

            {/* Login Button Area */}
            <div className="w-full gap-2 sm:gap-3 landscape:gap-2 flex items-center justify-between mt-1 sm:mt-2 landscape:mt-0">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="shrink-0 flex items-center justify-center bg-gray-50 hover:bg-gray-100 border border-gray-200 cursor-pointer text-white font-semibold py-2 px-4 landscape:py-1 landscape:px-3 rounded-md shadow-sm transition-colors duration-200"
              >
                <FcGoogle className="w-6 h-6 landscape:w-4 landscape:h-4" />
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-2 sm:py-2.5 landscape:py-1.5 rounded-md bg-dark-yellow text-white text-sm sm:text-base landscape:text-xs font-semibold hover:bg-dark-yellow/95 hover:cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                  shakeButton ? "animate__animated animate__shakeX" : ""
                } disabled:cursor-wait`}
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            {/* Flip to Register */}
            <div className="text-center mt-2 landscape:mt-0">
              <p className="text-center text-gray-600 text-xs sm:text-sm landscape:text-[10px]">
                Don't have an account?{" "}
                <span
                  className="flip-link text-dark-yellow font-medium cursor-pointer underline hover:text-dark-yellow/80 transition-colors"
                  onClick={toggleFlip}
                >
                  Register
                </span>
              </p>
            </div>
          </form>
        </div>
      }

      {/* REGISTER CARD */}
      {isFlipped &&
        <div
          className="relative w-full p-5 sm:p-8 landscape:p-3 bg-white rounded-xl shadow-lg flex flex-col gap-4 landscape:gap-2 animate__animated animate__pulse"
        >
          <h2 className="text-xl sm:text-2xl landscape:text-lg font-bold text-center text-gray-800">
            REGISTER
          </h2>
          <Register {...registerProps} />
        </div>
      }
    </div>
  );
};

export default Login;