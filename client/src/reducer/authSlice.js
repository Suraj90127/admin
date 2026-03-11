import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

/* =====================
   LOGIN
===================== */
export const adminLogin = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/login", formData, {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Login failed"
      );
    }
  }
);

/* =====================
   GET ADMIN INFO
===================== */
export const getAdminInfo = createAsyncThunk(
  "auth/getAdminInfo",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/info", {
        withCredentials: true,
      });
      return data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Fetch failed"
      );
    }
  }
);

/* =====================
   LOGOUT
===================== */
export const adminLogout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.post(
        "/logout",
        {},
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      return rejectWithValue("Logout failed");
    }
  }
);

/* =====================
   TOTAL MANAGER (DASHBOARD)
===================== */
export const fetchTotalManager = createAsyncThunk(
  "auth/fetchTotalManager",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/total-manager", {
        withCredentials: true,
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Dashboard fetch failed"
      );
    }
  }
);

/* =====================
   SLICE
===================== */
const authSlice = createSlice({
  name: "auth",

  initialState: {
    admin: null,
    token: localStorage.getItem("token"),
    isAuthenticated: !!localStorage.getItem("token"),

    loading: false,
    dashboardLoading: false,

    error: null,
    success: false,

    // 🔹 DASHBOARD DATA
    totalUsers: 0,
    totalActiveUsers: 0,
    totalDeactiveUsers: 0,
    totalSales: 0,
    totalPendingRecharge: 0,
    totalProviders: 0,
    totalGames: 0,
  },

  reducers: {
    clearState: (state) => {
      state.loading = false;
      state.dashboardLoading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder
      /* ===== LOGIN ===== */
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.admin = action.payload.admin || null;
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== ADMIN INFO ===== */
      .addCase(getAdminInfo.fulfilled, (state, action) => {
        state.admin = action.payload;
        state.isAuthenticated = true;
      })

      /* ===== LOGOUT ===== */
      .addCase(adminLogout.pending, (state) => {
        state.loading = true;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.loading = false;
        state.admin = null;
        state.token = null;
        state.isAuthenticated = false;

        // reset dashboard
        state.totalUsers = 0;
        state.totalActiveUsers = 0;
        state.totalDeactiveUsers = 0;
        state.totalSales = 0;
        state.totalPendingRecharge = 0;
        state.totalProviders = 0;
        state.totalGames = 0;

        localStorage.removeItem("token");
      })
      .addCase(adminLogout.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem("token");
      })

      /* ===== TOTAL MANAGER ===== */
      .addCase(fetchTotalManager.pending, (state) => {
        state.dashboardLoading = true;
        state.error = null;
      })
      .addCase(fetchTotalManager.fulfilled, (state, action) => {
        state.dashboardLoading = false;

        state.totalUsers = action.payload.totalUsers;
        state.totalActiveUsers = action.payload.totalActiveUsers;
        state.totalDeactiveUsers = action.payload.totalDeactiveUsers;
        state.totalSales = action.payload.totalSales;
        state.totalPendingRecharge = action.payload.totalPendingRecharge;
        state.totalProviders = action.payload.totalProviders;
        state.totalGames = action.payload.totalGames;
      })
      .addCase(fetchTotalManager.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearState } = authSlice.actions;
export default authSlice.reducer;