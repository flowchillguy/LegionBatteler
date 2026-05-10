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

  signIp: async (username: string, password: string) => {
    const res = await api.post(
      "auth/signin",
      { username, password },
      { withCredentials: true },
    );
    return res.data; // accessToken
  },

  signOut: async () => {
    return api.post("/auth/signout", {}, { withCredentials: true });
  },
};
