import { BrowserRouter, Route, Routes } from "react-router";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import MainLobbyPage from "./pages/MainLobbyPage";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      {/* Đặt Toaster ở đầu với richColors giúp thông báo hiển thị trên tất cả các trang */}
      <Toaster richColors />
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />

          {/* protected routes */}
          <Route path="/" element={<MainLobbyPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
