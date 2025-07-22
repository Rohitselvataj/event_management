import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm_password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!form.username.match(/^[A-Za-z]+$/)) errs.username = "Name must contain only letters.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = "Email is not valid.";
    if (form.password.length < 6) errs.password = "Password too short.";
    if (form.password !== form.confirm_password) errs.confirm_password = "Passwords do not match.";
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
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Admin Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["username", "email", "password", "confirm_password"].map((field) => (
          <div key={field}>
            <input
              type={field.includes("password") ? "password" : "text"}
              placeholder={field.replace("_", " ").toUpperCase()}
              value={form[field]}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              className="w-full border p-2 rounded"
            />
            {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
          </div>
        ))}
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
