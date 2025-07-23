import { useState } from "react";
import Login from "../components/userLogin";
import Signup from "../components/Signup"; // ✅ your working login logic

const UserAuth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        {isLogin ? (
          <>
            <Login />
            <p className="text-center mt-4">
              Don't have an account?{" "}
              <button
                className="text-green-600 font-bold"
                onClick={() => setIsLogin(false)}
              >
                Register
              </button>
            </p>
          </>
        ) : (
          <>
            {/* 🟩 Your register form can go here */}
            <p className="text-xl text-center"><Signup /></p>
            <p className="text-center mt-4">
              Already registered?{" "}
              <button
                className="text-green-600 font-bold"
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

export default UserAuth;
