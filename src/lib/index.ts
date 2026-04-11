import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

export default api;
