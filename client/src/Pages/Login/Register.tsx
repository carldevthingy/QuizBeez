import { useState} from "react";
import { FloatingLabel } from "@/components/forms/FloatingLabel";
import { useFetch } from "@/hooks/api/useFetch";
import { type FormControls } from "./Login";
import validator from "validator";
import { FcGoogle } from "react-icons/fc";


const Register = ({ toggleFlip, handleFormError, formError, setFormError, shakeButton }: FormControls) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const { fetchData, loading, error } = useFetch<{ msg: string }>();


  const handleRegister = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if(successMessage) setSuccessMessage("");

    if (!username || !email || !password) return;

    if (!validator.isEmail(email)) {
      handleFormError("Please enter a valid email address.");
      return;
    }

    if (username.length < 4) {
      handleFormError("username must be at least 4 characters");
      return;
    }

    if(password.length < 6) {
      handleFormError("Password must be at least 6 characters");
      return;
    }

    // fetch response from backend and handle errors
    const response = await fetchData(
      "/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      }
    );
    if (response?.ok) {
      setSuccessMessage(response.message);
    } else if (response?.message) {
      handleFormError(response.message);
    } else if (error) {
      handleFormError("Network or server error occurred");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google";
  };

  return (
    <form
      id="registerForm"
      className="flex flex-col gap-4"
      onSubmit={handleRegister}
    >
      {/* Username */}
      <div className="relative">
        <input
          type="text"
          className="peer block w-full rounded-md border-b-2 border-gray-300 bg-transparent px-2 pt-5 pb-2 text-gray-900 focus:border-blue-500 focus:outline-none"
          id="username"
          placeholder=""
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <FloatingLabel htmlFor="username" label="Username" isEditing={false} />
      </div>

      {/* Email */}
      <div className="relative">
        <input
          type="email"
          className="peer block w-full rounded-md border-b-2 border-gray-300 bg-transparent px-2 pt-5 pb-2 text-gray-900 focus:border-blue-500 focus:outline-none"
          id="regEmail"
          placeholder=""
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <FloatingLabel htmlFor="regEmail" label="Email" isEditing={false} />
      </div>

      {/* Password */}
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className="peer block w-full rounded-md border-b-2 border-gray-300 bg-transparent px-2 pt-5 pb-2 text-gray-900 focus:border-blue-500 focus:outline-none"
          id="regPass"
          placeholder=""
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <FloatingLabel htmlFor="regPass" label="Password" isEditing={false} />
        <span
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer select-none"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? "Hide" : "Show"}
        </span>
      </div>

      {/* Error/Success Message */}
      {(formError || successMessage) && (
        <div
          className={`px-2 animate__animated animate__fadeIn ${
            successMessage ? 'text-green-500' : 'text-red-500'
          }`}
        >
          {successMessage || formError}
        </div>
      )}

      {/* Register Button */}
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
          className={`w-full py-2 rounded-md bg-light-yellow text-dark-yellow font-semibold hover:bg-light-yellow/90  hover:cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed  ${shakeButton ? 'animate__animated animate__shakeX' : ''} disabled:cursor-wait`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </div>

      {/* Flip back to login */}
      <div className="text-center text-gray-600 text-sm">
        <p>
          Already a member?{" "}
          <span
            className="text-dark-yellow font-medium cursor-pointer underline"
            onClick={toggleFlip}
          >
            Login
          </span>
        </p>
      </div>
    </form>
  );
};

export default Register;
