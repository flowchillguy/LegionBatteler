import api from "@/lib/axios";

export const authService = {
  signUp: async (
    username: string,
    password: string,
    confirmPassword: string,
    email: string,
    firstName: string,
    lastName: string,
  ) => {
    const res = await api.post(
      "/auth/signup",
      { username, password, confirmPassword, email, firstName, lastName },
      { withCredentials: true },
    );

    return res.data;
  },
};
