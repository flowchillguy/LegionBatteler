// axios giúp gọi api dễ và tiện lợi hơn so với fetch
import { useAuthStore } from "@/stores/useAuthStore";
import axios from "axios";

// Tạo api
const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:3000/api"
      : "/api",
  withCredentials: true,
});

// Gắn access token vào mọi req header sau khi đăng nhập thành công
// Mỗi lần có req gửi đi hàm này sẽ được chạy trước
api.interceptors.request.use((config) => {
  // useAuthStore => lấy và cập nhập liên tục trạng thái
  // useAuthStore.getState => lấy trạng thái hiện tại và không cập nhập
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Tự động gọi refresh api khi access token hết hạn
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // Những api không cần check
    if (
      originalRequest.url.includes("/auth/signin") ||
      originalRequest.url.includes("/auth/signup") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      // Bỏ qua trả về lỗi luôn
      return Promise.reject(error);
    }

    // Giới hạn 1 lần thử gọi lại accessToken tránh vòng lặp vô hạn
    originalRequest._retryCount = originalRequest._retryCount || 0;

    if (error.response?.status === 403 && originalRequest._retryCount < 1) {
      originalRequest._retryCount++;

      try {
        const res = await api.post(
          "/auth/refresh",
          {},
          { withCredentials: true },
        );
        const newAccessToken = res.data.accessToken;

        useAuthStore.getState().setAccessToken(newAccessToken);

        // Gắn accessToken mới vào header của req cũ đã hết hạn accessToken
        originalRequest.headers.authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearState();
        return Promise.reject(refreshError);
      }
    }

    // Với các lỗi không phải 403 trả về lỗi luôn
    return Promise.reject(error);
  },
);

export default api;
