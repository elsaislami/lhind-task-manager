import axios from "axios";
import { API_URL } from "../utils/config";

export const getInstance = async (endpoint: string) => {
  const response = await axios.get(`${API_URL}/${endpoint}`);

  return response;
};

export const postInstance = async (endpoint: string, data: any) => {
  const response = await axios.post(`${API_URL}/${endpoint}`, data);

  return response;
};
