import axios from "axios";

const api = axios.create({
  baseURL: "https://auth-app-3fzq.onrender.com/api",
  withCredentials: true
});

export default api;

