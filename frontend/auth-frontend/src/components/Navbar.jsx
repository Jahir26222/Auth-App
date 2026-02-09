import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { motion } from "framer-motion";

export default function Navbar({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h2 className="logo">AuthApp</h2>

      <div className="nav-right">
        <p className="user-name">👤 {user?.name}</p>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </motion.nav>
  );
}
