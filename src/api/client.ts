import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_API_SECRET}`,
  },
});

export const fetchFromAPI = async (endpoint: string, params: object = {}) => {
  const response = await axiosInstance.get(endpoint, {
    params: { ...params },
  });
  return response.data;
};

export default axiosInstance;
