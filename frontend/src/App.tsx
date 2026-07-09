import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import MainLobbyPage from "./pages/MainLobbyPage";
import { Toaster } from "sonner";
import TrialPage from "./pages/TrialPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import { useThemeStore } from "@/stores/useThemeStore";
import { useEffect } from "react";
import { connectSocket, disconnectSocket } from "./services/socketService";

function App() {
  // Chạy mặc định sáng tối
  const { isDark, setTheme } = useThemeStore();

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  useEffect(() => {
    // kết nối socket
    connectSocket();

    return () => {
      // ngắt kết nối khi out
      disconnectSocket();
    };
  }, []);

  return (
    <>
      {/* Đặt Toaster ở đầu với richColors giúp thông báo hiển thị trên tất cả các trang */}
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/trial" element={<TrialPage />} />

          {/* protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLobbyPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
