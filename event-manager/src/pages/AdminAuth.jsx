import { useState } from "react";
import AdminLogin from "../components/Login";      // 👈 your admin login logic
import Register from "../components/Register";     // 👈 your admin register logic

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Admin Login" : "Admin Register"}
        </h2>

        {isLogin ? (
          <>
            <AdminLogin />
            <p className="text-center mt-4">
              Don't have an account?{" "}
              <button
                className="text-blue-600 font-bold"
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            <Register />
            <p className="text-center mt-4">
              Already registered?{" "}
              <button
                className="text-blue-600 font-bold"
                onClick={() => setIsLogin(true)}
              >
                Login
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminAuth;
