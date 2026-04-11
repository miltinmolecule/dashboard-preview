import { type AxiosError } from "axios";

const RETRYABLE_STATUS_CODES = [408, 429, 500, 502, 503, 504];

export const shouldRetry = (error: AxiosError, retryCount: number): boolean => {
  if (retryCount >= 3) return false;
  if (!error.response) return true; // network error
  return RETRYABLE_STATUS_CODES.includes(error.response.status);
};

export const retryDelay = (retryCount: number): number => {
  return Math.min(1000 * 2 ** retryCount, 10000); // exponential backoff, max 10s
};
