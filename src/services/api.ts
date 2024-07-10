import axios, { AxiosInstance } from "axios";
import { API_URL } from "../utils/config";

// Get the access token from local storage
const accessToken = localStorage.getItem("accessToken");

// Create an instance of Axios with the base URL
export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
});

// Add an interceptor to include the access token in the request headers
axiosInstance.interceptors.request.use((config) => {
  // If there is an access token, add it to the Authorization header
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});