// axios giúp gọi api dễ và tiện lợi hơn so với fetch
import axios from "axios";

// Tạo api
const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api",
  withCredentials: true,
});

export default api;
