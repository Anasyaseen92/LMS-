import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  name?: string;
  email?: string;
  role?: string;
  avatar?: {
    url?: string;
  };
};

type AuthState = {
  token: string;
  user: AuthUser | null;
};

const initialState: AuthState = {
  token: "",
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLogedIn: (
      state,
      action: PayloadAction<{ access_token: string; user: AuthUser }>
    ) => {
      state.token = action.payload.access_token;
      state.user = action.payload.user;
    },
    userLogout: (state) => {
      state.token = "";
      state.user = null;
    },
  },
});

export const { userRegistration, userLogedIn, userLogout } = authSlice.actions;
export default authSlice.reducer;
