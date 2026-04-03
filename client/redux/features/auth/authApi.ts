
import { apiSlice } from "../api/apiSlice";
import { userLogedIn, userLogout, userRegistration } from "./authSlice";


type RegistrationResponse = {
  message: string;
  activationtoken: string;
};

type RegistrationData = {
  name: string;
  email: string;
  password: string;
  avatar?: string;
};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //registration
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "registration",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.activationtoken,
            })
          );
        } catch {
        }
      },
    }),
    //activation
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "activate-user",
        method: "POST",
        body: {
          activation_token,
          activation_code,
        },
      }),
    }),
    //login
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: { email, password },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLogedIn({
              access_token: result.data.access_token,
              user: result.data.user,
            })
          );
        } catch {
        }
      },
    }),
    //social auth
    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: "social-auth",
        method: "POST",
        body: { email, name, avatar },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLogedIn({
              access_token: result.data.access_token,
              user: result.data.user,
            })
          );
        } catch {
        }
      },
    }),
    //logout
    logout: builder.query({
      query: () => ({
        url: "logout",
        method: "GET",
        credentials: "include" as const,
      }),
      async onQueryStarted(_arg, { dispatch }) {
        try {
          dispatch(userLogout());
        } catch {
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useActivationMutation,
  useLoginMutation,
  useSocialAuthMutation,
  useLogoutQuery,
} = authApi;
