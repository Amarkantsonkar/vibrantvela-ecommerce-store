import { createSlice } from "@reduxjs/toolkit";

function getUserFromStorage() {
  try {
    const user = localStorage.getItem("user");
    if (!user || user === "undefined") return null;
    return JSON.parse(user);
  } catch {
    return null;
  }
}

export const authSlice = createSlice({
  name: "Auth",
  initialState: {
    role: localStorage.getItem("role") || "",
    user: getUserFromStorage(),
    isAuthenticated: !!localStorage.getItem("token") || null,
  },

  reducers: {
    setUserLogin: (state, action) => {
      state.role = action.payload.user.role;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      localStorage.setItem("role", action.payload.user.role);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },

    setUserLogout: (state) => {
      const user = getUserFromStorage();
      const userId = user?.id || "guest";

      // ✅ Remove cart from localStorage
      localStorage.removeItem(`persist:cart_${userId}`);

      // ✅ Remove auth info
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;

      localStorage.removeItem("role");
      localStorage.removeItem("user");
      localStorage.removeItem("token");

      // ✅ Force reload to reset redux store
      window.location.reload();
    },
  },
});

export const { setUserLogin, setUserLogout } = authSlice.actions;
export default authSlice.reducer;
