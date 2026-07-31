import { useAuth } from "@clerk/react";
import axios from "axios";

export function useApi() {
  const { getToken } = useAuth();

  const getClient = async () => {
    const token = await getToken();
    return axios.create({
      baseURL:
        (import.meta as any).env?.VITE_API_URL ||
        (typeof window !== "undefined" && (window as any).process?.env?.VITE_API_URL) ||
        "http://localhost:5001/api",
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    });
  };

  return {
    get: async (url: string, config?: any) => {
      const client = await getClient();
      return client.get(url, config);
    },
    post: async (url: string, data?: any, config?: any) => {
      const client = await getClient();
      return client.post(url, data, config);
    },
    put: async (url: string, data?: any, config?: any) => {
      const client = await getClient();
      return client.put(url, data, config);
    },
    delete: async (url: string, config?: any) => {
      const client = await getClient();
      return client.delete(url, config);
    },
  };
}
export default useApi;
