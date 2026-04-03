import { apiSlice } from "../api/apiSlice";
import { userLogedIn } from "../auth/authSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: "update-user-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include" as const,
      }),
    }),
    editProfile: builder.mutation({
      query: (data) => ({
        url: "update-user-info",
        method: "PUT",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(_arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          const data = result.data as { user?: unknown };
          if (data?.user) {
            const updatedUser = data.user as {
              name?: string;
              email?: string;
              role?: string;
              avatar?: { url?: string };
            };
            dispatch(
              userLogedIn({
                access_token: "",
                user: updatedUser,
              })
            );
          }
        } catch {
        }
      },
    }),
    updatePassword: builder.mutation({
      query: ({ newPassword, oldPassword }) => ({
        url: "update-user-password",
        method: "PUT",
        body: { newPassword, oldPassword },
        credentials: "include" as const,
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "get-all-users",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: "update-user-role",
        method: "PUT",
        body: { id, role },
        credentials: "include" as const,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `delete-user/${id}`,
        method: "DELETE",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const useUpdateAvatarMutation = userApi.useUpdateAvatarMutation;
export const useEditProfileMutation = userApi.useEditProfileMutation;
export const useUpdatePasswordMutation = userApi.useUpdatePasswordMutation;
export const useGetAllUsersQuery = userApi.useGetAllUsersQuery;
export const useUpdateUserRoleMutation = userApi.useUpdateUserRoleMutation;
export const useDeleteUserMutation = userApi.useDeleteUserMutation;
