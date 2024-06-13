/*
 * VGuan_2024-06-05
 */

import axios from "axios";
import { getToken } from "../../msal/msal";

const axiosInstance = axios.create({
  baseURL: "https://vgtest.centra.ca",// Your API base URL
  //baseURL: process.env.PUBLIC_BASE_API_URL,
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
    console.log("axiosInstance AUTH TOKEN:", accessToken);
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