import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

/**
 * Shared RTK Query client for features that need cached server data.
 * Features add endpoints with `api.injectEndpoints(...)`.
 */
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL ?? "https://api.example.com",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { session?: { token: string | null } }).session?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: () => ({}),
});
