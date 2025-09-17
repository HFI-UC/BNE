import axios from "axios";

type ApiClientOptions = {
  baseURL?: string;
};

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api";

export const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const configureApiClient = (options: ApiClientOptions = {}) => {
  if (options.baseURL) {
    apiClient.defaults.baseURL = options.baseURL;
  }
};
