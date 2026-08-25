import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    first_name: "",     
    last_name: "",       
    password: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await register(form);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error);
      setErr("⚠️ Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

        {err && (
          <p className="text-red-600 text-center mb-4 font-medium">{err}</p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={onChange}
            className={inputClass}
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            className={inputClass}
          />

          <div className="grid md:grid-cols-2 gap-4">
            <input
              name="first_name"
              placeholder="First Name"
              value={form.first_name}
              onChange={onChange}
              className={inputClass}
            />
            <input
              name="last_name"
              placeholder="Last Name"
              value={form.last_name}
              onChange={onChange}
              className={inputClass}
            />
          </div>

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            className={inputClass}
            required
          />

          <button
            type="submit"
           
      
          >
            { "Register"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>
        </p>
      </div>
    </div>
  );  
}       