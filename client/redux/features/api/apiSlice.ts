import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLogedIn } from "../auth/authSlice";

const rawServerUrl = process.env.NEXT_PUBLIC_SERVER_URL?.trim();
const normalizedServerUrl = (rawServerUrl || "http://localhost:8000").replace(/\/+$/, "");
const apiBaseUrl = normalizedServerUrl.endsWith("/api/v1")
  ? normalizedServerUrl
  : `${normalizedServerUrl}/api/v1`;

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: ["Course", "User"],

  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
  }),
  endpoints: (builder) => ({
    refreshtoken: builder.query({
      query: () => ({
        url: "refereshtoken",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          // The /me endpoint returns { success: true, user: {...} } format
          if (result.data.success && result.data.user) {
            dispatch(
              userLogedIn({
                access_token: "", // access_token is handled via cookies
                user: result.data.user,
              })
            );
          }
        } catch (error) {
          const errorData = error as { data?: { message?: string } };
          console.log("Load user error:", errorData.data?.message || "Unknown error");
          // Even if the request fails, we need to complete the loading state
          // This prevents infinite loading when the server is unreachable
        }
      },
    }),
  }),
});
export const {
  useRefreshtokenQuery,
  useLoadUserQuery,
  useLazyRefreshtokenQuery,
} = apiSlice;
