import { useLogto } from "@logto/react";
import { useMemo } from "react";
import { toast } from 'react-hot-toast';
import { API_BASE_URL, API_RESOURCE } from "../config";

export type ApiError = {
  message: string;
  status?: number;
};

export class ApiRequestError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
  }
}

export const useApi = () => {
  const { getAccessToken } = useLogto();

  return useMemo(() => async (
    endpoint: string,
    options: RequestInit = {}
  )=> {
    try {
      const token = await getAccessToken(API_RESOURCE);

      if (!token) {
        throw new ApiRequestError("Failed to get access token");
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      if (!response.ok) {
        const error = await response.json() as ApiError;
        throw new ApiRequestError(
          error.message || `API request failed: ${response.statusText}`,
          response.status
        );
      }

      if (response.status === 204) {
        return undefined;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiRequestError) {
        toast.error(error.message);
        throw error;
      }
      const message = error instanceof Error ? error.message : String(error);
      toast.error(message);
      throw new ApiRequestError(message);
    }
  }, [getAccessToken]);
};
