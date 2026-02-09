import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };

    getUser();
  }, []);

  return (
    <div>
      <Navbar user={user} />

      <div className="home">
        <motion.div
          className="home-card"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Welcome {user?.name} 🎉</h1>
          <p>
            Your email is <b>{user?.email}</b>
          </p>

          <div className="features">
            <motion.div whileHover={{ scale: 1.05 }} className="feature-box">
              <h3>🔐 Secure Auth</h3>
              <p>JWT + Cookies based authentication</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="feature-box">
              <h3>📩 OTP Verification</h3>
              <p>Email OTP verification system enabled</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="feature-box">
              <h3>⚡ Fast Backend</h3>
              <p>Optimized response + middleware protection</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
