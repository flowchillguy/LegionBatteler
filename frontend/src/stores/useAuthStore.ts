import { create } from "zustand";
import { toast } from "sonner";
import { authService } from "@/services/authService";
import type { AuthState } from "@/types/store";
import { persist } from "zustand/middleware";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,
      friends: null,

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      clearState: () => {
        set({
          accessToken: null,
          user: null,
          loading: false,
          friends: null,
        });

        localStorage.clear();
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

          localStorage.clear();

          const { accessToken } = await authService.signIp(username, password);
          get().setAccessToken(accessToken);
          await get().fetchMe();
          await get().getFriendList();

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

          await get().getFriendList();
        } catch (error) {
          console.error(error);
          get().clearState;
          toast.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        } finally {
          set({ loading: false });
        }
      },

      patchProfile: async (
        bio: string,
        displayName: string,
        email: string,
        password: string,
        passwordComfirm: string,
      ) => {
        try {
          set({ loading: true });
          const { fetchMe } = get();
          await authService.patchProfile(
            bio,
            displayName,
            email,
            password,
            passwordComfirm,
          );

          await fetchMe();
          toast.success("Cập nhập thành công!");
          return true;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Cập nhật thất bại, vui lòng thử lại!";
          toast.error(errorMessage);

          return false;
        } finally {
          set({ loading: false });
        }
      },

      getPassword: async (username: string) => {
        try {
          set({ loading: true });
          const { message, maskingEmail } =
            await authService.getPassword(username);
          if (message) {
            toast.success(message);
          }
          return maskingEmail;
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Yêu cầu thất bại, vui lòng thử lại!";
          toast.error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },

      getFriendList: async () => {
        try {
          set({ loading: true });
          const friends = await authService.getFriendList();
          set({ friends });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Lấy danh sách kết bạn thất bại, vui lòng thử lại!";
          toast.error(errorMessage);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user, friends: state.friends }), // Chỉ persist user (token, loading sẽ không lưu)
    },
  ),
);
