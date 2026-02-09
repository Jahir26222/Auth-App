import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/auth/login", form);
      setMsg(res.data.message);
      navigate("/home");
    } catch (error) {
      setMsg(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="title">Welcome Back 👋</h1>
        <p className="subtitle">Login to continue</p>

        {msg && <p className="msg">{msg}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />
          <div className="password-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />

            <span
              className="toggle-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>





          <button className="btn">Login</button>
        </form>

        <p className="switch">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
