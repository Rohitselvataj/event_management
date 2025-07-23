import { useState } from "react";
import axios from "../utils/axios";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  const validate = () => {
    const errs = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pwdRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

    if (!form.name.match(/^[A-Za-z]+$/))
      errs.name = "Name must be alphabetic.";
    if (!emailRegex.test(form.email)) errs.email = "Invalid email address.";
    if (!pwdRegex.test(form.password))
      errs.password =
        "Password must include upper, lower, number, symbol, and be 8+ chars.";
    if (form.password !== form.confirm_password)
      errs.confirm_password = "Passwords do not match.";

    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valErr = validate();
    if (Object.keys(valErr).length) return setErrors(valErr);

    try {
      const res = await axios.post("/user/signup/", form);
      setSuccess(res.data.message);
      setErrors({});
    } catch (err) {
      setErrors({ api: err.response?.data?.error || "Signup failed" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-3xl font-semibold text-center text-blue-700 mb-6">User Signup</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { name: "name", label: "Full Name", type: "text" },
            { name: "email", label: "Email Address", type: "email" },
            { name: "password", label: "Password", type: "password" },
            { name: "confirm_password", label: "Confirm Password", type: "password" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={`Enter ${field.label}`}
                value={form[field.name]}
                onChange={(e) =>
                  setForm({ ...form, [field.name]: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {errors.api && (
            <p className="text-red-500 text-sm mt-1 text-center">{errors.api}</p>
          )}
          {success && (
            <p className="text-green-600 text-sm mt-1 text-center">{success}</p>
          )}

          <button
            type="submit"
            disabled={Object.keys(validate()).length > 0}
            className="w-full bg-blue-600 hover:bg-blue-700 transition duration-200 text-white font-semibold py-2 rounded-lg shadow disabled:opacity-50"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
