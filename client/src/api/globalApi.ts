import axios, { type AxiosInstance, type AxiosResponse } from "axios";
import useUserStore from "../store/useUserInfo";

const originUrl = import.meta.env.VITE_GO_BACKEND_URL;

if (originUrl == "") {
  console.log("Empty Backend URL");
}

const api: AxiosInstance = axios.create({
  baseURL: originUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized: maybe refresh token logic here...");
    }
    return Promise.reject(error);
  }
);

// Request Middleware for each request
api.interceptors.request.use((config) => {
  const userInfo = useUserStore.getState().userInfo;
  const token = userInfo?._accessToken;

  if (config.headers?.skipAuth) {
    delete config.headers.skipAuth;
    return config;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export { api };
