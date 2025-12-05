import { AxiosError } from "axios";

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Handle axios errors
    if (error.response?.data) {
      const data = error.response.data;

      // NestJS validation error format
      if (Array.isArray(data.message)) {
        return data.message.join(", ");
      }

      // Standard error message
      if (typeof data.message === "string") {
        return data.message;
      }

      // Generic error object
      if (data.error) {
        return data.error;
      }
    }

    // Network errors
    if (error.code === "ERR_NETWORK") {
      return "Network error. Please check your connection.";
    }

    // Default axios error message
    return error.message || "An error occurred";
  }

  // Standard Error object
  if (error instanceof Error) {
    return error.message;
  }

  // Unknown error
  return "An unexpected error occurred";
}

export function getApiError(error: unknown): ApiError {
  if (error instanceof AxiosError && error.response) {
    return {
      message: extractErrorMessage(error),
      statusCode: error.response.status,
      errors: error.response.data?.errors,
    };
  }

  return {
    message: extractErrorMessage(error),
  };
}
