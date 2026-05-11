import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  setAccessToken: (accessToken) => {
    set({ accessToken });
  },

  clearState: () => {
    set({
      accessToken: null,
      user: null,
      loading: false,
    });
  },

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

  signIn: async (username, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIp(username, password);
      get().setAccessToken(accessToken);
      await get().fetchMe();

      toast.success("Đăng nhập thành công!");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Đăng nhập không thành công!");
      return false;
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    try {
      get().clearState();

      await authService.signOut();
      toast.success("Đăng xuất thành công!");
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Đăng xuất không thành công!");
      return false;
    }
  },

  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();

      set({ user });
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null });
      toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng. Hãy thử lại!");
    } finally {
      set({ loading: false });
    }
  },

  refresh: async () => {
    try {
      set({ loading: true });
      const { user, fetchMe, setAccessToken } = get();
      const accessToken = await authService.refresh();

      setAccessToken(accessToken);

      if (!user) {
        await fetchMe();
      }
    } catch (error) {
      console.error(error);
      get().clearState;
      toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
    } finally {
      set({ loading: false });
    }
  },
}));
