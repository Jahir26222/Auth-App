import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);


  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false); // ✅ new state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true); // ✅ start loading

    try {
      const res = await api.post("/auth/register", form);

      setMsg(res.data.message);

      localStorage.setItem("otpEmail", form.email);

      setTimeout(() => {
        navigate("/otp");
      }, 1000);
    } catch (error) {
      setMsg(error.response?.data?.message || "Register failed");
      setLoading(false); // ✅ stop loading if error
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <h1 className="title">Create Account</h1>
        <p className="subtitle">Register to get started</p>

        {/* ✅ Loading + Message Area */}
        {loading ? (
          <div className="msg loading-msg">
            <span className="spinner"></span>
            Sending OTP...
          </div>
        ) : (
          msg && <p className="msg">{msg}</p>
        )}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Enter Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
          />

          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />

          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              disabled={loading}
            />

            <span
              className="toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>


          {/* ✅ Button disable + text change */}
          <button className="btn" disabled={loading}>
            {loading ? "Processing..." : "Register"}
          </button>
        </form>

        <p className="switch">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
