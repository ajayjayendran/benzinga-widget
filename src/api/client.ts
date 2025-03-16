import axios from "axios";

const baseURL = "https://api.benzinga.com/api";

const API_KEY = "f090a778d74f4450a11ad417ad72740c";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const fetchFromAPI = async (endpoint: string, params: object = {}) => {
  const response = await axiosInstance.get(endpoint, {
    params: { ...params, token: API_KEY },
  });
  return response.data;
};

export default axiosInstance;
