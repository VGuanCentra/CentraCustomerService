/*
 * VGuan_2024-06-05
 * Demo: "https://vgtest.centra.ca", // Your API base URL
 */

import axios from "axios";
import { getToken } from "../../msal/msal";

console.log(
  "axiosInstance process.env.NEXT_PUBLIC_BASE_API_URL:",
  process.env.NEXT_PUBLIC_BASE_API_URL
);

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  //baseURL: "https://vgtest.centra.ca",
  headers: {
    "Content-Type": "application/json", // By default
    // "Content-Type": "multipart/form-data",
    timeout: 1000,
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await getToken();
    // VGuan Debug:
    // console.log("axiosInstance AUTH TOKEN:", accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
