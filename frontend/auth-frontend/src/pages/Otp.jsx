import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";

export default function Otp() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [msg, setMsg] = useState("");

  const email = localStorage.getItem("otpEmail");

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await api.post("/auth/verify-otp", {
        email,
        otp
      });

      setMsg(res.data.message);

      setTimeout(() => {
        localStorage.removeItem("otpEmail");
        navigate("/home");
      }, 1000);
    } catch (error) {
      setMsg(error.response?.data?.message || "OTP verification failed");
    }
  };

  const resendOtp = async () => {
    try {
      const res = await api.post("/auth/send-otp", { email });
      setMsg(res.data.message);
    } catch (error) {
      setMsg(error.response?.data?.message || "Resend failed");
    }
  };

  return (
    <div className="auth-container">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h1 className="title">Verify OTP 🔐</h1>
        <p className="subtitle">
          OTP sent to <b>{email}</b>
        </p>

        {msg && <p className="msg">{msg}</p>}

        <form onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />

          <button className="btn">Verify OTP</button>
        </form>

        <button className="link-btn" onClick={resendOtp}>
          Resend OTP
        </button>
      </motion.div>
    </div>
  );
}
