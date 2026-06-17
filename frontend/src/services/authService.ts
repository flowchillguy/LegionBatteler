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

  fetchMe: async () => {
    const res = await api.get("/users/me", { withCredentials: true });
    return res.data.user;
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh", {}, { withCredentials: true });
    return res.data.accessToken;
  },

  patchProfile: async (
    bio: string,
    displayName: string,
    email: string,
    password: string,
    passwordComfirm: string,
  ) => {
    const res = await api.patch(
      "/users/me",
      {
        bio,
        displayName,
        email,
        password,
        passwordComfirm,
      },
      { withCredentials: true },
    );

    return res.data;
  },

  getPassword: async (username: string) => {
    const res = await api.post(
      "/helper/password/",
      { username },
      { withCredentials: true },
    );

    return res.data;
  },

  getFriendList: async () => {
    const res = await api.get("/friends/", { withCredentials: true });

    return res.data.friends;
  },
};
