import axios from 'axios';

const BASE_URL = import.meta.env.MODE === "development" ? import.meta.env.VITE_API_URL : "/api";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});