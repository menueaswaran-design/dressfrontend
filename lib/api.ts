import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://dressbackend.vercel.app/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  if (typeof window !== "undefined") {
    const { auth } = await import("./firebase");
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
