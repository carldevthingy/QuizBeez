// src/App.tsx
import { Route, BrowserRouter as Router, Routes, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import { useAuth } from './context/AuthContext.ts';
import Login from './Pages/Login/Login.tsx';
import VerifyPage from './Pages/Login/Verification/VerifyPage.tsx';
import ResetPassword from './Pages/Login/Verification/PasswordReset/ResetPassword.tsx';
import ForgotPassword from './Pages/Login/Verification/PasswordReset/ForgotPassword.tsx';
import BeeGame from './Pages/game/BeeGame.tsx';
import Home from './Pages/home/Home.tsx';
import { AuthLayout } from './Pages/auth/AuthLayout.tsx';
import './App.css';
import UserProfile from './Pages/profile/UserProfile.tsx';

const GuestRoute = () => {
  const { user, isLoading } = useAuth();

  // Wait auth check otherwise
  if (isLoading) return  <div className="flex flex-col h-screen bg-light-yellow items-center justify-center">
          <img
            src="/game/loader.png"
            alt="Loading..."
            className="w-lg h-lg"
          />
          <h1 className='font-title text-5xl text-dark-yellow'>Loading...</h1>
        </div>;

  return user ? <Navigate to="/game" replace /> : <Outlet />;
};

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen text-center bg-light-yellow">
    <h1 className="text-4xl font-black mb-4">404 - Page Not Found</h1>
    <p className="mb-4 font-medium">The page you are looking for doesn't exist.</p>
    <a href="/" className="text-blue-500 hover:underline font-bold">Go back home</a>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<BeeGame />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/auth" element={<AuthLayout />}>

           {/* REDIRECT IF USER IS LOGGED IN  */}
            <Route element={<GuestRoute />}>
              <Route path="login" element={<Login />} />
              <Route path="password-reset" element={<ForgotPassword />} />
            </Route>

            <Route path="verification/:token" element={<VerifyPage />} />
            <Route path="password-reset/:token" element={<ResetPassword />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;