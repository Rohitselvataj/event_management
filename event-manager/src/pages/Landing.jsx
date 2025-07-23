import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200">
      <h1 className="text-4xl font-bold mb-8">Event Management System</h1>

      <div className="space-y-6 w-full max-w-sm">
        <button
          onClick={() => navigate("/admin-auth")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded text-lg font-semibold"
        >
          I’m an Admin
        </button>

        <button
          onClick={() => navigate("/user-auth")}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded text-lg font-semibold"
        >
          I’m a User
        </button>
      </div>
    </div>
  );
};

export default Landing;
