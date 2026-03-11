import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "./api";

/* ============================
   ASYNC THUNKS
============================ */

// 🔹 Get all users
export const getAllUsers = createAsyncThunk(
  "users/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/get-user");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

// 🔹 Get user by ID
export const getUserById = createAsyncThunk(
  "users/getById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/get-user/${id}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

// 🔹 Update user
export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/user/update/${id}`, data);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update user"
      );
    }
  }
);

// 🔹 Delete user
export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/user/delete/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

// 🔹 Activate / Deactivate user
export const toggleUserStatus = createAsyncThunk(
  "users/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.put(`/user/act-deactive/${id}`);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update status"
      );
    }
  }
);

// 🔹 Get cricket access users
export const getCricketAccessUsers = createAsyncThunk(
  "users/getCricketAccess",
  async ({ page = 1, limit = 20, search = "" }, { rejectWithValue }) => {
    try {
      const res = await api.get(
        `/cricket/users?page=${page}&limit=${limit}&search=${search}`
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch cricket users"
      );
    }
  }
);

// 🔹 Update Admin Payment (USDT / UPI)
export const updateAdminPayment = createAsyncThunk(
  "users/updateAdminPayment",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.put("/update-payment", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update payment details"
      );
    }
  }
);

/* ============================
   SLICE
============================ */

const userAdminSlice = createSlice({
  name: "userAdmin",

  initialState: {
    users: [],
    selectedUser: null,

    cricketUsers: [],
    totalCricketUsers: 0,

    loadingUsers: false,
    loadingCricketUsers: false,
    actionLoading: false,

    // 🔽 Admin payment state
    paymentLoading: false,
    paymentSuccess: null,

    success: null,
    error: null,
  },

  reducers: {
    clearSelectedUser(state) {
      state.selectedUser = null;
    },
    clearError(state) {
      state.error = null;
    },
    clearSuccess(state) {
      state.success = null;
      state.paymentSuccess = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===== USERS LIST ===== */
      .addCase(getAllUsers.pending, (state) => {
        state.loadingUsers = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.error = action.payload;
      })

      /* ===== USER DETAILS ===== */
      .addCase(getUserById.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      /* ===== UPDATE USER ===== */
      .addCase(updateUser.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
        state.selectedUser = action.payload;
        state.success = "User updated successfully";
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      /* ===== DELETE USER ===== */
      .addCase(deleteUser.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.users = state.users.filter((u) => u._id !== action.payload);
        state.success = "User deleted successfully";
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      /* ===== TOGGLE USER STATUS ===== */
      .addCase(toggleUserStatus.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.users = state.users.map((u) =>
          u._id === action.payload._id ? action.payload : u
        );
        if (state.selectedUser?._id === action.payload._id) {
          state.selectedUser = action.payload;
        }
        state.success =
          action.payload.isActive === 1
            ? "User activated successfully"
            : "User deactivated successfully";
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      /* ===== CRICKET USERS ===== */
      .addCase(getCricketAccessUsers.pending, (state) => {
        state.loadingCricketUsers = true;
        state.error = null;
      })
      .addCase(getCricketAccessUsers.fulfilled, (state, action) => {
        state.loadingCricketUsers = false;
        state.cricketUsers = action.payload.data;
        state.totalCricketUsers = action.payload.total;
      })
      .addCase(getCricketAccessUsers.rejected, (state, action) => {
        state.loadingCricketUsers = false;
        state.error = action.payload;
      })

      /* ===== ADMIN PAYMENT ===== */
      .addCase(updateAdminPayment.pending, (state) => {
        state.paymentLoading = true;
        state.error = null;
      })
      .addCase(updateAdminPayment.fulfilled, (state) => {
        state.paymentLoading = false;
        state.paymentSuccess = "Payment details updated successfully";
      })
      .addCase(updateAdminPayment.rejected, (state, action) => {
        state.paymentLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSelectedUser,
  clearError,
  clearSuccess,
} = userAdminSlice.actions;

export default userAdminSlice.reducer;