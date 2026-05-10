import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  signUp: async (
    username,
    password,
    confirmPassword,
    email,
    firstName,
    lastName,
  ) => {
    try {
      set({ loading: true });
      // Gọi api
      await authService.signUp(
        username,
        password,
        confirmPassword,
        email,
        firstName,
        lastName,
      );

      toast.success("Đăng kí thành công! Vui lòng đăng nhập!");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Đăng kí không thành công!");
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
