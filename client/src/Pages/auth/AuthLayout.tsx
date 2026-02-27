import { Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
      <div className="flex justify-center items-center h-full bg-linear-to-br from-[#d6cfb7] to-[#fbe29f]">
      <div className="relative w-[95vw] sm:w-full justify-center max-w-md margin-10 z-1">
        <Outlet />
      </div>
    </div>
  );
}
