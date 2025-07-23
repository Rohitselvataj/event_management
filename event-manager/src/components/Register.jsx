import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.username.match(/^[A-Za-z]+$/))
      errs.username = "Name must contain only letters.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      errs.email = "Email is not valid.";
    if (form.password.length < 6)
      errs.password = "Password must be at least 6 characters.";
    if (form.password !== form.confirm_password)
      errs.confirm_password = "Passwords do not match.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) return setErrors(validationErrors);
    try {
      await axios.post("http://localhost:8000/api/register/", form);
      const res = await axios.post("http://localhost:8000/api/token/", {
        username: form.username,
        password: form.password,
      });
      localStorage.setItem("token", res.data.access);
      navigate("/create-event");
    } catch (err) {
      if (err.response?.data) setErrors(err.response.data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">Admin Register</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {["username", "email", "password", "confirm_password"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                {field.replace("_", " ")}
              </label>
              <input
                type={field.includes("password") ? "password" : "text"}
                placeholder={`Enter ${field.replace("_", " ")}`}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors[field] && (
                <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold py-2 rounded-lg shadow"
          >
            Register
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already registered?{" "}
          <span
            className="text-blue-600 hover:underline cursor-pointer"
            onClick={() => navigate("/admin-login")}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
