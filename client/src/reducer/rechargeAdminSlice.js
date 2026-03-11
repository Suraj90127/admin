import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api"; // <-- your axios instance


export const getTotalRechargeData = createAsyncThunk(
  "recharge/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/total-recharge/data"); 
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch recharge data"
      );
    }
  }
);

// 🔹 Approve / Reject recharge
export const rechargeDuet = createAsyncThunk(
  "recharge/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/recharge-duet/${id}`, { status });
      return { id, status, data: res.data };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Recharge action failed"
      );
    }
  }
);

/* ===============================
   SLICE
================================ */

const rechargeAdminSlice = createSlice({
  name: "recharge",
  initialState: {
    loading: false,
    actionLoading: false,
    recharges: [],
    success: false,
    message: "",
    error: null,
  },

  reducers: {
    resetRechargeState: (state) => {
      state.loading = false;
      state.actionLoading = false;
      state.success = false;
      state.message = "";
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ================= GET ALL ================= */

      .addCase(getTotalRechargeData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTotalRechargeData.fulfilled, (state, action) => {
        state.loading = false;
        state.recharges = action.payload.recharges || [];
        state.success = action.payload.success;
      })
      .addCase(getTotalRechargeData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ================= UPDATE STATUS ================= */

      .addCase(rechargeDuet.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(rechargeDuet.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;
        state.message = action.payload.data.message;

        // 🔥 update recharge status locally
        const index = state.recharges.findIndex(
          (r) => r._id === action.payload.id
        );
        if (index !== -1) {
          state.recharges[index].status = action.payload.status;
        }
      })
      .addCase(rechargeDuet.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetRechargeState } = rechargeAdminSlice.actions;
export default rechargeAdminSlice.reducer;